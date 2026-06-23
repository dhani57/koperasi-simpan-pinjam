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

        $mutations = Mutation::with('user')->latest()->paginate(15);
        return inertia('Admin/Mutations/Index', ['mutations' => $mutations]);
    }
}
