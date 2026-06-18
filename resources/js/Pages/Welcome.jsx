import { Head } from '@inertiajs/react';
import TopNavUnila from '../Components/DesignSystem/TopNavUnila';
import HeroBandLight from '../Components/DesignSystem/HeroBandLight';
import ButtonPillCta from '../Components/DesignSystem/ButtonPillCta';
import FeatureCard from '../Components/DesignSystem/FeatureCard';
import CtaBandDark from '../Components/DesignSystem/CtaBandDark';
import FooterLight from '../Components/DesignSystem/FooterLight';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Koperasi Simpan Pinjam" />
            <TopNavUnila auth={auth} />
            <main>
                <HeroBandLight>
                    <div style={{ paddingRight: 'var(--spacing-xl)', maxWidth: '640px' }}>
                        <h1 className="ds-display-mega" style={{ marginBottom: 'var(--spacing-md)' }}>
                            Kelola Simpan Pinjam Anda, Lebih Transparan
                        </h1>
                        <p className="ds-body-md" style={{ color: 'var(--color-body)', marginBottom: 'var(--spacing-xl)' }}>
                            Platform manajemen sirkulasi finansial internal yang aman, terpercaya, dan terintegrasi penuh dengan sistem payroll institusi.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <ButtonPillCta href={route('login')}>
                                Masuk ke Akun
                            </ButtonPillCta>
                        </div>
                    </div>
                </HeroBandLight>

                <section style={{ backgroundColor: 'var(--color-surface-soft)', padding: 'var(--spacing-section) var(--spacing-xl)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 className="ds-display-lg" style={{ textAlign: 'center', marginBottom: 'var(--spacing-xxl)' }}>Layanan Unggulan</h2>
                        <div className="ds-grid-3up">
                            <FeatureCard title="Simpanan Rutin Otomatis">
                                Pemotongan simpanan wajib dan sukarela dilakukan secara otomatis setiap bulan langsung dari payroll, tanpa perlu transfer manual.
                            </FeatureCard>
                            <FeatureCard title="Pengajuan Pinjaman Online">
                                Ajukan pinjaman dengan mudah melalui platform. Sistem akan menampilkan simulasi cicilan sesuai dengan batas kemampuan potongan gaji Anda.
                            </FeatureCard>
                            <FeatureCard title="Transparansi Mutasi Real-time">
                                Pantau riwayat seluruh mutasi, potongan, dan saldo simpanan secara langsung dan terperinci.
                            </FeatureCard>
                        </div>
                    </div>
                </section>

                <section style={{ backgroundColor: 'var(--color-canvas)', padding: 'var(--spacing-section) var(--spacing-xl)' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h2 className="ds-display-lg" style={{ marginBottom: 'var(--spacing-xxl)' }}>Cara Kerja Sistem</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', textAlign: 'left' }}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{ 
                                    minWidth: '48px', height: '48px', borderRadius: 'var(--rounded-full)', 
                                    backgroundColor: 'var(--color-surface-strong)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center', fontWeight: '600',
                                    fontSize: '20px'
                                }}>1</div>
                                <div>
                                    <h3 className="ds-title-md">Terdaftar oleh Admin</h3>
                                    <p className="ds-body-md" style={{ color: 'var(--color-body)' }}>Akun Anda dibuat secara terpusat oleh Admin menggunakan nomor identitas NIP/NIM yang valid.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{ 
                                    minWidth: '48px', height: '48px', borderRadius: 'var(--rounded-full)', 
                                    backgroundColor: 'var(--color-surface-strong)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center', fontWeight: '600',
                                    fontSize: '20px'
                                }}>2</div>
                                <div>
                                    <h3 className="ds-title-md">Mulai Menabung atau Mengajukan Pinjaman</h3>
                                    <p className="ds-body-md" style={{ color: 'var(--color-body)' }}>Setiap bulan, potongan simpanan akan otomatis diproses. Anda juga bisa mulai mengajukan pinjaman sesuai limit gaji.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                <div style={{ 
                                    minWidth: '48px', height: '48px', borderRadius: 'var(--rounded-full)', 
                                    backgroundColor: 'var(--color-surface-strong)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center', fontWeight: '600',
                                    fontSize: '20px'
                                }}>3</div>
                                <div>
                                    <h3 className="ds-title-md">Pantau Mutasi Kapan Saja</h3>
                                    <p className="ds-body-md" style={{ color: 'var(--color-body)' }}>Akses buku besar digital pribadi Anda untuk melacak setiap rupiah yang dipotong maupun disetorkan ke koperasi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <CtaBandDark>
                    <h2 className="ds-display-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>Sudah menjadi anggota?</h2>
                    <ButtonPillCta href={route('login')} style={{ backgroundColor: 'var(--color-surface-strong)', color: 'var(--color-ink)' }}>
                        Masuk Sekarang
                    </ButtonPillCta>
                </CtaBandDark>
            </main>
            
            <FooterLight>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-xl)' }}>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Koperasi Simpan Pinjam</h3>
                        <p style={{ marginTop: 'var(--spacing-sm)' }}>Platform manajemen sirkulasi finansial tertutup.</p>
                    </div>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Layanan</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <li>Simpanan Wajib</li>
                            <li>Simpanan Sukarela</li>
                            <li>Pinjaman Anggota</li>
                            <li>Rekonsiliasi Payroll</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Kontak</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <li>Sekretariat Koperasi</li>
                            <li>Gedung Rektorat Lt. 2</li>
                            <li>Jam Layanan: 08:00 - 16:00</li>
                        </ul>
                    </div>
                </div>
            </FooterLight>
        </>
    );
}
