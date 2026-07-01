<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShuController extends Controller
{
    public function index(\App\Services\ShuService $shuService)
    {
        $year = request('year', now()->year);
        $search = request('search');
        
        $shuPeriod = \App\Models\ShuPeriod::where('year', $year)->first();
        
        $shuData = $shuService->calculateEstimatedShu($year);

        if ($search) {
            $shuData['member_proportions'] = array_filter($shuData['member_proportions'], function ($item) use ($search) {
                return stripos($item['user']->name, $search) !== false;
            });
            $shuData['member_proportions'] = array_values($shuData['member_proportions']);
        }

        $isDistributed = $shuPeriod ? $shuPeriod->status === 'selesai' : false;
        $hasDraft = $shuPeriod ? in_array($shuPeriod->status, ['draf', 'disetujui_ketua']) : false;

        // Just display a page to trigger SHU
        return inertia('Admin/Shu/Index', [
            'year' => $year,
            'shuData' => $shuData,
            'filters' => ['search' => $search],
            'isDistributed' => $isDistributed,
            'hasDraft' => $hasDraft
        ]);
    }

    public function store(Request $request)
    {
        $year = $request->input('year', now()->year);
        $totalJasaIncome = $request->input('total_jasa_income', 0);
        $persenDanaSosial = $request->input('persen_dana_sosial', 5);
        $persenThrPengurus = $request->input('persen_thr_pengurus', 5);
        $persenSimpanan = $request->input('persen_shu_simpanan', 40);
        $persenJasa = $request->input('persen_shu_jasa', 40);
        $persenModal = $request->input('persen_modal', 10);

        // Validation for total percentage = 100
        $totalPersen = $persenDanaSosial + $persenThrPengurus + $persenSimpanan + $persenJasa + $persenModal;
        if ($totalPersen !== 100) {
            return redirect()->back()->with('error', 'Total persentase harus tepat 100%. Saat ini: ' . $totalPersen . '%');
        }

        $nominalDanaSosial = $totalJasaIncome * ($persenDanaSosial / 100);
        $nominalThrPengurus = $totalJasaIncome * ($persenThrPengurus / 100);
        $nominalSimpanan = $totalJasaIncome * ($persenSimpanan / 100);
        $nominalJasa = $totalJasaIncome * ($persenJasa / 100);
        $nominalModal = $totalJasaIncome * ($persenModal / 100);

        $shuPeriod = \App\Models\ShuPeriod::where('year', $year)->first();

        if ($shuPeriod && $shuPeriod->status === 'selesai') {
            return redirect()->back()->with('error', "SHU tahun {$year} telah didistribusikan.");
        }

        if (!$shuPeriod) {
            $shuPeriod = \App\Models\ShuPeriod::create([
                'year' => $year,
                'total_jasa_income' => $totalJasaIncome,
                'persen_dana_sosial' => $persenDanaSosial,
                'persen_thr_pengurus' => $persenThrPengurus,
                'persen_shu_simpanan' => $persenSimpanan,
                'persen_shu_jasa' => $persenJasa,
                'persen_modal' => $persenModal,
                'nominal_dana_sosial' => $nominalDanaSosial,
                'nominal_thr' => $nominalThrPengurus,
                'nominal_shu_simpanan' => $nominalSimpanan,
                'nominal_shu_jasa' => $nominalJasa,
                'nominal_modal' => $nominalModal,
                'status' => 'draf',
            ]);
        } else {
            $shuPeriod->update([
                'total_jasa_income' => $totalJasaIncome,
                'persen_dana_sosial' => $persenDanaSosial,
                'persen_thr_pengurus' => $persenThrPengurus,
                'persen_shu_simpanan' => $persenSimpanan,
                'persen_shu_jasa' => $persenJasa,
                'persen_modal' => $persenModal,
                'nominal_dana_sosial' => $nominalDanaSosial,
                'nominal_thr' => $nominalThrPengurus,
                'nominal_shu_simpanan' => $nominalSimpanan,
                'nominal_shu_jasa' => $nominalJasa,
                'nominal_modal' => $nominalModal,
                'status' => 'draf',
            ]);
        }

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'shu_generated',
            "Membuat draft perhitungan SHU tahun {$year}"
        );
        
        return redirect()->back()->with('success', 'Draft perhitungan SHU berhasil dibuat dan menunggu persetujuan Ketua.');
    }

    public function approve(Request $request, \App\Services\ShuService $shuService)
    {
        $year = $request->query('year', now()->year);
        $shuPeriod = \App\Models\ShuPeriod::where('year', $year)->first();

        if (!$shuPeriod || $shuPeriod->status === 'selesai') {
            return redirect()->back()->with('error', "SHU tahun {$year} belum draf atau telah didistribusikan.");
        }

        if (auth()->user()->role === 'ketua') {
            if ($shuPeriod->status === 'draf') {
                $shuPeriod->update([
                    'status' => 'disetujui_ketua',
                    'ketua_approved_at' => now(),
                    'ketua_approved_by' => auth()->id()
                ]);
                return redirect()->back()->with('success', 'SHU disetujui Ketua. Menunggu distribusi.');
            }
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($year, $shuService, $shuPeriod) {
            $shuData = $shuService->calculateEstimatedShu($year);

            foreach ($shuData['member_proportions'] as $memberData) {
                if ($memberData['nominal_shu'] > 0) {
                    $user = \App\Models\User::find($memberData['user']->id);
                    $amount = $memberData['nominal_shu'];
                    
                    \App\Models\Mutation::create([
                        'user_id' => $user->id,
                        'type' => 'shu_distribution',
                        'saving_type' => 'sukarela',
                        'amount' => $amount,
                        'balance_after' => $user->simpanan_sukarela_balance + $amount,
                        'description' => "Pembagian SHU Tahun {$year}",
                    ]);

                    $user->simpanan_sukarela_balance += $amount;
                    $user->save();
                }
            }

            $shuPeriod->update([
                'status' => 'selesai',
            ]);
        });

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'shu_approved',
            "Menyetujui distribusi SHU tahun {$year}"
        );
        return redirect()->back()->with('success', 'Distribusi SHU telah disetujui dan dibagikan ke saldo anggota.');
    }
}
