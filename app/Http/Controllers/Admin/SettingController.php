<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key')->map->value;
        return inertia('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role === 'pengawas') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'default_monthly_saving' => 'required|numeric|min:0',
            'default_salary_limit' => 'required|numeric|min:0',
            'loan_interest_rate' => 'required|numeric|min:0|max:100',
            'inactive_months' => 'nullable|array',
            'inactive_months.*' => 'integer|min:1|max:12',
        ]);

        if (isset($validated['inactive_months'])) {
            $validated['inactive_months'] = json_encode($validated['inactive_months']);
        } else {
            $validated['inactive_months'] = json_encode([]);
        }

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        app(\App\Services\AuditLogService::class)->log(
            auth()->user(),
            'parameter_change',
            'Memperbarui parameter sistem koperasi'
        );

        return redirect()->back()->with('success', 'Parameter sistem berhasil diperbarui.');
    }
}
