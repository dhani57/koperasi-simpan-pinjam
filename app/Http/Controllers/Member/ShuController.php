<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShuController extends Controller
{
    public function index()
    {
        return inertia('Member/Shu/Index', [
            'totalShu' => 2150000,
            'porsiSimpanan' => 1150000,
            'porsiPinjaman' => 1000000,
            'persenKontribusiAset' => 4.2,
            'totalSimpananAkumulasi' => 15400000,
            'totalJasaPinjaman' => 450000,
            'tahunBuku' => 2025
        ]);
    }
}
