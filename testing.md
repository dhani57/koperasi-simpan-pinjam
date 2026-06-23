# Koperasi Internal - Strategi Pengujian Otomatis (Automation Testing)

Dokumen ini menguraikan arsitektur dan eksekusi pengujian otomatis yang mengamankan aplikasi sistem "Koperasi Internal" yang dibangun menggunakan kerangka kerja (framework) **Laravel + PHPUnit**. Pengujian ini ditulis berdasarkan ketentuan 3 prinsip utama pengembangan PRD: Stabilitas, Akurasi, dan Efisiensi.

## Ruang Lingkup Pengujian (Test Coverage)

Sistem memastikan bahwa semua logika kritikal bisnis seperti autentikasi, manajemen pengguna (RBAC/Peran ganda), hingga proses pemotongan pinjaman tercakup oleh pengujian otomatis yang reliabel.

### 1. Manajemen Multi-Peran (Dual-Role Tests)
- **Unit Tests**: Menguji fungsionalitas `User::hasRole()` dan properti dinamis `$user->roles_array` dengan berbagai variasi penugasan peran (Ketua + Anggota, hanya Anggota, hanya Pengurus).
  - Berkas: `tests/Unit/UserDualRoleTest.php`
- **Controller Tests**: Memvalidasi alur (input HTTP) agar Admin tidak diperbolehkan memasukkan kombinasi peran yang ilegal (seperti 2 peran manajemen secara bersamaan, atau lebih dari 2 peran) dan menguji penyimpanan peran yang valid.
  - Berkas: `tests/Feature/UserControllerTest.php`
- **Middleware Tests**: Memastikan transisi *Beralih ke Admin* dan *Beralih ke Anggota* diamankan, dan pengguna dengan `is_anggota = true` berhasil melewati penyaringan (*gate*) rute anggota. Serta menguji *redirect* saat *login*.
  - Berkas: `tests/Feature/DualRoleMiddlewareTest.php`

### 2. Alur Persetujuan Pinjaman (Loan Approval Workflow)
- **Feature Tests**: Memastikan kebijakan hirarki persetujuan pinjaman dilakukan dengan benar, sesuai tingkatannya (Pengurus -> memverifikasi, Ketua -> menyetujui, Bendahara -> mencairkan). Menolak status-status lintas otorisasi (contoh: Ketua mencoba *Verify* tanpa persetujuan Pengurus).
  - Berkas: `tests/Feature/LoanWorkflowTest.php`

### 3. Logika Bisnis & Penghitungan Jasa (Business Logic)
- **Feature Tests**: Memastikan bahwa perhitungan jasa pinjaman (Bunga menurun tahunan) berkurang di tahun kedua dan ketiga. Serta memvalidasi batas maksimum plafon potongan per bulan (`max_salary_deduction_limit`).
  - Berkas: `tests/Feature/BusinessLogicTest.php`

### 4. Tugas Terjadwal (Cron / Job Tests)
- **Feature Tests**: Mengamankan `MonthlyDeductionJob` memastikan bahwa saat tanggal tertentu, pemotongan berjalan berdasarkan tagihan bulanan (pinjaman + simpanan wajib) tanpa melebihi batas gaji anggota.
  - Berkas: `tests/Feature/MonthlyDeductionJobTest.php`

## Cara Menjalankan Tes

Karena proyek berjalan dalam lingkungan **Laravel Sail (Docker)**, pastikan *container* Anda aktif dan gunakan sintaks di bawah ini.

```bash
# Menjalankan seluruh pengujian secara penuh
./vendor/bin/sail artisan test

# Menjalankan pengujian spesifik untuk Peran Ganda (Dual Role)
./vendor/bin/sail artisan test --filter UserDualRoleTest

# Menjalankan pengujian untuk Alur Pinjaman
./vendor/bin/sail artisan test --filter LoanWorkflowTest
```

Setiap kode baru yang didorong (*push*) ke siklus hidup repositori *wajib* berhasil melewati semua modul pengujian di atas guna menjamin integritas. 
