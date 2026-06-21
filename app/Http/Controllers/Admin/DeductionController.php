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
        return inertia('Admin/Deductions/Index', ['periods' => $periods]);
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
                'status' => 'draf',
                'is_active' => true,
            ]);

            // Dispatch job instead of running synchronously
            \App\Jobs\ProcessMonthlyDeduction::dispatch($period);

            return redirect()->back()->with('success', 'Berhasil memulai proses antrean generate tagihan potongan bulanan. Silakan tunggu beberapa saat.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal generate tagihan: ' . $e->getMessage());
        }
    }

    public function export(DeductionPeriod $deduction)
    {
        if (!in_array(auth()->user()->role, ['bendahara', 'pengawas'])) {
            abort(403, 'Unauthorized action.');
        }

        $details = DeductionDetail::with('user')->where('deduction_period_id', $deduction->id)->get();

        $csvFileName = 'Potongan_Koperasi_' . str_pad($deduction->month, 2, '0', STR_PAD_LEFT) . '_' . $deduction->year . '.csv';
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
