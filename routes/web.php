<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Cari kontak admin (Pengurus) untuk ditampilkan di landing page
    $adminContact = \App\Models\User::whereIn('role', ['pengurus', 'ketua'])
        ->whereNotNull('phone')
        ->where('phone', '!=', '')
        ->first();
        
    $adminPhone = $adminContact ? $adminContact->phone : null;

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'adminPhone' => $adminPhone,
    ]);
});

use App\Http\Controllers\Member\DashboardController as MemberDashboardController;
use App\Http\Controllers\Member\LoanController as MemberLoanController;
use App\Http\Controllers\Member\MutationController as MemberMutationController;
use App\Http\Controllers\Member\ShuController as MemberShuController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [MemberDashboardController::class, 'index'])->name('dashboard');
    Route::get('/member/dashboard', [MemberDashboardController::class, 'index'])->name('member.dashboard');
    
    Route::prefix('member')->name('member.')->group(function () {
        Route::resource('loans', MemberLoanController::class)->only(['index', 'create', 'store']);
        Route::get('mutations/print', [MemberMutationController::class, 'print'])->name('mutations.print');
        Route::resource('mutations', MemberMutationController::class)->only(['index']);
        Route::get('shu', [MemberShuController::class, 'index'])->name('shu.index');
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

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Users and Settings - Read Only untuk pengawas
    Route::get('users', [UserController::class, 'index'])->name('users.index')->middleware('role:pengurus,pengawas');
    Route::get('settings', [SettingController::class, 'index'])->name('settings.index')->middleware('role:pengurus,pengawas');
    
    // Hanya pengurus yang mengelola pengguna dan settings (Create/Edit/Delete)
    Route::middleware('role:pengurus')->group(function () {
        Route::resource('users', UserController::class)->except(['index']);
        Route::post('settings', [SettingController::class, 'store'])->name('settings.store');
    });
    
    // Pinjaman Routes
    Route::resource('loans', LoanController::class)->only(['index']);
    Route::post('loans/{loan}/verify', [LoanController::class, 'verify'])->name('loans.verify')->middleware('role:pengurus');
    Route::post('loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject')->middleware('role:bendahara,ketua,pengurus');
    Route::post('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve')->middleware('role:bendahara,ketua');
    Route::post('loans/{loan}/disburse', [LoanController::class, 'disburse'])->name('loans.disburse')->middleware('role:bendahara');
    
    // Potongan Bulanan Routes
    Route::resource('deductions', DeductionController::class)->only(['index', 'show']);
    Route::post('deductions', [DeductionController::class, 'store'])->name('deductions.store')->middleware('role:bendahara');
    Route::patch('deductions/{deduction}/selesai', [DeductionController::class, 'markAsSelesai'])->name('deductions.selesai')->middleware('role:bendahara');
    Route::get('deductions/{deduction}/export', [DeductionController::class, 'export'])->name('deductions.export')->middleware('role:bendahara');
    
    // Log Mutasi Routes
    Route::get('mutations', [\App\Http\Controllers\Admin\MutationController::class, 'index'])->name('mutations.index');

    // SHU Routes
    Route::get('shu', [ShuController::class, 'index'])->name('shu.index')->middleware('role:bendahara,ketua,pengawas');
    Route::post('shu/generate', [ShuController::class, 'store'])->name('shu.store')->middleware('role:bendahara');
    Route::post('shu/approve', [ShuController::class, 'approve'])->name('shu.approve')->middleware('role:ketua');
});

require __DIR__.'/auth.php';
