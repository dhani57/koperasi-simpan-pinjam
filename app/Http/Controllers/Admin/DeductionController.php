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

        $details = DeductionDetail::with('user')->where('deduction_period_id', $deduction->id)->get();
        
        return inertia('Admin/Deductions/Show', [
            'period' => $deduction,
            'details' => $details
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

            foreach ($details as $detail) {
                // Mark detail as success
                $detail->update(['status' => 'berhasil']);
                
                $user = User::find($detail->user_id);

                // Handle Routine Saving
                if ($detail->routine_saving_amount > 0) {
                    $user->total_saving_balance += $detail->routine_saving_amount;
                    $user->save();

                    \App\Models\Mutation::create([
                        'user_id' => $user->id,
                        'type' => 'simpanan_rutin',
                        'amount' => $detail->routine_saving_amount,
                        'balance_after' => $user->total_saving_balance,
                        'description' => "Potongan simpanan rutin bulan " . str_pad($deduction->month, 2, '0', STR_PAD_LEFT) . " tahun " . $deduction->year,
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
                            'description' => "Pembayaran cicilan pokok pinjaman bulan " . str_pad($deduction->month, 2, '0', STR_PAD_LEFT) . " tahun " . $deduction->year,
                        ]);

                        // Mutation for fee
                        if ($detail->loan_fee_amount > 0) {
                            \App\Models\Mutation::create([
                                'user_id' => $user->id,
                                'type' => 'angsuran_jasa',
                                'amount' => $detail->loan_fee_amount,
                                'balance_after' => $user->total_saving_balance,
                                'description' => "Pembayaran jasa pinjaman bulan " . str_pad($deduction->month, 2, '0', STR_PAD_LEFT) . " tahun " . $deduction->year,
                            ]);
                        }
                    }
                }
            }
        });

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
            echo "<thead><tr style='background-color: #0f4c81; color: #ffffff;'>";
            echo "<th style='padding: 8px;'>No.</th>";
            echo "<th style='padding: 8px;'>NIP/NIM</th>";
            echo "<th style='padding: 8px;'>Nama Anggota</th>";
            echo "<th style='padding: 8px;'>Potongan Simpanan</th>";
            echo "<th style='padding: 8px;'>Potongan Pinjaman</th>";
            echo "<th style='padding: 8px;'>Total Potongan</th>";
            echo "</tr></thead><tbody>";
            
            $no = 1;
            foreach ($details as $row) {
                $loanTotal = $row->loan_principal_amount + $row->loan_fee_amount;
                $total = $row->routine_saving_amount + $loanTotal;
                
                echo "<tr>";
                echo "<td style='padding: 8px; text-align: center;'>{$no}</td>";
                echo "<td style='padding: 8px; text-align: center; mso-number-format: \"\\@\";'>" . $row->user->identity_number . "</td>";
                echo "<td style='padding: 8px;'>" . $row->user->name . "</td>";
                echo "<td style='padding: 8px; text-align: right;'>Rp " . number_format($row->routine_saving_amount, 0, ',', '.') . "</td>";
                echo "<td style='padding: 8px; text-align: right;'>Rp " . number_format($loanTotal, 0, ',', '.') . "</td>";
                echo "<td style='padding: 8px; text-align: right;'>Rp " . number_format($total, 0, ',', '.') . "</td>";
                echo "</tr>";
                $no++;
            }
            echo "</tbody></table></body></html>";
        };

        return response()->stream($callback, 200, $headers);
    }
}
