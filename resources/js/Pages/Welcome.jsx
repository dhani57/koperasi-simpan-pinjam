import { Head } from '@inertiajs/react';
import TopNavUnila from '../Components/DesignSystem/TopNavUnila';
import HeroBandDark from '../Components/DesignSystem/HeroBandDark';
import ProductUiCardLight from '../Components/DesignSystem/ProductUiCardLight';
import ButtonPrimary from '../Components/DesignSystem/ButtonPrimary';
import ButtonSecondaryDark from '../Components/DesignSystem/ButtonSecondaryDark';
import FeatureCard from '../Components/DesignSystem/FeatureCard';
import CtaBandDark from '../Components/DesignSystem/CtaBandDark';
import FooterLight from '../Components/DesignSystem/FooterLight';
import ButtonPillCta from '../Components/DesignSystem/ButtonPillCta';

export default function Welcome({ auth }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Head title="Koperasi Institusi" />
            
            <div style={{ backgroundColor: 'var(--color-surface-dark)' }}>
                <TopNavUnila auth={auth} />
            </div>

            <main style={{ flex: 1 }}>
                <HeroBandDark>
                    <div style={{ paddingRight: 'var(--spacing-xl)', maxWidth: '560px' }}>
                        <h1 className="ds-display-mega" style={{ marginBottom: 'var(--spacing-md)' }}>
                            Buku Besar Digital Karyawan.
                        </h1>
                        <p className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)', marginBottom: 'var(--spacing-xl)' }}>
                            Sistem tertutup dengan integrasi potong gaji otomatis. Aman, transparan, dan tanpa repot. Khusus untuk ekosistem internal perusahaan.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <ButtonPrimary href={route('login')} className="hover:opacity-90 transition-opacity" style={{ boxShadow: '0 4px 12px rgba(11,94,168,0.2)' }}>
                                Lihat Dashboard
                            </ButtonPrimary>
                            <ButtonSecondaryDark href="#cara-kerja">
                                Cara Kerja
                            </ButtonSecondaryDark>
                        </div>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        {/* Wrapper acts as bounding box for both cards. Margin offsets the absolute card. */}
                        <div style={{ position: 'relative', width: '100%', maxWidth: '440px', marginBottom: '100px', marginRight: '50px' }}>
                            <ProductUiCardLight style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                    <div className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Estimasi Potong Gaji (Okt)</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 600 }}>Rp 750.000</div>
                                </div>
                                
                                <div className="ds-asset-row">
                                    <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                                        <div className="ds-asset-icon-circular">S</div>
                                        <div>
                                            <div className="ds-title-sm" style={{ color: 'var(--color-ink)' }}>Simpanan Wajib</div>
                                            <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Auto-deduct tgl 25</div>
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 500 }}>Rp 100.000</div>
                                </div>
                                
                                <div className="ds-asset-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                                        <div className="ds-asset-icon-circular" style={{ backgroundColor: 'var(--color-surface-strong)', color: 'var(--color-primary)' }}>P</div>
                                        <div>
                                            <div className="ds-title-sm" style={{ color: 'var(--color-ink)' }}>Cicilan Pinjaman #124</div>
                                            <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Sisa 3 bulan</div>
                                        </div>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 500 }}>Rp 650.000</div>
                                </div>
                            </ProductUiCardLight>
                            
                            <ProductUiCardLight style={{ 
                                position: 'absolute', 
                                top: 'calc(100% - 20px)', 
                                right: '-50px', 
                                zIndex: 2, 
                                width: '320px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                    <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Proyeksi SHU Akhir Tahun</div>
                                    <span className="ds-badge-pill">ESTIMASI</span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600, color: 'var(--color-accent-yellow)' }}>
                                    Rp 2.150.000
                                </div>
                                <div className="ds-body-sm" style={{ color: 'var(--color-semantic-up)', marginTop: '4px', fontWeight: 500 }}>
                                    +12.5% dari tahun lalu
                                </div>
                            </ProductUiCardLight>
                        </div>
                    </div>
                </HeroBandDark>

                {/* PRD Content Restored */}
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

                <section id="cara-kerja" style={{ backgroundColor: 'var(--color-canvas)', padding: 'var(--spacing-section) var(--spacing-xl)' }}>
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
                    <h2 className="ds-display-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>Ingin menjadi anggota?</h2>
                    <ButtonPillCta href="mailto:admin@koperasi.internal" className="hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--color-surface-strong)', color: 'var(--color-ink)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        Hubungi Admin
                    </ButtonPillCta>
                </CtaBandDark>
            </main>
            
            <FooterLight>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Koperasi Karyawan Eksekutif</h3>
                        <p style={{ marginTop: 'var(--spacing-sm)' }}>Platform manajemen sirkulasi finansial tertutup yang didesain khusus untuk efisiensi ekosistem internal perusahaan.</p>
                    </div>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Produk & Layanan</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <li>Simpanan Wajib & Sukarela</li>
                            <li>Pinjaman Multiguna</li>
                            <li>Proyeksi SHU (Sisa Hasil Usaha)</li>
                            <li>Integrasi Payroll Otomatis</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Hubungi Kami</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <li>Sekretariat Pusat</li>
                            <li>Gedung Utama Perusahaan, Lt. 3</li>
                            <li>Ext. 4021 / koperasi@internal.app</li>
                            <li>Senin - Jumat, 08:00 - 16:00</li>
                        </ul>
                    </div>
                </div>
            </FooterLight>
        </div>
    );
}
