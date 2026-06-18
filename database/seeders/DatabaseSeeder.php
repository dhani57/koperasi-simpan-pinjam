<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Pengurus',
            'email' => 'admin@koperasi.internal',
            'identity_number' => 'ADM-001',
            'password' => bcrypt('password'),
            'role' => 'pengurus',
            'monthly_saving_nominal' => 0,
            'max_salary_deduction_limit' => 0,
        ]);

        User::create([
            'name' => 'Anggota Biasa',
            'email' => 'anggota@koperasi.internal',
            'identity_number' => 'ANG-001',
            'password' => bcrypt('password'),
            'role' => 'anggota',
            'monthly_saving_nominal' => 100000,
            'max_salary_deduction_limit' => 2000000,
        ]);

        $this->call([
            SettingSeeder::class,
        ]);
    }
}
