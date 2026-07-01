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

### 5. Simpanan Wajib & Sukarela
- **Feature Tests**: Memastikan anggota bisa mengubah nilai simpanan sukarela, membutuhkan persetujuan bendahara, dan mutasi saldo di-update secara akurat.
  - Berkas: `tests/Feature/VoluntarySavingTest.php`

### 6. Top Up Pinjaman
- **Feature Tests**: Memastikan bahwa anggota yang mengajukan pinjaman saat memiliki pinjaman aktif, pinjaman lama akan digabung menjadi pokok baru, disertai dengan potongan biaya admin (Top Up).
  - Berkas: `tests/Feature/TopUpLoanTest.php`

### 7. Distribusi Sisa Hasil Usaha (SHU)
- **Feature Tests**: Memvalidasi proses draft SHU oleh bendahara, persetujuan oleh ketua, dan pendistribusian proporsional yang dimasukkan secara otomatis ke dalam saldo simpanan sukarela anggota.
  - Berkas: `tests/Feature/ShuDistributionTest.php`

### 8. Fitur Import & Export Anggota
- **Feature Tests**: Memastikan sistem dapat menerima format `.xlsx` (Excel) dan membuat akun pengguna secara massal beserta kredensial (NIP/NIM) untuk efisiensi admin.
  - Berkas: `tests/Feature/UserImportTest.php`

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

## Pembaruan Test (Berdasarkan changes_PRD.md)
Sistem ini telah diperbarui sesuai perubahan dari stakeholder dengan penambahan/perubahan tes otomasi berikut:
1. **BusinessLogicTest**: Penambahan pengujian untuk alur perhitungan progresif SHU dengan komposisi baru (memasukkan komponen `simpanan_wajib`), serta pembaruan validasi perhitungan Jasa Menurun berdasar `active_months` (10 atau 12 bulan) dan pemilihan tenor _standar_ vs _custom_.
2. **DeductionWorkflowTest**: Pembaruan assertion terkait potongan bulanan untuk menyertakan porsi `simpanan_wajib` menggantikan simpanan rutin yang lama, serta pengujian status `selesai` pada saat Bendahara menyetujui pemotongan tagihan.
3. **MemberLoanControllerTest**: Penambahan pengujian (Top Up) untuk menangani kasus anggota meminjam saat masih ada pinjaman aktif, serta validasi bahwa form bermaterai dan masa pensiun dipatuhi sistem.

## Pengujian Manual (Manual Testing)
Walaupun sebagian besar logika inti bisnis sudah dicakup oleh pengujian otomatis (119 test cases passed), beberapa aspek berikut **tetap memerlukan pengujian manual**:
1. **UI/UX Tampilan Landing Page**: Validasi visual terhadap perubahan komponen landing page (tidak ada registrasi, statistik dihilangkan untuk anonim, dan daftar fakultas).
2. **Eksport Excel & PDF (Tagihan, Gagal Debit, Laporan)**: Harus diuji secara manual untuk memastikan tata letak dokumen (*layout*, presisi desimal rupiah, orientasi halaman) benar-benar sesuai standar cetak yang biasa dipakai oleh Bendahara Koperasi FT Unila.
3. **Notifikasi Gagal Debit**: Pengujian manual diperlukan untuk memverifikasi apakah notifikasi (in-app, email, WA) terkirim secara *real-time* kepada anggota bersangkutan ketika Admin mengubah status dari bank.
4. **Alur Import Massal (Excel)**: Validasi pengalaman pengguna (*User Experience*) saat mengunggah *file* berukuran besar yang berisi lebih dari 500 anggota lama untuk memeriksa apakah *feedback error* dari UI (baris Excel mana yang salah input) dimunculkan dengan jelas.
