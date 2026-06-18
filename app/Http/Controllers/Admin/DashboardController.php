<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('Admin/Dashboard', [
            'stats' => [
                'total_members' => \App\Models\User::where('role', 'anggota')->count(),
                'total_savings' => \App\Models\User::sum('total_saving_balance'),
            ]
        ]);
    }
}
