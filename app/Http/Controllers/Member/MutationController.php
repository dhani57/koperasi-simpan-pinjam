<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MutationController extends Controller
{
    public function index()
    {
        $mutations = \App\Models\Mutation::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return inertia('Member/Mutations/Index', [
            'mutations' => $mutations
        ]);
    }
}
