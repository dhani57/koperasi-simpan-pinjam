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
        Schema::create('shu_drafts', function (Blueprint $table) {
            $table->id();
            $table->integer('year');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('nominal_shu', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shu_drafts');
    }
};
