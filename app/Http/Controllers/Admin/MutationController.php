<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mutation;

class MutationController extends Controller
{
    public function index()
    {
        if (!in_array(auth()->user()->role, ['pengawas', 'bendahara', 'ketua'])) {
            abort(403, 'Unauthorized action.');
        }

        $search = request('search');

        $mutations = Mutation::with('user')
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->whereRaw('lower(name) like lower(?)', ["%{$search}%"]);
                })->orWhereRaw('lower(description) like lower(?)', ["%{$search}%"])
                  ->orWhereRaw('lower(type) like lower(?)', ["%{$search}%"]);
            })
            ->latest()
            ->paginate(15)
            ->appends(request()->query());

        return inertia('Admin/Mutations/Index', [
            'mutations' => $mutations,
            'filters' => ['search' => $search]
        ]);
    }
}
