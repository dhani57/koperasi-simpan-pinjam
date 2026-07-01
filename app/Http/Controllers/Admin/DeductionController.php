<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DeductionPeriod;
use App\Models\DeductionDetail;
use App\Models\User;
use App\Models\Loan;

class DeductionController extends Controller
{
    public function index()
    {
        if (!in_array(auth()->user()->role, ['bendahara', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        $periods = DeductionPeriod::orderBy('year', 'desc')->orderBy('month', 'desc')->paginate(10);
        
        $inactiveMonthsSetting = \App\Models\Setting::where('key', 'inactive_months')->value('value');
        $inactiveMonths = $inactiveMonthsSetting ? json_decode($inactiveMonthsSetting, true) : [];

        return inertia('Admin/Deductions/Index', [
            'periods' => $periods,
            'inactiveMonths' => $inactiveMonths
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'period_date' => 'required|date',
        ]);

        $date = \Carbon\Carbon::parse($request->period_date);
        $month = $date->month;
        $year = $date->year;

        // Check if period already exists
        $existing = DeductionPeriod::where('month', $month)
            ->where('year', $year)
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Tagihan untuk periode ini sudah pernah di-generate.');
        }

        try {
            $period = DeductionPeriod::create([
                'month' => $month,
                'year' => $year,
                'status' => 'proses',
                'is_active' => true,
            ]);

            // Dispatch job instead of running synchronously
            \App\Jobs\ProcessMonthlyDeduction::dispatch($period);

            app(\App\Services\AuditLogService::class)->log(
                auth()->user(),
                'deduction_generated',
                "Memulai proses generate tagihan bulanan untuk periode {$month}/{$year}"
            );

            return redirect()->back()->with('success', 'Berhasil memulai proses antrean generate tagihan potongan bulanan. Silakan tunggu beberapa saat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal generate tagihan: ' . $e->getMessage());
        }
    }

    public function show(DeductionPeriod $deduction)
    {
        if (!in_array(auth()->user()->role, ['bendahara', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        // Calculate totals for the entire period
        $totals = \App\Models\DeductionDetail::where('deduction_period_id', $deduction->id)
            ->selectRaw('SUM(simpanan_wajib_amount + simpanan_sukarela_amount) as total_saving, SUM(loan_principal_amount) as total_loan_principal, SUM(loan_fee_amount) as total_loan_fee, SUM(admin_fee_amount) as total_admin_fee')
            ->first();

        $details = \App\Models\DeductionDetail::with('user')
            ->where('deduction_period_id', $deduction->id)
            ->paginate(10)
            ->withQueryString();
        
        return inertia('Admin/Deductions/Show', [
            'period' => $deduction,
            'details' => $details,
            'totals' => [
                'total_saving' => $totals->total_saving ?? 0,
                'total_loan' => ($totals->total_loan_principal ?? 0) + ($totals->total_loan_fee ?? 0),
            ]
        ]);
    }

    public function markAsSelesai(DeductionPeriod $deduction)
    {
        if (auth()->user()->role !== 'bendahara') {
            abort(403, 'Unauthorized action.');
        }

        if ($deduction->status === 'selesai') {
            return redirect()->back()->with('error', 'Tagihan ini sudah ditandai selesai.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($deduction) {
            $deduction->update(['status' => 'selesai']);

            $details = DeductionDetail::where('deduction_period_id', $deduction->id)
                ->where('status', 'menunggu')
                ->get();

            $monthNames = [
                1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
                5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
                9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
            ];
            $monthName = $monthNames[(int)$deduction->month];

            foreach ($details as $detail) {
                // Mark detail as success
                $detail->update(['status' => 'berhasil']);
                
                $user = User::find($detail->user_id);

                // Handle Wajib Saving
                if ($detail->simpanan_wajib_amount > 0) {
                    $user->simpanan_wajib_balance += $detail->simpanan_wajib_amount;
                    $user->save();

                    \App\Models\Mutation::create([
                        'user_id' => $user->id,
                        'type' => 'simpanan_wajib',
                        'saving_type' => 'wajib',
                        'amount' => $detail->simpanan_wajib_amount,
                        'balance_after' => $user->simpanan_wajib_balance,
                        'description' => "Potongan simpanan wajib bulan {$monthName} tahun {$deduction->year}",
                    ]);
                }

                // Handle Sukarela Saving
                if ($detail->simpanan_sukarela_amount > 0) {
                    $user->simpanan_sukarela_balance += $detail->simpanan_sukarela_amount;
                    $user->save();

                    \App\Models\Mutation::create([
                        'user_id' => $user->id,
                        'type' => 'simpanan_sukarela',
                        'saving_type' => 'sukarela',
                        'amount' => $detail->simpanan_sukarela_amount,
                        'balance_after' => $user->simpanan_sukarela_balance,
                        'description' => "Potongan simpanan sukarela bulan {$monthName} tahun {$deduction->year}",
                    ]);
                }

                // Handle Loan Payment
                if ($detail->loan_id) {
                    $loan = Loan::find($detail->loan_id);
                    if ($loan) {
                        $loan->current_remaining_principal -= $detail->loan_principal_amount;
                        if ($loan->current_remaining_principal <= 0) {
                            $loan->status = 'lunas';
                        }
                        $loan->save();

                        // Mutation for principal
                        \App\Models\Mutation::create([
                            'user_id' => $user->id,
                            'type' => 'angsuran_pokok',
                            'amount' => $detail->loan_principal_amount,
                            'balance_after' => $user->total_saving_balance, // balance doesn't change for loan payment, but we record the current saving balance
                            'description' => "Pembayaran cicilan pokok pinjaman bulan {$monthName} tahun {$deduction->year}",
                        ]);

                        // Mutation for fee
                        if ($detail->loan_fee_amount > 0) {
                            \App\Models\Mutation::create([
                                'user_id' => $user->id,
                                'type' => 'angsuran_jasa',
                                'amount' => $detail->loan_fee_amount,
                                'balance_after' => $user->total_saving_balance,
                                'description' => "Pembayaran jasa pinjaman bulan {$monthName} tahun {$deduction->year}",
                            ]);
                        }

                        // Handle Admin Fee (if any)
                        if ($detail->admin_fee_amount > 0) {
                            \App\Models\Mutation::create([
                                'user_id' => $user->id,
                                'type' => 'admin_fee',
                                'amount' => $detail->admin_fee_amount,
                                'balance_after' => $user->total_saving_balance,
                                'description' => "Biaya admin pinjaman bulan {$monthName} tahun {$deduction->year}",
                            ]);
                        }
                    }
                }
            }
        });

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'deduction_completed',
            "Menyelesaikan tagihan bulanan periode {$deduction->month}/{$deduction->year}"
        );

        return redirect()->back()->with('success', 'Status tagihan bulanan berhasil ditandai selesai dan transaksi telah dicatat.');
    }

    public function export(DeductionPeriod $deduction)
    {
        if (!in_array(auth()->user()->role, ['bendahara', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        $details = DeductionDetail::with('user')->where('deduction_period_id', $deduction->id)->get();

        $fileName = 'Potongan_Koperasi_' . str_pad($deduction->month, 2, '0', STR_PAD_LEFT) . '_' . $deduction->year . '.xls';
        $headers = [
            "Content-type"        => "application/vnd.ms-excel",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($details) {
            echo "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body>";
            echo "<table border='1' style='border-collapse: collapse;'>";
            echo "<thead><tr>";
            echo "<th style='padding: 8px; background-color: #0f4c81; color: #ffffff;'>No.</th>";
            echo "<th style='padding: 8px; background-color: #0f4c81; color: #ffffff;'>NIP/NIM</th>";
            echo "<th style='padding: 8px; background-color: #0f4c81; color: #ffffff;'>Nama Anggota</th>";
            echo "<th style='padding: 8px; background-color: #0f4c81; color: #ffffff;'>Potongan Simpanan</th>";
            echo "<th style='padding: 8px; background-color: #0f4c81; color: #ffffff;'>Potongan Pinjaman</th>";
            echo "<th style='padding: 8px; background-color: #0f4c81; color: #ffffff;'>Total Potongan</th>";
            echo "</tr></thead><tbody>";
            
            $no = 1;
            foreach ($details as $row) {
                $loanTotal = $row->loan_principal_amount + $row->loan_fee_amount + $row->admin_fee_amount;
                $savingTotal = $row->simpanan_wajib_amount + $row->simpanan_sukarela_amount;
                $total = $savingTotal + $loanTotal;
                
                echo "<tr>";
                echo "<td style='padding: 8px; text-align: center;'>{$no}</td>";
                echo "<td style='padding: 8px; text-align: center; mso-number-format: \"\\@\";'>" . $row->user->identity_number . "</td>";
                echo "<td style='padding: 8px;'>" . $row->user->name . "</td>";
                echo "<td style='padding: 8px; text-align: right;'>Rp " . number_format($savingTotal, 0, ',', '.') . "</td>";
                echo "<td style='padding: 8px; text-align: right;'>Rp " . number_format($loanTotal, 0, ',', '.') . "</td>";
                echo "<td style='padding: 8px; text-align: right;'>Rp " . number_format($total, 0, ',', '.') . "</td>";
                echo "</tr>";
                $no++;
            }
            echo "</tbody></table></body></html>";
        };

        return response()->stream($callback, 200, $headers);
    }

    public function approve(DeductionPeriod $deduction)
    {
        if (auth()->user()->role !== 'ketua') {
            abort(403, 'Unauthorized action.');
        }

        if ($deduction->status !== 'draf') {
            return redirect()->back()->with('error', 'Tagihan ini bukan draf atau sudah disetujui.');
        }

        $deduction->update([
            'status' => 'disetujui_ketua',
            'confirmed_by' => auth()->id(),
            'confirmed_at' => now(),
        ]);

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'deduction_approved',
            "Menyetujui daftar tagihan potongan bulanan periode {$deduction->month}/{$deduction->year}"
        );

        return redirect()->back()->with('success', 'Tagihan bulanan berhasil disetujui.');
    }
}
