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
        
        $shuData = $shuService->calculateEstimatedShu($year);

        if ($search) {
            $shuData['member_proportions'] = array_filter($shuData['member_proportions'], function ($item) use ($search) {
                return stripos($item['user']->name, $search) !== false;
            });
            $shuData['member_proportions'] = array_values($shuData['member_proportions']);
        }

        $isDistributed = \App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists();
        $hasDraft = \App\Models\Setting::where('key', 'shu_draft_' . $year)->exists();

        if ($hasDraft || $isDistributed) {
            $drafts = \App\Models\ShuDraft::where('year', $year)->get()->keyBy('user_id');
            foreach ($shuData['member_proportions'] as &$item) {
                if (isset($drafts[$item['user']->id])) {
                    $item['nominal_shu'] = (float) $drafts[$item['user']->id]->nominal_shu;
                }
            }
        }

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
        $year = $request->query('year', now()->year);

        if (\App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists()) {
            return redirect()->back()->with('error', "SHU tahun {$year} telah didistribusikan.");
        }

        if (\App\Models\Setting::where('key', 'shu_draft_' . $year)->exists()) {
            return redirect()->back()->with('error', "Draf SHU tahun {$year} sudah dikirim.");
        }

        $editedShu = $request->input('edited_shu', []);

        \Illuminate\Support\Facades\DB::transaction(function () use ($year, $editedShu) {
            foreach ($editedShu as $item) {
                \App\Models\ShuDraft::updateOrCreate(
                    ['year' => $year, 'user_id' => $item['userId']],
                    ['nominal_shu' => $item['nominal']]
                );
            }

            \App\Models\Setting::updateOrCreate(
                ['key' => 'shu_draft_' . $year],
                ['value' => '1']
            );
        });

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

        if (\App\Models\Setting::where('key', 'shu_distributed_' . $year)->exists()) {
            return redirect()->back()->with('error', "SHU tahun {$year} telah didistribusikan.");
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($year, $shuService) {
            $shuData = $shuService->calculateEstimatedShu($year);
            $drafts = \App\Models\ShuDraft::where('year', $year)->get()->keyBy('user_id');

            foreach ($shuData['member_proportions'] as $memberData) {
                $amount = isset($drafts[$memberData['user']->id]) ? (float) $drafts[$memberData['user']->id]->nominal_shu : $memberData['nominal_shu'];
                
                if ($amount > 0) {
                    $user = \App\Models\User::find($memberData['user']->id);
                    
                    \App\Models\Mutation::create([
                        'user_id' => $user->id,
                        'type' => 'shu_distribution',
                        'amount' => $amount,
                        'balance_after' => $user->total_saving_balance + $amount,
                        'description' => "Pembagian SHU Tahun {$year}",
                    ]);

                    $user->total_saving_balance += $amount;
                    $user->save();
                }
            }

            \App\Models\Setting::updateOrCreate(
                ['key' => 'shu_distributed_' . $year],
                ['value' => '1']
            );
        });

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'shu_approved',
            "Menyetujui distribusi SHU tahun {$year}"
        );
        return redirect()->back()->with('success', 'Distribusi SHU telah disetujui dan dibagikan ke saldo anggota.');
    }
}
