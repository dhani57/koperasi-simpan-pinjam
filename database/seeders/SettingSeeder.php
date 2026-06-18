<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Setting::updateOrCreate(
            ['key' => 'default_monthly_saving'],
            ['value' => '100000', 'type' => 'integer', 'description' => 'Nominal default simpanan rutin bulanan']
        );

        \App\Models\Setting::updateOrCreate(
            ['key' => 'default_salary_limit'],
            ['value' => '2000000', 'type' => 'integer', 'description' => 'Limit maksimal potongan gaji default']
        );

        \App\Models\Setting::updateOrCreate(
            ['key' => 'loan_interest_rate'],
            ['value' => '1.5', 'type' => 'float', 'description' => 'Persentase jasa/bunga pinjaman per bulan (%)']
        );
    }
}
