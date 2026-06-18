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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\LoanController;
use App\Http\Controllers\Admin\SettingController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('loans', LoanController::class)->only(['index']);
    Route::resource('settings', SettingController::class)->only(['index', 'store']);
});

require __DIR__.'/auth.php';
