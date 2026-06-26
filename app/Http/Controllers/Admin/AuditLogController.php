<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserActivityLog;
use App\Services\AuditLogService;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $logs = UserActivityLog::with('user')
            ->when($search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->whereRaw('lower(name) like lower(?)', ["%{$search}%"]);
                })
                ->orWhereRaw('lower(activity_type) like lower(?)', ["%{$search}%"])
                ->orWhereRaw('lower(description) like lower(?)', ["%{$search}%"]);
            })
            ->latest()
            ->paginate(15)
            ->appends(request()->query());

        // Catat aktivitas pengawas saat mengakses log audit
        if (auth()->user()->role === 'pengawas') {
            app(AuditLogService::class)->log(
                auth()->user(),
                'audit_access',
                'Mengakses halaman Audit Log Sistem'
            );
        }

        return inertia('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'filters' => ['search' => $search]
        ]);
    }
}
