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
        $messages = [
            'bank_account_number.numeric' => 'Nomor rekening bank hanya boleh berisi angka.',
            'bank_account_number.digits_between' => 'Nomor rekening bank tidak valid (maksimal 50 digit angka).',
            'retirement_month.max' => 'Bulan pensiun tidak boleh lebih dari 12.',
            'retirement_month.min' => 'Bulan pensiun tidak boleh kurang dari 1.',
            'retirement_month.integer' => 'Bulan pensiun harus berupa angka bulat.',
            'monthly_simpanan_wajib.min' => 'Iuran simpanan wajib per bulan minimal Rp 50.000.',
            'identity_number.unique' => 'NIP/NIM ini sudah terdaftar di sistem.',
            'email.unique' => 'Email ini sudah terdaftar di sistem.',
        ];

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'identity_number' => 'required|string|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'department' => 'required|string|max:100',
            'joined_at' => 'required|date',
            'retirement_month' => 'nullable|integer|min:1|max:12',
            'retirement_year' => 'nullable|integer|min:2020',
            'monthly_simpanan_wajib' => 'required|numeric|min:50000',
            'simpanan_pokok_balance' => 'nullable|numeric|min:0',
            'simpanan_wajib_balance' => 'nullable|numeric|min:0',
            'simpanan_sukarela_balance' => 'nullable|numeric|min:0',
            'bank_account_number' => 'nullable|numeric|digits_between:1,50',
            'roles' => ['required', 'array', 'min:1', 'max:2'],
            'roles.*' => [Rule::in(['anggota', 'bendahara', 'pengurus', 'ketua', 'pengawas'])],
        ], $messages);

        $initialPokok = $validated['simpanan_pokok_balance'] ?? 0;
        $initialWajib = $validated['simpanan_wajib_balance'] ?? 0;
        $initialSukarela = $validated['simpanan_sukarela_balance'] ?? 0;
        
        $validated['simpanan_pokok_balance'] = $initialPokok;
        $validated['simpanan_wajib_balance'] = $initialWajib;
        $validated['simpanan_sukarela_balance'] = $initialSukarela;
        $validated['max_salary_deduction_limit'] = 0;
        $validated['password'] = bcrypt($validated['identity_number']);

        $roles = $validated['roles'];
        if (count($roles) === 2 && !in_array('anggota', $roles)) {
            return back()->withErrors(['roles' => 'Jika memilih 2 peran, salah satunya harus Anggota.'])->withInput();
        }

        $validated['is_anggota'] = in_array('anggota', $roles);
        $adminRoles = array_diff($roles, ['anggota']);
        $validated['role'] = count($adminRoles) > 0 ? array_values($adminRoles)[0] : 'anggota';
        unset($validated['roles']);

        \Illuminate\Support\Facades\DB::transaction(function () use ($validated, $initialPokok, $initialWajib, $initialSukarela) {
            $user = User::create($validated);

            if ($initialPokok > 0) {
                \App\Models\Mutation::create([
                    'user_id' => $user->id,
                    'type' => 'simpanan_pokok',
                    'saving_type' => 'pokok',
                    'amount' => $initialPokok,
                    'balance_after' => $initialPokok,
                    'description' => 'Migrasi Saldo Pokok Sebelumnya'
                ]);
            }
            if ($initialWajib > 0) {
                \App\Models\Mutation::create([
                    'user_id' => $user->id,
                    'type' => 'simpanan_wajib',
                    'saving_type' => 'wajib',
                    'amount' => $initialWajib,
                    'balance_after' => $initialWajib,
                    'description' => 'Migrasi Saldo Wajib Sebelumnya'
                ]);
            }
            if ($initialSukarela > 0) {
                \App\Models\Mutation::create([
                    'user_id' => $user->id,
                    'type' => 'simpanan_sukarela',
                    'saving_type' => 'sukarela',
                    'amount' => $initialSukarela,
                    'balance_after' => $initialSukarela,
                    'description' => 'Migrasi Saldo Sukarela Sebelumnya'
                ]);
            }
        });

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'user_created',
            "Menambahkan anggota/user baru dengan email: {$validated['email']}"
        );

        return redirect()->route('admin.users.index')->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        return inertia('Admin/Users/Edit', ['user' => $user]);
    }

    public function update(Request $request, User $user)
    {
        $messages = [
            'bank_account_number.numeric' => 'Nomor rekening bank hanya boleh berisi angka.',
            'bank_account_number.digits_between' => 'Nomor rekening bank tidak valid (maksimal 50 digit angka).',
            'retirement_month.max' => 'Bulan pensiun tidak boleh lebih dari 12.',
            'retirement_month.min' => 'Bulan pensiun tidak boleh kurang dari 1.',
            'retirement_month.integer' => 'Bulan pensiun harus berupa angka bulat.',
            'identity_number.unique' => 'NIP/NIM ini sudah terdaftar di sistem.',
            'email.unique' => 'Email ini sudah terdaftar di sistem.',
        ];

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'identity_number' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'roles' => ['required', 'array', 'min:1', 'max:2'],
            'roles.*' => [Rule::in(['anggota', 'bendahara', 'pengurus', 'ketua', 'pengawas'])],
            'monthly_simpanan_wajib' => 'required|numeric|min:0',
            'monthly_simpanan_sukarela' => 'nullable|numeric|min:0',
            'max_salary_deduction_limit' => 'required|numeric|min:0',
            'bank_account_number' => 'nullable|numeric|digits_between:1,50',
            'retirement_month' => 'nullable|integer|min:1|max:12',
            'retirement_year' => 'nullable|integer|min:2020',
            'department' => 'nullable|string|max:100',
            'job_title' => 'nullable|string|max:100',
            'job_start_date' => 'nullable|date',
            'job_end_date' => 'nullable|date',
            'joined_at' => 'nullable|date',
            'password' => 'nullable|string|min:8|confirmed',
        ], $messages);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $roles = $validated['roles'];
        if (count($roles) === 2 && !in_array('anggota', $roles)) {
            return back()->withErrors(['roles' => 'Jika memilih 2 peran, salah satunya harus Anggota.'])->withInput();
        }

        $validated['is_anggota'] = in_array('anggota', $roles);
        $adminRoles = array_diff($roles, ['anggota']);
        $validated['role'] = count($adminRoles) > 0 ? array_values($adminRoles)[0] : 'anggota';
        unset($validated['roles']);

        $user->update($validated);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'user_updated',
            "Memperbarui data anggota/user dengan email: {$user->email}"
        );

        return redirect()->route('admin.users.index')->with('success', 'Data anggota berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $email = $user->email;
        $user->delete();

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'user_deleted',
            "Menghapus data anggota/user dengan email: {$email}"
        );
        return redirect()->route('admin.users.index')->with('success', 'Anggota berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:10240'
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\UsersImport, $request->file('file'));
            
            app(\App\Services\AuditLogService::class)->log(
                auth()->user(),
                'user_imported',
                "Mengimport data anggota dari file Excel"
            );

            return back()->with('success', 'Data anggota berhasil diimport.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal import data: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        $headers = [
            'nama', 'email', 'nik', 'no_telepon', 'departemen', 'jabatan',
            'tanggal_mulai_kerja', 'tanggal_selesai_kerja', 'no_rekening_bank',
            'bulan_pensiun', 'tahun_pensiun', 'simpanan_wajib_per_bulan',
            'simpanan_sukarela_per_bulan', 'saldo_simpanan_pokok', 
            'saldo_simpanan_wajib', 'saldo_simpanan_sukarela', 
            'batas_potongan_gaji', 'password'
        ];
        
        $export = new class($headers) implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings {
            private $headers;
            public function __construct($headers) { $this->headers = $headers; }
            public function array(): array {
                return [
                    [
                        'John Doe', 'john@example.com', '1234567890123456', '081234567890', 
                        'IT', 'Staff', '2020-01-01', '', '1234567890', 
                        '12', '2040', '100000', '50000', '100000', '500000', '0', '2000000', 'password123'
                    ]
                ];
            }
            public function headings(): array { return $this->headers; }
        };

        return \Maatwebsite\Excel\Facades\Excel::download($export, 'import_users_template.xlsx');
    }
}
