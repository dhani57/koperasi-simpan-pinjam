# DOKUMEN PERUBAHAN (CHANGE REQUEST)
## Sistem Koperasi Simpan Pinjam Internal — Koperasi FT Unila

| Field | Detail |
|---|---|
| **Sumber** | Transkrip diskusi dengan client & stakeholder koperasi |
| **Peserta** | Developer, Bu Melfi (Bendahara/Pengurus), Pak Mona (Ketua), dan anggota pengurus lainnya |
| **Status** | Divalidasi oleh developer — siap diterapkan ke PRD |

> Item yang ditandai ⚠️ masih perlu konfirmasi nilai/detail finalnya sebelum diimplementasikan.

---

## 1. Landing Page

### 1.1 Identitas & Logo
- **Nama resmi koperasi dikonfirmasi:** `Koperasi FT Unila` (ganti dari nama generik di PRD).
- **Logo:** Kombinasi logo Unila (FT) + logo koperasi. Logo koperasi menyusul — sementara gunakan placeholder.
- Tidak perlu menampilkan angka atau statistik di area header/navbar atas. Header cukup: nama koperasi + logo + tombol Login.

### 1.2 Struktur Konten (Revisi dari PRD Bagian 14)

| Bagian | Ketentuan Final |
|---|---|
| **Header/Navbar** | Nama koperasi + logo Unila FT + logo koperasi (placeholder). Tombol **Login** saja — tidak ada tombol Daftar/Register. |
| **Hero/Konten Utama** | Profil koperasi: foto pengurus (Ketua, Bendahara, Sekretaris, dst.), nama jabatan, dan tahun berdiri. Tidak perlu tagline atau fitur-fitur sistem. |
| **Statistik Umum Koperasi** | Dikonfirmasi boleh ditampilkan: total dana dikelola, total dana dipinjamkan, total simpanan anggota — data agregat saja, bukan data per anggota. |
| **Distribusi Anggota per Fakultas** | Tampilkan jumlah anggota per Fakultas/Unit (FT, FISIP, Ekonomi, dst.) — ditarik dari field Asal Fakultas di data anggota. |
| **Download Form Pendaftaran** | **Tidak perlu** — pendaftaran anggota baru sepenuhnya melalui Admin, tidak ada form yang bisa diunduh di landing page. |
| **Registrasi Publik** | **Tidak ada** — tidak ada form registrasi mandiri di landing page. |
| **Layanan/Fitur Sistem** | **Tidak perlu ditampilkan** di landing page. |

### 1.3 Data yang Tidak Boleh Ditampilkan di Landing Page
- Data pinjaman per anggota (nominal utang siapa pun).
- Saldo simpanan per anggota.
- Data transaksi individual apapun.

---

## 2. Perubahan yang Sama di Tiap Role

Perubahan berikut berlaku lintas semua role karena menyentuh konsep dasar sistem.

### 2.1 Dual Role per Pengguna
- Setiap user **selalu memiliki role Anggota sebagai role dasar**, ditambah satu role fungsional lain (Ketua, Bendahara, Admin, atau Pengawas).
- Contoh: Ketua juga dapat meminjam dan melihat simpanannya sendiri layaknya Anggota biasa.
- **Kombinasi yang tidak diizinkan:** Ketua + Bendahara secara bersamaan dalam satu akun — sistem wajib memvalidasi ini saat Admin mengatur role dan menampilkan error jika dicoba.
- Implikasi UI: pengguna dengan dual role perlu dapat berpindah konteks tampilan antara tampilan Anggota dan tampilan role fungsionalnya.

### 2.2 Tiga Jenis Simpanan (Perubahan Fundamental)
PRD saat ini hanya menyebut "simpanan rutin" satu jenis. Client mengkonfirmasi ada **3 jenis simpanan** dengan aturan berbeda:

| Jenis | Cara Bayar | Nominal | Boleh Ditarik? |
|---|---|---|---|
| **Simpanan Pokok** | Sekali saat pertama daftar | Rp350.000 (sekali bayar saat mendaftar) | ❌ Tidak boleh selama masih anggota |
| **Simpanan Wajib** | Dipotong dari gaji tiap bulan | Ditentukan oleh Admin saat membuat akun anggota (minimal Rp50.000/bulan) | ❌ Tidak boleh selama masih anggota |
| **Simpanan Sukarela** | Dipotong dari gaji tiap bulan | Ditentukan sendiri oleh anggota, dapat diubah kapan saja lewat form | ✅ Boleh ditarik kapan saja lewat pengajuan penarikan |

Catatan penting: nominal Simpanan Wajib **ditentukan oleh Admin** saat membuat akun anggota baru, bukan oleh anggota sendiri dan bukan parameter global. Nilainya berbeda-beda per anggota (minimal Rp50.000).

### 2.3 Saldo Anggota Terkunci Sampai Bendahara Konfirmasi
- Setelah tanggal potong gaji, **saldo terbaru anggota tidak langsung tampil**.
- Saldo baru tampil ke anggota **hanya setelah Bendahara menyetujui/mengkonfirmasi data potongan bulan tersebut** (setelah laporan gagal debit dari bank masuk dan selesai diproses, sekitar tanggal 20-an).
- Sebelum konfirmasi Bendahara: tampilkan saldo terakhir yang sudah terkonfirmasi, bukan saldo estimasi.

### 2.4 Format Laporan yang Dapat Diekspor
- Semua laporan yang dapat diekspor tersedia dalam format **Excel (.xlsx) dan PDF**.
- Lihat detail kolom tiap laporan di **Bagian 8** dokumen ini.

### 2.5 Notifikasi Gagal Debit
- Sistem mengirim notifikasi in-app ke **anggota yang gagal debit** dan ke **Admin**.
- Channel notifikasi lain (email/WA) ⚠️ masih perlu dikonfirmasi.

### 2.6 Field Baru di Data Anggota (Berlaku Lintas Role)
Field-field berikut perlu ditambahkan ke entitas Pengguna:

| Field | Keterangan |
|---|---|
| **Asal Fakultas/Unit Kerja** | Ditampilkan di admin untuk filter/lihat daftar anggota, dan di statistik landing page |
| **Nominal Simpanan Wajib** | Ditentukan Admin saat buat akun, minimal Rp50.000/bulan |
| **Saldo Awal Simpanan Pokok** | Untuk migrasi anggota lama |
| **Saldo Awal Simpanan Wajib** | Untuk migrasi anggota lama |
| **Saldo Awal Simpanan Sukarela** | Untuk migrasi anggota lama |
| **Tanggal Bergabung** | Untuk hitung masa keanggotaan |
| **Estimasi Pensiun (Bulan & Tahun)** | Diisi langsung bulan dan tahun perkiraan pensiun — bukan tanggal lahir. NIP dapat dibaca otomatis untuk estimasi awal, tapi kolom ini yang digunakan sistem untuk validasi batas tenor. |
| **Nomor Rekening Bank** | Untuk pencairan pinjaman dan penarikan simpanan sukarela |
| **Password default** | Diatur Admin saat buat akun, disarankan berbasis NIP atau tanggal lahir |

---

## 3. Perubahan di Role Admin

### 3.1 Kewenangan yang Dipindahkan (Keluar dari Admin)
- **Penetapan batas potongan gaji per anggota** → dipindahkan ke **Bendahara**.
  - Alasan: Bendahara yang punya akses data slip gaji (KPPA) untuk menentukan kemampuan bayar riil anggota.
  - Admin tidak lagi mengelola parameter batas potongan gaji.

### 3.2 Kewenangan yang Dipertahankan & Diperjelas
- Input data anggota baru (satu per satu) dengan form lengkap sesuai Bagian 2.6.
- Import data anggota massal dari Excel (untuk migrasi data lama sejak 2005).
- Edit dan hapus data anggota (termasuk anggota yang pensiun).
- Menetapkan role per anggota (Anggota + satu role fungsional, dengan validasi tidak boleh Ketua + Bendahara).
- Menetapkan nominal Simpanan Wajib per anggota saat membuat akun.
- Verifikasi kelengkapan dokumen pengajuan pinjaman (form bermaterai + TTD suami/istri, khusus pinjaman > Rp50 juta).
- Mengubah status anggota gagal debit berdasarkan laporan dari bank.

### 3.3 Fitur Baru untuk Admin

**A. Tampilan Daftar Anggota per Fakultas**
- Tabel daftar anggota di halaman Admin menampilkan kolom Asal Fakultas/Unit.
- Tersedia filter/pengelompokan anggota berdasarkan Asal Fakultas.

**B. Import Data Anggota Massal dari Excel**
- Admin dapat upload file Excel berisi data anggota lama untuk dimasukkan ke sistem secara massal.
- Lihat detail kolom file import di **Bagian 8.1**.

**C. Penetapan Dual Role**
- Saat tambah/edit anggota, Admin memilih: role dasar = Anggota (otomatis), role fungsional = pilihan (Ketua / Bendahara / Pengawas / tidak ada).
- Sistem memvalidasi: tidak boleh assign Ketua + Bendahara ke satu akun.

### 3.4 Form Tambah Anggota — Field Lengkap

| Field | Keterangan |
|---|---|
| NIP | Identitas unik, digunakan untuk estimasi awal pensiun |
| Nama Lengkap | |
| Email | |
| Asal Fakultas/Unit | Wajib diisi |
| Tanggal Bergabung | |
| Estimasi Pensiun (Bulan & Tahun) | Diisi manual, dapat dibantu otomatis dari NIP |
| Nominal Simpanan Wajib per Bulan | Minimal Rp50.000 |
| Saldo Awal Simpanan Pokok | Isi 0 jika anggota baru |
| Saldo Awal Simpanan Wajib | Isi 0 jika anggota baru |
| Saldo Awal Simpanan Sukarela | Isi 0 jika anggota baru |
| Nomor Rekening Bank | |
| Password | Default berbasis NIP atau tanggal lahir |
| Role Fungsional | Pilihan: (tidak ada) / Ketua / Bendahara / Pengawas |

---

## 4. Perubahan di Role Ketua

### 4.1 Kewenangan Baru: Override Biaya Administrasi & Jasa saat Approval
- Saat meninjau pengajuan pinjaman, Ketua dapat **mengubah nilai biaya administrasi dan jasa** untuk pinjaman tersebut.
- Meskipun semua pinjaman secara default dikenakan biaya administrasi 1%, Ketua dapat **mengisi biaya administrasi menjadi Rp0** untuk kasus khusus (pinjaman kecil, kebijakan pengurus, dsb.).
- Perubahan ini hanya berlaku untuk satu pengajuan yang sedang diproses, bukan mengubah parameter global sistem.
- Hal yang sama berlaku untuk nilai jasa: Ketua dapat mengatur jasanya menjadi 0% untuk kasus tertentu.

### 4.2 Akses Data Anggota
- Ketua memiliki akses melihat data lengkap seluruh anggota termasuk detail keuangan per anggota (simpanan per jenis, pinjaman aktif, riwayat transaksi). Dikonfirmasi dari transkrip: *"ketua harus tahu semua"*.

### 4.3 Dashboard Ketua — Data yang Ditampilkan
- Total aset koperasi (total simpanan semua anggota dari ketiga jenis simpanan).
- Total pinjaman yang sedang berjalan.
- Estimasi SHU yang akan dibagikan pada periode berjalan (lihat Bagian 4.4).

### 4.4 Halaman SHU — Ketua dapat Melihat Breakdown Komponen
- Ketua dapat melihat breakdown komponen SHU secara detail:
  - Total pendapatan jasa pinjaman tahun berjalan.
  - Potongan Dana Sosial (untuk anggota sakit).
  - Potongan THR Pengurus.
  - Sisa bersih setelah potongan.
  - Alokasi SHU Simpanan (% dari sisa bersih).
  - Alokasi SHU Jasa/Pinjaman (% dari sisa bersih).
  - Alokasi Modal Koperasi (% dari sisa bersih).
- ⚠️ Nilai persentase tiap komponen masih perlu dikonfirmasi client.

---

## 5. Perubahan di Role Bendahara

### 5.1 Kewenangan Baru yang Dipindahkan dari Admin
- **Menetapkan batas potongan gaji per anggota** (dipindahkan dari Admin) — karena Bendahara punya akses data KPPA/slip gaji untuk menilai kemampuan bayar riil anggota.

### 5.2 Kewenangan Baru: Konfirmasi & Pengelolaan Gagal Debit
Mekanisme baru yang belum ada di PRD:

**Alur gagal debit:**
1. Tanggal potong gaji tiba → sistem default: **semua anggota dianggap berhasil bayar**.
2. Bank memproses pemotongan. Laporan gagal debit dari bank masuk ± 12 hari kemudian (sekitar tanggal 20-an).
3. Admin menerima dan membaca laporan dari bank → **Admin mengubah status** anggota yang gagal dari "berhasil" menjadi "gagal" di sistem.
4. Bendahara **mengkonfirmasi/menyetujui** data potongan bulan tersebut setelah semua koreksi gagal debit selesai.
5. Setelah konfirmasi Bendahara: saldo terbaru baru tampil ke masing-masing anggota.

**Fitur baru yang diperlukan:**
- Halaman daftar status potongan bulan berjalan (berhasil/gagal per anggota).
- Tombol konfirmasi final data potongan.
- Rekap laporan gagal debit bulan ini.

### 5.3 Kewenangan Baru: Override Biaya Administrasi saat Approval Pinjaman
- Sama seperti Ketua (Bagian 4.1): Bendahara juga dapat mengubah nilai biaya administrasi dan jasa pinjaman menjadi Rp0 untuk kasus khusus saat melakukan approval.

### 5.4 Kewenangan Baru: Menyetujui Penarikan Simpanan Sukarela
- Anggota mengajukan penarikan → Bendahara menyetujui → Bendahara mentransfer ke rekening anggota (di luar sistem) → status penarikan diupdate di sistem.

### 5.5 Kewenangan Baru: Menyetujui Perubahan Nominal Simpanan Sukarela
- Anggota mengajukan perubahan nominal simpanan sukarela bulanan → Bendahara mengkonfirmasi → nominal baru masuk ke tagihan potongan bulan berikutnya.

### 5.6 Halaman SHU — Bendahara Mengelola Persentase Komponen
- Bendahara memiliki halaman khusus SHU yang menampilkan:
  - **Total pendapatan jasa** koperasi tahun berjalan.
  - **Form persentase per indikator**: Bendahara dapat mengisi berapa persen yang dialokasikan ke tiap indikator (Dana Sosial, THR Pengurus, SHU Simpanan, SHU Jasa/Pinjaman, Modal Koperasi). Total harus 100%.
  - **Preview otomatis**: setelah persentase diisi, sistem otomatis menampilkan nominal rupiah per indikator berdasarkan total pendapatan.
  - Setelah Bendahara mengisi dan menyimpan, Ketua melakukan approval sebelum SHU dibagikan ke anggota.

### 5.7 Laporan Tagihan ke Bank/Payroll
- Rincian tagihan mencakup per anggota: simpanan wajib + simpanan sukarela + cicilan pokok + jasa + biaya administrasi (jika ada, lihat Bagian 7.3).
- Format ekspor: **Excel dan PDF**.
- Lihat detail kolom di **Bagian 8.2**.

---

## 6. Perubahan di Role Pengawas

### 6.1 Tambahan Objek Audit: Rekap Gagal Debit
- Pengawas dapat melihat **riwayat laporan gagal debit** per periode: siapa saja yang gagal, berapa kali, status penyelesaian.

### 6.2 Tambahan Objek Audit: Komponen SHU
- Pengawas dapat melihat **breakdown komponen SHU** per periode (pendapatan jasa, potongan dana sosial, potongan THR, alokasi per indikator, persentase yang digunakan) — sebagai kontrol independen atas kebenaran pembagian SHU.

### 6.3 Tidak Ada Perubahan pada Sifat Read-Only
- Seluruh tambahan di atas tetap bersifat **read-only** — Pengawas hanya melihat, tidak ada aksi apapun.

---

## 7. Perubahan di Role Anggota

### 7.1 Tampilan Saldo — Dipecah per Jenis Simpanan
- Dashboard anggota menampilkan **saldo terpisah** untuk: Simpanan Pokok, Simpanan Wajib, Simpanan Sukarela.
- Total keseluruhan ditampilkan sebagai ringkasan di KPI card utama.
- Saldo terkunci (tidak diperbarui) sampai Bendahara konfirmasi potongan bulan tersebut (Bagian 2.3).

### 7.2 Riwayat Transaksi — Dua Level Tampilan
- **Dashboard:** 5 transaksi terbaru saja.
- **Halaman Riwayat Lengkap:** semua transaksi dengan filter per bulan dan per tahun.
- **Ringkasan Tahunan:** tampilan yang merangkum total transaksi per tahun (untuk anggota lama, misal dari 2005).
- **Unduh Slip/Laporan PDF:** anggota dapat mengunduh riwayat transaksi bulan/tahun tertentu dalam format PDF.

### 7.3 Halaman Pinjaman — Ketentuan Final

**A. Biaya Administrasi Pinjaman**
- Semua pinjaman dikenakan biaya administrasi **1% dari total pokok pinjaman, dibayar sekali saat pengajuan**.
- Contoh: pinjam Rp50.000.000 → biaya administrasi = Rp500.000 (sekali bayar, tidak berulang per bulan).
- Bendahara atau Ketua dapat mengubah biaya administrasi menjadi Rp0 saat approval untuk kasus khusus (pinjaman kecil, kebijakan pengurus, dsb.).

**B. Pilihan Tenor**
- Pilihan standar: **10 bulan, 20 bulan, 30 bulan**.
- Pilihan **Custom**: untuk pinjaman dengan kebutuhan tenor di luar pilihan standar (misal 1–2 bulan untuk pinjaman kecil).
- Validasi batas tenor: **sistem otomatis menolak** jika tenor yang dipilih melampaui kolom Estimasi Pensiun anggota tersebut.

**C. Form Pengajuan Bermaterai (Khusus Pinjaman > Rp50.000.000)**
- Jika nominal pinjaman yang diajukan **melebihi Rp50.000.000**, sistem menampilkan peringatan dan **menolak pengajuan** tanpa upload form.
- Batas pinjaman maksimal sistem = **Rp50.000.000**.
- Di halaman pinjaman, tersedia:
  - Tombol **Unduh Form Pengajuan Pinjaman** (PDF) — tersedia untuk semua pengajuan.
  - Pemberitahuan: *"Jika nominal pinjaman mendekati batas maksimum, form wajib dicetak, ditandatangani bermaterai, dan mendapat persetujuan suami/istri sebelum di-scan dan di-upload."*
  - Area **Upload Form** (scan form yang sudah ditandatangani bermaterai + TTD suami/istri) — wajib diisi untuk pengajuan besar; Admin memverifikasi sebelum diteruskan ke approval Bendahara/Ketua.

**D. Pinjaman Baru saat Masih Ada Pinjaman Aktif**
- Sistem menampilkan sisa pinjaman aktif secara otomatis.
- Pinjaman lama dianggap lunas dan **digabung** ke pinjaman baru: total pinjaman baru = sisa pinjaman lama + tambahan pinjaman yang diminta.
- Simulasi cicilan mempertimbangkan gabungan ini secara otomatis.

**E. Simulasi Cicilan per Tahun**
- Simulasi menampilkan breakdown cicilan per tahun (bukan hanya satu nilai per bulan):
  - Tahun 1 (bulan 1–10): Rp X/bulan (pokok + jasa tahun 1).
  - Tahun 2 (bulan 11–20): Rp Y/bulan (pokok + jasa tahun 2, lebih kecil).
  - Dan seterusnya sesuai tenor.

**F. Blokir Otomatis**
- Anggota dengan status gagal debit aktif **tidak dapat mengajukan pinjaman baru** — sistem otomatis menolak pengajuan.

### 7.4 Fitur Baru: Kelola Simpanan Sukarela

**Setor (tambah simpanan sukarela bulanan):**
- Anggota mengisi form: nominal simpanan sukarela yang ingin dipotong per bulan.
- Setelah disetujui Admin/Bendahara, nominal ini masuk ke tagihan potongan bulan berikutnya secara otomatis dan berulang tiap bulan.
- Anggota dapat mengubah nominal kapan saja lewat form perubahan; perubahan efektif bulan berikutnya setelah disetujui.

**Tarik (penarikan simpanan sukarela):**
- Anggota mengajukan form penarikan dengan nominal yang ingin ditarik.
- Disetujui oleh Bendahara.
- Bendahara mentransfer ke nomor rekening anggota (di luar sistem).
- Status penarikan diperbarui di sistem, saldo sukarela berkurang.

### 7.5 Profil Anggota — Field Baru
- **Nomor rekening bank** (dapat diisi/diubah sendiri oleh anggota, perlu divalidasi Admin).
- **Asal Fakultas/Unit** (read-only, hanya Admin yang dapat mengubah).
- **Tanggal bergabung** (read-only).
- **Estimasi Pensiun (Bulan & Tahun)** (read-only, hanya Admin yang dapat mengubah).
- **Saldo awal** per jenis simpanan (read-only, hanya tampil jika anggota lama dengan saldo migrasi).

---

## 8. Detail Kolom Import & Export Excel

### 8.1 Import Data Anggota (Excel → Sistem)
Digunakan oleh Admin untuk migrasi data anggota lama (sejak 2005) secara massal.

| No | Nama Kolom | Tipe Data | Keterangan |
|---|---|---|---|
| 1 | NIP | Teks | Identitas unik anggota, wajib diisi |
| 2 | Nama Lengkap | Teks | Wajib diisi |
| 3 | Email | Teks | Wajib diisi, harus unik |
| 4 | Asal Fakultas/Unit | Teks | Misal: FT, FISIP, Ekonomi, dll. |
| 5 | Tanggal Bergabung | Tanggal (YYYY-MM-DD) | Tanggal pertama kali jadi anggota koperasi |
| 6 | Estimasi Pensiun | Bulan & Tahun (MM/YYYY) | Untuk validasi batas tenor pinjaman |
| 7 | Nominal Simpanan Wajib/Bulan | Angka (Rupiah) | Minimal Rp50.000 |
| 8 | Saldo Awal Simpanan Pokok | Angka (Rupiah) | Isi 0 untuk anggota baru |
| 9 | Saldo Awal Simpanan Wajib | Angka (Rupiah) | Akumulasi simpanan wajib sampai saat migrasi. Isi 0 untuk anggota baru |
| 10 | Saldo Awal Simpanan Sukarela | Angka (Rupiah) | Akumulasi simpanan sukarela sampai saat migrasi. Isi 0 jika tidak ada |
| 11 | Nomor Rekening Bank | Teks | Untuk pencairan pinjaman & penarikan sukarela |
| 12 | Role Fungsional | Teks | Isi: `ketua` / `bendahara` / `pengawas` / kosong (jika hanya anggota biasa) |
| 13 | Password Default | Teks | Opsional; jika kosong, sistem generate dari NIP |

> Catatan: kolom batas potongan gaji **tidak ada di file import** — ditetapkan oleh Bendahara secara terpisah setelah data anggota masuk.

### 8.2 Export Tagihan Bulanan ke Bank/Payroll (Sistem → Excel/PDF)
Digunakan oleh Bendahara sebagai laporan tagihan yang dikirim ke bank (BNI/Mandiri) untuk proses potong gaji.

| No | Nama Kolom | Keterangan |
|---|---|---|
| 1 | No | Nomor urut |
| 2 | NIP | Identitas unik anggota |
| 3 | Nama Lengkap | |
| 4 | Asal Fakultas/Unit | |
| 5 | Simpanan Wajib | Nominal simpanan wajib bulan ini |
| 6 | Simpanan Sukarela | Nominal simpanan sukarela bulan ini (0 jika tidak ada) |
| 7 | Cicilan Pokok Pinjaman | Nominal cicilan pokok bulan ini (0 jika tidak ada pinjaman aktif) |
| 8 | Jasa Pinjaman | Nominal jasa pinjaman bulan ini (0 jika tidak ada) |
| 9 | Biaya Administrasi | Nominal biaya administrasi (hanya muncul di bulan pengajuan pinjaman baru) |
| 10 | Cicilan Ke- | Bulan ke-n dari total tenor pinjaman |
| 11 | Total Potongan | Jumlah keseluruhan yang dipotong dari gaji bulan ini |
| 12 | Status | Berhasil / Gagal (diisi setelah konfirmasi dari bank) |

### 8.3 Export Rekap Gagal Debit (Sistem → Excel/PDF)
Digunakan Bendahara dan Admin untuk menindaklanjuti laporan gagal debit dari bank.

| No | Nama Kolom | Keterangan |
|---|---|---|
| 1 | No | Nomor urut |
| 2 | NIP | Identitas unik anggota |
| 3 | Nama Lengkap | |
| 4 | Asal Fakultas/Unit | |
| 5 | Periode Bulan/Tahun | Bulan dan tahun gagal debit terjadi |
| 6 | Total Tagihan Seharusnya | Nominal yang seharusnya terpotong |
| 7 | Keterangan Komponen | Rincian: simpanan wajib + sukarela + cicilan + jasa (yang tidak terpotong) |
| 8 | Status Penyelesaian | Belum Diselesaikan / Sudah Diselesaikan |
| 9 | Tanggal Konfirmasi | Tanggal Admin mengubah status gagal debit |

### 8.4 Export Laporan Penarikan Simpanan Sukarela (Sistem → PDF)
Digunakan Bendahara sebagai dasar melakukan transfer ke rekening anggota (di luar sistem).

| No | Nama Kolom | Keterangan |
|---|---|---|
| 1 | Tanggal Pengajuan | |
| 2 | NIP | |
| 3 | Nama Lengkap | |
| 4 | Nominal Penarikan | Nominal yang diajukan anggota |
| 5 | Nomor Rekening Tujuan | Rekening bank anggota (dari profil) |
| 6 | Nama Bank | |
| 7 | Saldo Sukarela Sebelum Penarikan | |
| 8 | Saldo Sukarela Setelah Penarikan | |
| 9 | Status | Menunggu / Disetujui / Ditolak |
| 10 | Tanggal Disetujui | Tanggal Bendahara memberikan persetujuan |

### 8.5 Export Slip Transaksi Anggota (Sistem → PDF)
Dapat diunduh oleh anggota untuk rekap transaksi pribadi per bulan atau per tahun.

| No | Nama Kolom | Keterangan |
|---|---|---|
| 1 | Periode | Bulan/Tahun yang diminta |
| 2 | NIP & Nama | Identitas anggota |
| 3 | Saldo Awal Simpanan (per jenis) | Saldo awal periode |
| 4 | Simpanan Wajib Bulan Ini | |
| 5 | Simpanan Sukarela Bulan Ini | |
| 6 | Cicilan Pokok Pinjaman | |
| 7 | Jasa Pinjaman | |
| 8 | Biaya Administrasi | Jika ada di bulan tersebut |
| 9 | Total Potongan | |
| 10 | Saldo Akhir Simpanan (per jenis) | Saldo akhir periode |
| 11 | Sisa Pinjaman | Sisa pokok pinjaman yang belum dibayar |
| 12 | Status Potongan | Berhasil / Gagal |

---

## 9. Ringkasan Status Seluruh Item Perubahan

| No | Item Perubahan | Bagian PRD Terdampak | Status |
|---|---|---|---|
| 1 | Nama koperasi: Koperasi FT Unila | Seluruh dokumen | ✅ Dikonfirmasi |
| 2 | Logo: Unila FT + logo koperasi (menyusul) | Bagian 14 | ✅ Dikonfirmasi |
| 3 | Download form pendaftaran dihapus dari landing page | Bagian 14 | ✅ Dikonfirmasi |
| 4 | 3 jenis simpanan (Pokok/Wajib/Sukarela) | Bagian 5, 6, 8, 10 | ✅ Dikonfirmasi |
| 5 | Simpanan Wajib nominal ditentukan Admin per anggota | Bagian 7, 10 | ✅ Dikonfirmasi |
| 6 | Kolom Estimasi Pensiun (bukan tanggal lahir) | Bagian 9, 10 | ✅ Dikonfirmasi |
| 7 | Dual role per user | Bagian 7, 10 | ✅ Dikonfirmasi |
| 8 | Saldo terkunci sampai konfirmasi Bendahara | Bagian 5, 7, 8 | ✅ Dikonfirmasi |
| 9 | Mekanisme gagal debit (alur lengkap) | Bagian 5, 7, 8 | ✅ Dikonfirmasi |
| 10 | Biaya admin 1% sekali per transaksi pinjam | Bagian 5, 6 | ✅ Dikonfirmasi |
| 11 | Semua pinjaman kena admin; Bendahara/Ketua bisa set nol | Bagian 6, 7 | ✅ Dikonfirmasi |
| 12 | Batas pinjaman maksimal Rp50 juta | Bagian 6 | ✅ Dikonfirmasi |
| 13 | Form bermaterai + TTD suami/istri hanya untuk pinjaman mendekati batas | Bagian 5, 7 | ✅ Dikonfirmasi |
| 14 | Tenor pilihan: 10/20/30 bulan + Custom | Bagian 5, 6 | ✅ Dikonfirmasi |
| 15 | Validasi tenor vs estimasi pensiun | Bagian 5, 6 | ✅ Dikonfirmasi |
| 16 | Pinjaman baru gabungkan sisa pinjaman lama | Bagian 5, 6 | ✅ Dikonfirmasi |
| 17 | Pindah kewenangan batas potongan gaji: Admin → Bendahara | Bagian 7 | ✅ Dikonfirmasi |
| 18 | Ketua & Bendahara dapat override admin/jasa menjadi nol | Bagian 7 | ✅ Dikonfirmasi |
| 19 | Halaman SHU Bendahara: input persentase per indikator | Bagian 7, 8 | ✅ Dikonfirmasi |
| 20 | Komponen SHU: dana sosial, THR, SHU simpanan, SHU jasa, modal | Bagian 6 | ✅ Dikonfirmasi (% belum final) |
| 21 | Import massal anggota dari Excel | Bagian 7, 10 | ✅ Dikonfirmasi |
| 22 | Field baru profil: rekening, fakultas, estimasi pensiun, saldo awal | Bagian 9, 10 | ✅ Dikonfirmasi |
| 23 | Fitur setor & tarik simpanan sukarela | Bagian 5, 7 | ✅ Dikonfirmasi |
| 24 | Format ekspor Excel dan PDF untuk semua laporan | Bagian 5, 7 | ✅ Dikonfirmasi |
| 25 | Tampilan daftar anggota per Fakultas di Admin | Bagian 7, 8 | ✅ Dikonfirmasi |
| 26 | Riwayat tahunan & unduh slip PDF (Anggota) | Bagian 7, 8 | ✅ Dikonfirmasi |
| 27 | Blokir otomatis anggota gagal debit dari pengajuan pinjaman | Bagian 7 | ✅ Dikonfirmasi |
| 28 | Pengawas audit rekap gagal debit & komponen SHU | Bagian 7 | ✅ Dikonfirmasi |
| 29 | Nilai persentase komponen SHU (dana sosial, THR, dll.) | Bagian 6 | ⚠️ Perlu konfirmasi |
| 30 | Channel notifikasi gagal debit (in-app/email/WA) | Bagian 5 | ⚠️ Perlu konfirmasi |
