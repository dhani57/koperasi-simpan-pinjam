<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('deduction_details', function (Blueprint $table) {
            $table->decimal('simpanan_wajib_amount', 15, 2)->default(0)->after('routine_saving_amount');
            $table->decimal('simpanan_sukarela_amount', 15, 2)->default(0)->after('simpanan_wajib_amount');
            $table->decimal('admin_fee_amount', 15, 2)->default(0)->after('simpanan_sukarela_amount');
        });

        $details = DB::table('deduction_details')->get();
        foreach ($details as $detail) {
            DB::table('deduction_details')->where('id', $detail->id)->update([
                'simpanan_wajib_amount' => $detail->routine_saving_amount
            ]);
        }

        Schema::table('deduction_details', function (Blueprint $table) {
            $table->dropColumn('routine_saving_amount');
        });
    }

    public function down(): void
    {
        Schema::table('deduction_details', function (Blueprint $table) {
            $table->decimal('routine_saving_amount', 15, 2)->default(0);
        });

        DB::table('deduction_details')->update([
            'routine_saving_amount' => DB::raw('simpanan_wajib_amount + simpanan_sukarela_amount')
        ]);

        Schema::table('deduction_details', function (Blueprint $table) {
            $table->dropColumn(['simpanan_wajib_amount', 'simpanan_sukarela_amount', 'admin_fee_amount']);
        });
    }
};
