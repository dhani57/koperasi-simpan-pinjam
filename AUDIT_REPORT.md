# Laporan Audit Implementasi Koperasi Simpan Pinjam vs PRD

Dokumen ini berisi hasil audit *codebase* terhadap dokumen spesifikasi `PRD.md` dan aturan desain `DESIGN.md`. Audit ini dilakukan sebelum melakukan perubahan kode apa pun.

## 5. Fitur Utama & Logika Bisnis (Core Features)

| Item Requirement PRD | Status | Catatan Temuan |
|---|---|---|
| **Skema Potong Gaji (Auto-Deduct)** | ⚠️ Sebagian | Entitas database dan Controller (DeductionController) sudah ada, tapi eksekusi dilakukan secara sinkron, bukan menggunakan Job Queue. |
| **Sistem Antrean (Queueing)** | ❌ Belum Ada | Tidak ditemukan direktori `app/Jobs`. Proses pemotongan massal di `DeductionController` dilakukan berulang (loop) dalam satu *request*, berpotensi *timeout* dan membebani memori. |
| **Caching Kalkulasi Saldo** | ⚠️ Sebagian | Kolom `total_saving_balance` sudah ada di tabel `users` dan skema mutasi telah tersedia, namun logika update *real-time* perlu dipastikan konsistensinya melalui Service class. |
| **Validasi Limit Gaji** | ✅ Sudah Diimplementasikan | Validasi sudah diterapkan di `LoanController@store` yang membandingkan sisa plafon `max_salary_deduction_limit` dengan `monthly_saving_nominal` dan angsuran. |
| **Periode Aktif 10 Bulan/Tahun** | ❌ Belum Ada | Controller `DeductionController` membaca field `inactive_months` dari tabel `users`, padahal PRD (6.1) mensyaratkan parameter ini diambil dari entitas `Parameter Sistem` (`settings`). Kalkulasi tenor-ke-bulan di `LoanController` juga belum memakai acuan 10 bulan aktif (masih *flat* sesuai input). |
| **Jasa Pinjaman Menurun Tahunan** | ❌ Belum Ada | Implementasi di `LoanController` masih menggunakan perhitungan FLAT sepenuhnya (`$totalFee = $principal * ($feePercentage / 100) * $tenor`). Sesuai PRD 6.2, jasa harus direkalkulasi setiap tahun berdasarkan sisa pokok awal tahun, dan perlu dimasukkan ke entitas `loan_annual_services`. |
| **Pembagian SHU Berbasis Aktivitas** | ⚠️ Sebagian | Struktur dasar controller ada (`ShuController`), tapi logika perhitungan proporsional aktivitas transaksi dan konfigurasi formula belum lengkap (status Open Item di PRD). Perlu menyiapkan *skeleton* formula. |

## 7. Hierarki Pengguna & Hak Akses (RBAC)

| Item Requirement PRD | Status | Catatan Temuan |
|---|---|---|
| **Struktur Role Database** | ✅ Sudah Diimplementasikan | Kolom `role` berupa enum (`anggota`, `bendahara`, `pengurus`, `ketua`, `pengawas`) sudah ada. |
| **Hak Akses Endpoint/Middleware** | ⚠️ Sebagian | Di `DeductionController` sudah dicek secara hardcode (`in_array(auth()->user()->role, ...)`). Diperlukan testing lebih dalam dan sebaiknya menggunakan *Middleware* atau *Gate* / *Policy*. |

## 8. Spesifikasi Dashboard per Role

| Item Requirement PRD | Status | Catatan Temuan |
|---|---|---|
| **Dashboard Anggota** | ⚠️ Sebagian | Views untuk dashboard React tersedia (`DashboardController`), namun perlu diverifikasi jika *widget* telah menggunakan token UI dari `DESIGN.md` dan menampilkan metrik akurat. |
| **Dashboard Pengurus / Admin** | ⚠️ Sebagian | *Sama dengan atas* |
| **Dashboard Bendahara** | ⚠️ Sebagian | *Sama dengan atas* |
| **Dashboard Ketua** | ⚠️ Sebagian | *Sama dengan atas* |
| **Dashboard Pengawas** | ⚠️ Sebagian | *Sama dengan atas* |

## 9. Persyaratan Database

| Item Requirement PRD | Status | Catatan Temuan |
|---|---|---|
| **Skema Pengguna, Pinjaman, dll** | ✅ Sudah Diimplementasikan | Semua field yang disyaratkan oleh PRD sudah direpresentasikan dengan benar dalam migration. |
| **Parameter Sistem** | ✅ Sudah Diimplementasikan | Tabel `settings` sudah tersedia dengan kolom kunci-nilai. |

## 11. Prinsip Pengembangan & Arsitektur

| Item Requirement PRD | Status | Catatan Temuan |
|---|---|---|
| **Clean Code (Pemisahan Logic)** | ❌ Belum Ada | Logika bisnis belum dipisahkan dari Controller. Direktori `app/Services` / `app/Actions` tidak ditemukan. `LoanController` dan `DeductionController` melakukan *Fat Controller pattern*. |
| **Component-Based Architecture (React)** | ⚠️ Sebagian | File komponen React kemungkinan sudah ada, tapi implementasi arsitektur modular (*design tokens*) dari `DESIGN.md` belum dapat dipastikan hingga kode frontend dibuka lebih lanjut. |

---

## Kesimpulan

Fokus perbaikan pada **Langkah 3** akan mencakup:
1. **Refactor ke Service Classes**: Memindahkan logika yang berada di *controller* menjadi layanan terpisah (contoh: `LoanService`, `DeductionService`).
2. **Implementasi Queue**: Membuat Job Class untuk kalkulasi pemotongan massal (`ProcessMonthlyDeduction`) agar berjalan secara asinkron.
3. **Perhitungan Jasa Pinjaman (Bagian 6.2)**: Mengubah perhitungan angsuran pinjaman agar sesuai mekanisme menurun tahunan, yang direkalkulasi otomatis (bisa memanfaatkan Job) dan terekam di `loan_annual_services`.
4. **Parameter 10 Bulan Aktif (Bagian 6.1)**: Memindahkan logika bulan non-aktif ke `settings` table, dan memastikan konversi tenor (1 tahun = 10 bulan) diterapkan secara global.
5. **Konstruksi SHU (Bagian 6.3)**: Memastikan kerangka perhitungan SHU berbasis metrik mutasi, siap menerima formula dinamis.
6. **Frontend & Desain**: Menyempurnakan komponen UI dengan implementasi *design token* sesuai `DESIGN.md`.
