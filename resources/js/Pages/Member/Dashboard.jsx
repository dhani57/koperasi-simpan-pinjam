import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Dashboard({ auth, totalSimpanan, simpananRutin, plafonTersedia, activeLoans, recentMutations, lastShu }) {
    // Kalkulasi untuk "Estimasi Potongan Gaji"
    const estimasiPotongan = simpananRutin + activeLoans.reduce((acc, loan) => acc + parseFloat(loan.monthly_installment), 0);
    
    // Kalkulasi untuk "Sisa Utang Pinjaman"
    const totalPokokPinjamanAktif = activeLoans.reduce((acc, loan) => acc + parseFloat(loan.principal_amount), 0);

    return (
        <MemberLayout auth={auth} title="Dashboard">
            <Head title="Dashboard" />

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-xl) 0' }}>
                
                {/* Header Welcome */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 className="ds-display-mega" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Selamat datang, {auth.user.name.split(' ')[0]}!</h1>
                        <span style={{ backgroundColor: 'var(--color-accent-yellow)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>AKTIF</span>
                    </div>
                    <a href={route('member.mutations.print')} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--color-surface-strong)', border: 'none', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', cursor: 'pointer', textDecoration: 'none' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="18"></line><line x1="15" y1="15" x2="12" y2="18"></line></svg>
                        Unduh E-Slip
                    </a>
                </div>

                {/* Big Dark Card: Estimasi Potongan Gaji */}
                <div style={{ backgroundColor: 'var(--color-surface-dark)', color: 'white', borderRadius: 'var(--rounded-xl)', padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            Estimasi Potongan Gaji ({new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 600, letterSpacing: '-1px', marginBottom: 'var(--spacing-md)' }}>
                            Rp {new Intl.NumberFormat('id-ID').format(estimasiPotongan)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Pemotongan otomatis dijadwalkan pada tanggal 25.
                        </div>
                    </div>
                    {/* Decor circle */}
                    <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '150px', height: '150px', borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)' }}></div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '8px' }}>Total Tabungan Saya</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>
                            Rp {new Intl.NumberFormat('id-ID').format(totalSimpanan)}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '8px' }}>Sisa Utang Pinjaman</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>
                            Rp {new Intl.NumberFormat('id-ID').format(totalPokokPinjamanAktif)}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '8px' }}>Bagi Hasil (SHU) Terakhir</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600, color: 'var(--color-semantic-up)' }}>
                            Rp {new Intl.NumberFormat('id-ID').format(lastShu || 0)}
                        </div>
                    </div>
                </div>

                {/* Aktivitas Terakhir */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-hairline)' }}>
                        <h3 className="ds-title-md" style={{ margin: 0, fontSize: '16px' }}>Aktivitas Terakhir</h3>
                    </div>
                    
                    <div>
                        {recentMutations && recentMutations.length > 0 ? (
                            recentMutations.map((mut, idx) => {
                                let icon = null;
                                let amountColor = 'var(--color-ink)';
                                let amountPrefix = '';

                                if (mut.type === 'pencairan_pinjaman' || mut.amount > 0) {
                                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>;
                                    amountColor = 'var(--color-semantic-up)';
                                    amountPrefix = '+';
                                } else if (mut.type.includes('simpanan') || mut.type.includes('potongan')) {
                                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
                                } else {
                                    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
                                }

                                return (
                                    <div key={idx} className={`p-4 lg:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 ${idx < recentMutations.length - 1 ? 'border-b border-[var(--color-hairline)]' : ''}`}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-surface-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {icon}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{mut.description || mut.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{mut.type.replace(/_/g, ' ')}</div>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right ml-[56px] sm:ml-0">
                                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '14px', color: amountColor, marginBottom: '4px' }}>
                                                {amountPrefix}Rp {new Intl.NumberFormat('id-ID').format(Math.abs(mut.amount))}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                                                {new Date(mut.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-muted)' }}>
                                Belum ada riwayat aktivitas.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </MemberLayout>
    );
}
