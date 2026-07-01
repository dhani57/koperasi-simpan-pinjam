<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('simpanan_pokok_balance', 15, 2)->default(0)->after('monthly_saving_nominal');
            $table->decimal('simpanan_wajib_balance', 15, 2)->default(0)->after('simpanan_pokok_balance');
            $table->decimal('simpanan_sukarela_balance', 15, 2)->default(0)->after('simpanan_wajib_balance');
            $table->decimal('monthly_simpanan_wajib', 15, 2)->default(50000)->after('simpanan_sukarela_balance');
            $table->decimal('monthly_simpanan_sukarela', 15, 2)->default(0)->after('monthly_simpanan_wajib');
            $table->string('bank_account_number')->nullable()->after('monthly_simpanan_sukarela');
            $table->integer('retirement_month')->nullable()->after('bank_account_number');
            $table->integer('retirement_year')->nullable()->after('retirement_month');
            $table->boolean('has_failed_debit')->default(false)->after('retirement_year');
        });

        // Migrate data
        $users = DB::table('users')->get();
        foreach ($users as $user) {
            DB::table('users')->where('id', $user->id)->update([
                'simpanan_wajib_balance' => $user->total_saving_balance,
                'monthly_simpanan_wajib' => $user->monthly_saving_nominal,
            ]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['total_saving_balance', 'monthly_saving_nominal']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('total_saving_balance', 15, 2)->default(0);
            $table->decimal('monthly_saving_nominal', 15, 2)->default(0);
        });

        // Revert data
        DB::table('users')->update([
            'total_saving_balance' => DB::raw('simpanan_wajib_balance + simpanan_pokok_balance + simpanan_sukarela_balance'),
            'monthly_saving_nominal' => DB::raw('monthly_simpanan_wajib'),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'simpanan_pokok_balance',
                'simpanan_wajib_balance',
                'simpanan_sukarela_balance',
                'monthly_simpanan_wajib',
                'monthly_simpanan_sukarela',
                'bank_account_number',
                'retirement_month',
                'retirement_year',
                'has_failed_debit'
            ]);
        });
    }
};
