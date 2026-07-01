<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Statistik Agregat Koperasi (data publik, non-individual)
    $totalMembers = \App\Models\User::where('is_anggota', true)->count();
    $totalSavings = \App\Models\User::selectRaw('COALESCE(SUM(simpanan_pokok_balance + simpanan_wajib_balance + simpanan_sukarela_balance), 0) as total')->value('total');
    $totalActiveLoans = \App\Models\Loan::whereIn('status', ['aktif', 'disetujui'])->sum('current_remaining_principal');

    // Distribusi Anggota per Fakultas/Unit
    $departmentDistribution = \App\Models\User::where('is_anggota', true)
        ->whereNotNull('department')
        ->where('department', '!=', '')
        ->selectRaw('department, COUNT(*) as total')
        ->groupBy('department')
        ->orderByDesc('total')
        ->get();

    // Data Pengurus (Ketua, Bendahara, Sekretaris/Pengurus)
    $boardMembers = \App\Models\User::whereIn('role', ['ketua', 'bendahara', 'pengurus'])
        ->select('name', 'role', 'department', 'profile_photo_path', 'job_title')
        ->orderByRaw("CASE role WHEN 'ketua' THEN 1 WHEN 'bendahara' THEN 2 WHEN 'pengurus' THEN 3 ELSE 4 END")
        ->get()
        ->map(function ($user) {
            $roleLabels = [
                'ketua' => 'Ketua',
                'bendahara' => 'Bendahara',
                'pengurus' => 'Sekretaris / Admin',
            ];
            return [
                'name' => $user->name,
                'role' => $user->role,
                'role_label' => $roleLabels[$user->role] ?? ucfirst($user->role),
                'department' => $user->department,
                'job_title' => $user->job_title,
            ];
        });

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'stats' => [
            'totalMembers' => (int) $totalMembers,
            'totalSavings' => (float) $totalSavings,
            'totalActiveLoans' => (float) $totalActiveLoans,
        ],
        'departmentDistribution' => $departmentDistribution,
        'boardMembers' => $boardMembers,
    ]);
});

use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\LoanController as MemberLoanController;
use App\Http\Controllers\Member\MutationController as MemberMutationController;
use App\Http\Controllers\Member\ShuController as MemberShuController;
use App\Http\Controllers\Member\VoluntarySavingRequestController as MemberVoluntarySavingRequestController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [MemberDashboardController::class, 'index'])->name('dashboard');
    Route::get('/member/dashboard', [MemberDashboardController::class, 'index'])->name('member.dashboard');
    
    Route::prefix('member')->name('member.')->group(function () {
        Route::resource('loans', MemberLoanController::class)->only(['index', 'create', 'store']);
        Route::get('mutations/print', [MemberMutationController::class, 'print'])->name('mutations.print');
        Route::resource('mutations', MemberMutationController::class)->only(['index']);
        Route::get('shu', [MemberShuController::class, 'index'])->name('shu.index');
        Route::resource('voluntary-saving-requests', MemberVoluntarySavingRequestController::class)->only(['index', 'create', 'store']);
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\LoanController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\DeductionController;
use App\Http\Controllers\Admin\ShuController;
use App\Http\Controllers\Admin\VoluntarySavingRequestController as AdminVoluntarySavingRequestController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Users and Settings - Read Only untuk pengawas
    Route::get('users', [UserController::class, 'index'])->name('users.index')->middleware('role:pengurus,pengawas');
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index')->middleware('role:pengurus,pengawas');
    
    // Hanya pengurus yang mengelola pengguna dan settings (Create/Edit/Delete)
    Route::middleware('role:pengurus')->group(function () {
        Route::post('users/import', [UserController::class, 'import'])->name('users.import');
        Route::get('users/template', [UserController::class, 'downloadTemplate'])->name('users.template');
        Route::resource('users', UserController::class)->except(['index']);
        Route::post('settings', [SettingController::class, 'store'])->name('settings.store');
    });
    
    // Pinjaman Routes
    Route::resource('loans', LoanController::class)->only(['index', 'show']);
    Route::post('loans/{loan}/verify', [LoanController::class, 'verify'])->name('loans.verify')->middleware('role:pengurus');
    Route::post('loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject')->middleware('role:bendahara,ketua,pengurus');
    Route::post('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve')->middleware('role:bendahara,ketua');
    Route::post('loans/{loan}/disburse', [LoanController::class, 'disburse'])->name('loans.disburse')->middleware('role:bendahara');
    
    // Potongan Bulanan Routes
    Route::resource('deductions', DeductionController::class)->only(['index', 'show']);
    Route::post('deductions', [DeductionController::class, 'store'])->name('deductions.store')->middleware('role:bendahara');
    Route::post('deductions/{deduction}/approve', [DeductionController::class, 'approve'])->name('deductions.approve')->middleware('role:ketua');
    Route::patch('deductions/{deduction}/selesai', [DeductionController::class, 'markAsSelesai'])->name('deductions.selesai')->middleware('role:bendahara');
    Route::get('deductions/{deduction}/export', [DeductionController::class, 'export'])->name('deductions.export')->middleware('role:bendahara,pengawas');
    Route::get('deductions/{deduction}/export-failed', [DeductionController::class, 'exportFailedDebit'])->name('deductions.export-failed')->middleware('role:bendahara,pengawas');
    
    // Gagal Debit Routes (PRD Bagian 2.3 & 5.2)
    Route::patch('deductions/{deduction}/details/{detail}/fail', [DeductionController::class, 'markFailed'])->name('deductions.detail.fail')->middleware('role:pengurus');
    Route::patch('deductions/{deduction}/details/{detail}/unfail', [DeductionController::class, 'markUnfailed'])->name('deductions.detail.unfail')->middleware('role:pengurus');
    Route::post('deductions/{deduction}/confirm', [DeductionController::class, 'confirm'])->name('deductions.confirm')->middleware('role:bendahara');
    
    // Log Mutasi Routes
    Route::get('mutations', [\App\Http\Controllers\Admin\MutationController::class, 'index'])->name('mutations.index');

    // SHU Routes
    Route::get('shu', [ShuController::class, 'index'])->name('shu.index')->middleware('role:bendahara,ketua,pengawas');
    Route::post('shu/generate', [ShuController::class, 'store'])->name('shu.store')->middleware('role:bendahara');
    Route::post('shu/approve', [ShuController::class, 'approve'])->name('shu.approve')->middleware('role:ketua,bendahara');

    // Voluntary Saving Request Routes
    Route::get('voluntary-saving-requests', [AdminVoluntarySavingRequestController::class, 'index'])->name('voluntary_saving_requests.index')->middleware('role:bendahara,pengurus');
    Route::post('voluntary-saving-requests/{voluntarySavingRequest}/approve', [AdminVoluntarySavingRequestController::class, 'approve'])->name('voluntary_saving_requests.approve')->middleware('role:bendahara,pengurus');
    Route::post('voluntary-saving-requests/{voluntarySavingRequest}/reject', [AdminVoluntarySavingRequestController::class, 'reject'])->name('voluntary_saving_requests.reject')->middleware('role:bendahara,pengurus');

    // Audit Log Route
    Route::get('audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index'])
        ->name('audit-logs.index')
        ->middleware('role:pengawas');
});

require __DIR__.'/auth.php';
