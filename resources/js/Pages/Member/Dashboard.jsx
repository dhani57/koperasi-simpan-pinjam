import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';
import ProductUiCardLight from '@/Components/DesignSystem/ProductUiCardLight';
import FeatureCard from '@/Components/DesignSystem/FeatureCard';

export default function Dashboard({ auth, totalSimpanan, simpananRutin, plafonTersedia, activeLoans, recentMutations }) {
    return (
        <MemberLayout auth={auth} title="Dasbor Buku Besar">
            <Head title="Dasbor" />

            <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                {/* Saldo Section (Spans 8 cols on LG) */}
                <div className="col-span-12 lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    
                    {/* Main Balance Card */}
                    <ProductUiCardLight>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
                            <div>
                                <div className="ds-body-sm" style={{ color: 'var(--color-muted)', marginBottom: '4px' }}>Total Simpanan Aktif</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600, color: 'var(--color-ink)' }}>
                                    Rp {new Intl.NumberFormat('id-ID').format(totalSimpanan)}
                                </div>
                            </div>
                            <div className="ds-badge-pill">
                                Rp {new Intl.NumberFormat('id-ID').format(simpananRutin)} / bln
                            </div>
                        </div>

                        <div className="ds-grid-3up">
                            <div style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-md)' }}>
                                <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Plafon Pinjaman Tersedia</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 600, marginTop: '4px', color: 'var(--color-primary)' }}>
                                    Rp {new Intl.NumberFormat('id-ID').format(plafonTersedia)}
                                </div>
                                <div className="ds-body-sm" style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '4px' }}>Limit Gaji per Bulan</div>
                            </div>
                            
                            <div style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-md)' }}>
                                <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Pinjaman Aktif</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 600, marginTop: '4px', color: 'var(--color-ink)' }}>
                                    {activeLoans.length} Fasilitas
                                </div>
                            </div>
                        </div>
                    </ProductUiCardLight>

                    {/* Recent Mutations */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h3 className="ds-title-md">Mutasi Terakhir</h3>
                            <Link href={route('member.mutations.index')} className="ds-body-sm" style={{ color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
                                Lihat Semua
                            </Link>
                        </div>

                        {recentMutations && recentMutations.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {recentMutations.map((mut, idx) => (
                                    <div key={idx} className="ds-asset-row" style={{ borderBottom: idx === recentMutations.length - 1 ? 'none' : '1px solid var(--color-hairline)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                                            <div className="ds-asset-icon-circular" style={{ 
                                                backgroundColor: mut.type.includes('pinjaman') ? 'var(--color-surface-strong)' : 'var(--color-surface-soft)', 
                                                color: mut.type.includes('pinjaman') ? 'var(--color-primary)' : 'var(--color-ink)' 
                                            }}>
                                                {mut.type.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="ds-title-sm" style={{ color: 'var(--color-ink)' }}>{mut.description || mut.type}</div>
                                                <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>{new Date(mut.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 500, color: mut.amount > 0 ? 'var(--color-semantic-up)' : 'var(--color-ink)' }}>
                                                {mut.amount > 0 ? '+' : ''}Rp {new Intl.NumberFormat('id-ID').format(mut.amount)}
                                            </div>
                                            <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>
                                                Saldo: Rp {new Intl.NumberFormat('id-ID').format(mut.balance_after)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-muted)', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-md)' }}>
                                Belum ada riwayat mutasi.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Cards (Spans 4 cols on LG) */}
                <div className="col-span-12 lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    
                    <div style={{ backgroundColor: 'var(--color-surface-dark)', color: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 className="ds-title-md" style={{ color: 'white', marginBottom: 'var(--spacing-xs)' }}>Butuh Dana Cepat?</h3>
                            <p className="ds-body-sm" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--spacing-lg)' }}>
                                Ajukan pinjaman langsung dari sistem dengan simulasi otomatis sesuai plafon gaji Anda.
                            </p>
                            <Link href={route('member.loans.create')} className="ds-button-pill-cta" style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-canvas)', color: 'var(--color-ink)' }}>
                                Ajukan Pinjaman
                            </Link>
                        </div>
                        {/* Decor circle */}
                        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    {activeLoans && activeLoans.length > 0 && (
                        <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)' }}>
                            <h3 className="ds-title-md" style={{ marginBottom: 'var(--spacing-md)' }}>Pinjaman Aktif</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {activeLoans.map((loan, idx) => (
                                    <div key={idx} style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span className="ds-body-sm" style={{ fontWeight: 600 }}>Pokok: Rp {new Intl.NumberFormat('id-ID').format(loan.principal_amount)}</span>
                                            <span className="ds-badge-pill" style={{ fontSize: '10px' }}>{loan.status.toUpperCase()}</span>
                                        </div>
                                        <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>
                                            Cicilan: Rp {new Intl.NumberFormat('id-ID').format(loan.monthly_installment)} / bln
                                        </div>
                                        <div className="ds-body-sm" style={{ color: 'var(--color-muted)', marginTop: '2px' }}>
                                            Tenor: {loan.tenor_months} bulan
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
