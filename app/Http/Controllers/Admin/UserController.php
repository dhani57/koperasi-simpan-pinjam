<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        if (!in_array(auth()->user()->role, ['pengurus', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        $search = request('search');

        $users = User::when($search, function ($query, $search) {
            $query->whereRaw('lower(name) like lower(?)', ["%{$search}%"])
                  ->orWhereRaw('lower(identity_number) like lower(?)', ["%{$search}%"])
                  ->orWhereRaw('lower(email) like lower(?)', ["%{$search}%"]);
        })->latest()->paginate(10)->appends(request()->query());

        return inertia('Admin/Users/Index', [
            'users' => $users,
            'filters' => ['search' => $search]
        ]);
    }

    public function create()
    {
        return inertia('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'identity_number' => 'required|string|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(['anggota', 'bendahara', 'pengurus', 'ketua', 'pengawas'])],
            'monthly_saving_nominal' => 'required|numeric|min:0',
            'max_salary_deduction_limit' => 'required|numeric|min:0',
            'total_saving_balance' => 'nullable|numeric|min:0',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $initialBalance = $validated['total_saving_balance'] ?? 0;
        $validated['total_saving_balance'] = $initialBalance;

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $initialBalance) {
            $user = User::create($validated);

            if ($initialBalance > 0) {
                \App\Models\Mutation::create([
                    'user_id' => $user->id,
                    'type' => 'simpanan',
                    'amount' => $initialBalance,
                    'balance_after' => $initialBalance,
                    'description' => 'Migrasi Saldo Simpanan Sebelumnya'
                ]);
            }
        });

        return redirect()->route('admin.users.index')->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        return inertia('Admin/Users/Edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'identity_number' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(['anggota', 'bendahara', 'pengurus', 'ketua', 'pengawas'])],
            'monthly_saving_nominal' => 'required|numeric|min:0',
            'max_salary_deduction_limit' => 'required|numeric|min:0',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('admin.users.index')->with('success', 'Data anggota berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'Anggota berhasil dihapus.');
    }
}
