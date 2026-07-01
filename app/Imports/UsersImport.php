<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new User([
            'name' => $row['nama'],
            'email' => $row['email'],
            'identity_number' => $row['nik'],
            'phone' => $row['no_telepon'],
            'department' => $row['departemen'] ?? null,
            'job_title' => $row['jabatan'] ?? null,
            'job_start_date' => !empty($row['tanggal_mulai_kerja']) ? \Carbon\Carbon::parse($row['tanggal_mulai_kerja']) : null,
            'job_end_date' => !empty($row['tanggal_selesai_kerja']) ? \Carbon\Carbon::parse($row['tanggal_selesai_kerja']) : null,
            'bank_account_number' => $row['no_rekening_bank'] ?? null,
            'retirement_month' => $row['bulan_pensiun'] ?? null,
            'retirement_year' => $row['tahun_pensiun'] ?? null,
            'monthly_simpanan_wajib' => $row['simpanan_wajib_per_bulan'] ?? 0,
            'monthly_simpanan_sukarela' => $row['simpanan_sukarela_per_bulan'] ?? 0,
            'simpanan_pokok_balance' => $row['saldo_simpanan_pokok'] ?? 0,
            'simpanan_wajib_balance' => $row['saldo_simpanan_wajib'] ?? 0,
            'simpanan_sukarela_balance' => $row['saldo_simpanan_sukarela'] ?? 0,
            'max_salary_deduction_limit' => $row['batas_potongan_gaji'] ?? 0,
            'role' => 'anggota',
            'is_anggota' => true,
            'password' => Hash::make($row['password'] ?? 'password123'),
        ]);
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'nik' => 'required|string|unique:users,identity_number',
        ];
    }
}
