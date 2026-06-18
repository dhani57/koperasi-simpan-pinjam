import { Head } from '@inertiajs/react';
import TopNavUnila from '../Components/DesignSystem/TopNavUnila';
import HeroBandDark from '../Components/DesignSystem/HeroBandDark';
import ProductUiCardLight from '../Components/DesignSystem/ProductUiCardLight';
import ButtonPrimary from '../Components/DesignSystem/ButtonPrimary';
import ButtonSecondaryDark from '../Components/DesignSystem/ButtonSecondaryDark';

export default function Welcome({ auth }) {
    return (
        <div style={{ backgroundColor: 'var(--color-surface-dark)', minHeight: '100vh' }}>
            <Head title="Koperasi Simpan Pinjam" />
            <TopNavUnila auth={auth} />
            <main>
                <HeroBandDark>
                    <div style={{ paddingRight: 'var(--spacing-xl)', maxWidth: '560px' }}>
                        <h1 className="ds-display-mega" style={{ marginBottom: 'var(--spacing-md)' }}>
                            Buku Besar Digital Karyawan.
                        </h1>
                        <p className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)', marginBottom: 'var(--spacing-xl)' }}>
                            Sistem tertutup dengan integrasi potong gaji otomatis. Aman, transparan, dan tanpa repot. Khusus untuk ekosistem internal perusahaan.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <ButtonPrimary href={route('login')}>
                                Lihat Dashboard
                            </ButtonPrimary>
                            <ButtonSecondaryDark href="#">
                                Cara Kerja
                            </ButtonSecondaryDark>
                        </div>
                    </div>
                    
                    <div style={{ position: 'relative', marginTop: 'var(--spacing-xl)', flex: 1 }}>
                        <ProductUiCardLight style={{ position: 'relative', zIndex: 1, maxWidth: '440px', marginLeft: 'auto' }}>
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
                            bottom: '-60px', 
                            right: '20px', 
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
                </HeroBandDark>
            </main>
        </div>
    );
}
