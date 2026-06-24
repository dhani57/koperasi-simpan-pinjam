<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('identity_number')->unique()->comment('NIP/NIM');
            $table->string('email')->unique();
            $table->string('phone')->nullable()->comment('Nomor Telepon/WhatsApp');
            $table->enum('role', ['anggota', 'bendahara', 'pengurus', 'ketua', 'pengawas'])->default('anggota');
            $table->boolean('is_anggota')->default(false)->comment('Menandakan apakah pengguna memiliki hak sebagai anggota koperasi');
            $table->decimal('monthly_saving_nominal', 15, 2)->default(0)->comment('Nominal potongan wajib bulanan');
            $table->decimal('max_salary_deduction_limit', 15, 2)->default(0)->comment('Limit maksimal gaji yang boleh dipotong');
            $table->decimal('total_saving_balance', 15, 2)->default(0)->comment('Total saldo simpanan saat ini');
            $table->string('profile_photo_path')->nullable();
            $table->string('department')->nullable();
            $table->date('joined_at')->nullable();
            $table->string('job_title')->nullable();
            $table->date('job_start_date')->nullable();
            $table->date('job_end_date')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
