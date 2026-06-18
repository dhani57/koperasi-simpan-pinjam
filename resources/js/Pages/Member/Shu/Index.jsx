import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, totalShu, porsiSimpanan, porsiPinjaman, persenKontribusiAset, totalSimpananAkumulasi, totalJasaPinjaman, tahunBuku }) {
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title={`Rapor SHU ${tahunBuku}`}>
            <Head title={`Rapor SHU ${tahunBuku}`} />

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
                        <div style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '50%', 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-yellow)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        </div>
                        <h1 className="ds-display-mega" style={{ fontSize: '36px', marginBottom: '12px' }}>Rapor SHU Anda {tahunBuku}</h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
                            Terima kasih atas partisipasi aktif Anda. Ini adalah porsi keuntungan koperasi yang dikembalikan kepada Anda tahun ini.
                        </p>
                    </div>

                    {/* Big SHU Card */}
                    <div style={{ 
                        backgroundColor: 'var(--color-surface-dark-elevated)', 
                        borderRadius: 'var(--rounded-xl)', 
                        padding: '48px', 
                        textAlign: 'center', 
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        marginBottom: 'var(--spacing-section)'
                    }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                            Total Sisa Hasil Usaha (SHU)
                        </div>
                        <div style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '64px', 
                            fontWeight: 700, 
                            color: 'var(--color-accent-yellow)',
                            letterSpacing: '2px'
                        }}>
                            Rp {formatRp(totalShu)}
                        </div>
                    </div>

                    {/* Breakdown Section */}
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <h2 className="ds-title-md" style={{ fontSize: '24px' }}>Bagaimana Angka Ini Dihitung?</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>SHU dibagikan secara adil berdasarkan persentase kontribusi Anda terhadap total aset koperasi.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
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
                                <div style={{ fontWeight: 600, fontSize: '15px' }}>Porsi Jasa Pinjaman</div>
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
                                Rp {formatRp(porsiPinjaman)}
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: '1.6', marginBottom: '24px', minHeight: '60px' }}>
                                Anda melunasi jasa pinjaman sebesar Rp {formatRp(totalJasaPinjaman)} tahun ini. Semakin tinggi aktivitas peminjaman sehat, semakin tinggi margin SHU yang dikembalikan.
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
