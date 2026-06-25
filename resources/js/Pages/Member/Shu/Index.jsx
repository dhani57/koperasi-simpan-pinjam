import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, totalShu, porsiSimpanan, porsiPinjaman, persenKontribusiAset, totalSimpananAkumulasi, totalJasaPinjaman, tahunBuku }) {
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title={`Bagi Hasil (SHU) ${tahunBuku}`}>
            <Head title={`Bagi Hasil (SHU) ${tahunBuku}`} />

            <div style={{ position: 'relative' }}>
                {/* Dark Blue Background for Top Half */}
                <div style={{ 
                    backgroundColor: 'var(--color-surface-dark)', 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: '420px', 
                    zIndex: 0 
                }}></div>

                <div style={{ position: 'relative', zIndex: 1, padding: 'var(--spacing-xxl) 0', maxWidth: '800px', margin: '0 auto' }}>
                    
                    {/* Header */}
                    <div style={{ textAlign: 'center', color: 'white', marginBottom: 'var(--spacing-xl)' }}>
                        <div className="w-12 h-12 rounded-full bg-white/10 inline-flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Laporan Bagi Hasil (SHU) {tahunBuku}</h1>
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                            Terima kasih atas partisipasi aktif Anda. Ini adalah porsi keuntungan koperasi yang dikembalikan kepada Anda tahun ini.
                        </p>
                    </div>

                    {/* Big SHU Card */}
                    <div className="bg-[#1e293b] rounded-2xl p-6 sm:p-12 text-center shadow-2xl mb-12 border border-slate-700">
                        <div className="text-xs sm:text-sm text-white/60 tracking-wider uppercase mb-4 font-medium">
                            Total Sisa Hasil Usaha (Bagi Hasil)
                        </div>
                        <div className="font-mono text-4xl sm:text-6xl font-bold text-[#eab308] tracking-widest break-words">
                            Rp {formatRp(totalShu)}
                        </div>
                    </div>

                    {/* Breakdown Section */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Bagaimana Angka Ini Dihitung?</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>SHU dibagikan secara adil berdasarkan persentase kontribusi Anda terhadap total aset koperasi.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Porsi Simpanan */}
                        <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>Porsi Simpanan</div>
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                                Rp {formatRp(porsiSimpanan)}
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: '1.6', marginBottom: '24px', minHeight: '60px' }}>
                                Diperoleh dari saldo akumulasi simpanan Anda (Rp {formatRp(totalSimpananAkumulasi)}) yang menyumbang {persenKontribusiAset}% dari total likuiditas ketersediaan dana pinjaman koperasi.
                            </p>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                                    <span>Kontribusi Aset</span>
                                    <span>{persenKontribusiAset}%</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: `${persenKontribusiAset}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Porsi Jasa Pinjaman */}
                        <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                </div>
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>Porsi Biaya Layanan Pinjaman</div>
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                                Rp {formatRp(porsiPinjaman)}
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: '1.6', marginBottom: '24px', minHeight: '60px' }}>
                                Anda melunasi biaya layanan pinjaman sebesar Rp {formatRp(totalJasaPinjaman)} tahun ini. Semakin tinggi aktivitas peminjaman sehat, semakin tinggi margin SHU yang dikembalikan.
                            </p>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                                    <span>Aktivitas Pinjaman</span>
                                    <span>Tinggi</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '100px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', backgroundColor: 'var(--color-primary)', width: `80%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', color: 'var(--color-semantic-up)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>Pencairan Otomatis Selesai</div>
                            <div style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: '1.6' }}>
                                Seluruh dana SHU Anda sebesar <strong style={{ color: 'var(--color-ink)' }}>Rp {formatRp(totalShu)}</strong> telah dikreditkan secara otomatis ke Saldo Simpanan Anda pada <strong style={{ color: 'var(--color-ink)' }}>31 Desember {tahunBuku}</strong>. Tidak ada tindakan lebih lanjut yang perlu Anda lakukan. Anda bisa memantau perubahannya di Buku Besar.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}
