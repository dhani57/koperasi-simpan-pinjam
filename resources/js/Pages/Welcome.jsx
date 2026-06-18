import { Head } from '@inertiajs/react';
import TopNavUnila from '../Components/DesignSystem/TopNavUnila';
import HeroBandDark from '../Components/DesignSystem/HeroBandDark';
import ProductUiCardDark from '../Components/DesignSystem/ProductUiCardDark';
import ButtonPrimary from '../Components/DesignSystem/ButtonPrimary';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Koperasi Simpan Pinjam" />
            <TopNavUnila auth={auth} />
            <main>
                <HeroBandDark>
                    <div style={{ paddingRight: 'var(--spacing-xl)' }}>
                        <h1 className="ds-display-mega" style={{ marginBottom: 'var(--spacing-md)' }}>
                            Buku Besar Koperasi Era Digital.
                        </h1>
                        <p className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)', marginBottom: 'var(--spacing-xl)', maxWidth: '480px' }}>
                            Platform manajemen sirkulasi finansial tertutup yang aman, transparan, dan terintegrasi penuh dengan payroll institusi.
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <ButtonPrimary href={route('login')} isLarge={true}>
                                Get Started
                            </ButtonPrimary>
                        </div>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <ProductUiCardDark style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{ borderBottom: '1px solid var(--color-surface-dark)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-base)' }}>
                                <div className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)' }}>Total Saldo Simpanan</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600 }}>Rp 12.500.000</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="ds-body-md">Potongan Wajib Bulanan</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-semantic-up)' }}>Rp 500.000</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="ds-body-md">Limit Gaji Tersedia</div>
                                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-semantic-down)' }}>Rp 1.250.000</div>
                                </div>
                            </div>
                        </ProductUiCardDark>
                        
                        <ProductUiCardDark style={{ 
                            position: 'absolute', 
                            top: '-30px', 
                            right: '-30px', 
                            zIndex: 1, 
                            opacity: 0.6,
                            transform: 'scale(0.9)'
                        }}>
                            <div className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)' }}>Simulasi Pinjaman</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>Tenor 12 Bulan</div>
                        </ProductUiCardDark>
                    </div>
                </HeroBandDark>
            </main>
        </>
    );
}
