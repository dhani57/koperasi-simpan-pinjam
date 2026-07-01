<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->decimal('admin_fee_amount', 15, 2)->default(0)->after('cooperative_fee_percentage');
            $table->boolean('admin_fee_overridden')->default(false)->after('admin_fee_amount');
            $table->string('document_path')->nullable()->after('admin_fee_overridden');
            $table->foreignId('merged_from_loan_id')->nullable()->constrained('loans')->onDelete('set null')->after('document_path');
            $table->decimal('merged_old_remaining', 15, 2)->default(0)->after('merged_from_loan_id');
        });
    }

    public function down(): void
    {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['merged_from_loan_id']);
            $table->dropColumn([
                'admin_fee_amount',
                'admin_fee_overridden',
                'document_path',
                'merged_from_loan_id',
                'merged_old_remaining',
            ]);
        });
    }
};
