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

        $periods = DeductionPeriod::latest('period_date')->paginate(10);
        return inertia('Admin/Deductions/Index', ['periods' => $periods]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'bendahara') {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'period_date' => 'required|date',
        ]);

        $date = \Carbon\Carbon::parse($request->period_date);
        $month = $date->month;
        $year = $date->year;

        // Check if period already exists
        $existing = DeductionPeriod::whereMonth('period_date', $month)
            ->whereYear('period_date', $year)
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Tagihan untuk periode ini sudah pernah di-generate.');
        }

        \DB::beginTransaction();
        try {
            $period = DeductionPeriod::create([
                'period_date' => $date->startOfMonth()->toDateString(),
                'status' => 'draft',
            ]);

            $members = User::where('role', 'anggota')->get();

            foreach ($members as $member) {
                // Check if this month is inactive for this member
                $inactiveMonths = $member->inactive_months ? json_decode($member->inactive_months, true) : [];
                $isInactive = in_array($month, $inactiveMonths);

                $savingNominal = $isInactive ? 0 : $member->monthly_saving_nominal;

                // Get active loans
                $activeLoans = Loan::where('user_id', $member->id)->where('status', 'aktif')->get();
                $loanInstallment = 0;
                
                if (!$isInactive) {
                    foreach ($activeLoans as $loan) {
                        $loanInstallment += $loan->monthly_installment; // assuming monthly_installment exists on loan
                        // Alternatively, calculate based on principal and fee
                    }
                }

                if ($savingNominal > 0 || $loanInstallment > 0) {
                    DeductionDetail::create([
                        'deduction_period_id' => $period->id,
                        'user_id' => $member->id,
                        'saving_deduction_amount' => $savingNominal,
                        'loan_deduction_amount' => $loanInstallment,
                        'total_deduction_amount' => $savingNominal + $loanInstallment,
                        'status' => 'pending', // Can be updated when payroll confirms
                    ]);
                }
            }

            \DB::commit();
            return redirect()->back()->with('success', 'Berhasil melakukan generate tagihan potongan bulanan.');
        } catch (\Exception $e) {
            \DB::rollback();
            return redirect()->back()->with('error', 'Gagal generate tagihan: ' . $e->getMessage());
        }
    }

    public function export(DeductionPeriod $deduction)
    {
        if (!in_array(auth()->user()->role, ['bendahara', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        $details = DeductionDetail::with('user')->where('deduction_period_id', $deduction->id)->get();

        $csvFileName = 'Potongan_Koperasi_' . \Carbon\Carbon::parse($deduction->period_date)->format('F_Y') . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($details) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['NIK', 'Nama Anggota', 'Potongan Simpanan', 'Potongan Pinjaman', 'Total Potongan']);

            foreach ($details as $row) {
                fputcsv($file, [
                    $row->user->identity_number,
                    $row->user->name,
                    $row->saving_deduction_amount,
                    $row->loan_deduction_amount,
                    $row->total_deduction_amount
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
