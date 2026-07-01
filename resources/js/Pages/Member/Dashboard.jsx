import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Dashboard({ auth, totalSimpanan, simpananPokok, simpananWajib, simpananSukarela, monthlySimpananWajib, monthlySimpananSukarela, plafonTersedia, activeLoans, recentMutations, lastShu, hasFailedDebit, pendingConfirmation }) {
    // Kalkulasi untuk "Estimasi Potongan Gaji"
    const estimasiPotongan = (monthlySimpananWajib || 0) + (monthlySimpananSukarela || 0) + activeLoans.reduce((acc, loan) => acc + parseFloat(loan.monthly_installment || loan.monthly_principal_installment || 0) + parseFloat(loan.current_year_monthly_fee || 0), 0);
    
    // Kalkulasi untuk "Sisa Utang Pinjaman"
    const totalPokokPinjamanAktif = activeLoans.reduce((acc, loan) => acc + parseFloat(loan.current_remaining_principal || loan.principal_amount || 0), 0);

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title="Dashboard">
            <Head title="Dashboard" />

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-xl) 0' }}>
                
                {/* Header Welcome */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1 className="ds-display-mega" style={{ fontSize: '32px', letterSpacing: '-0.5px' }}>Selamat datang, {auth.user.name.split(' ')[0]}!</h1>
                        <span style={{ backgroundColor: hasFailedDebit ? '#ef4444' : 'var(--color-accent-yellow)', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700 }}>
                            {hasFailedDebit ? 'GAGAL DEBIT' : 'AKTIF'}
                        </span>
                    </div>
                    <a href={route('member.mutations.print')} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'var(--color-surface-strong)', border: 'none', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', cursor: 'pointer', textDecoration: 'none' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="18"></line><line x1="15" y1="15" x2="12" y2="18"></line></svg>
                        Unduh E-Slip
                    </a>
                </div>

                {/* Banner: Saldo Terkunci (PRD Bagian 2.3) */}
                {pendingConfirmation && (
                    <div style={{ 
                        padding: '16px 20px', borderRadius: '12px', marginBottom: 'var(--spacing-lg)',
                        backgroundColor: '#fffbeb', border: '1px solid #fde68a',
                        display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', color: '#92400e', lineHeight: 1.6
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <div>
                            <strong>Saldo Belum Diperbarui</strong> — Saldo yang ditampilkan adalah saldo terakhir yang sudah terkonfirmasi. Data potongan bulan ini sedang menunggu konfirmasi Bendahara. Saldo akan diperbarui setelah proses konfirmasi selesai.
                        </div>
                    </div>
                )}

                {/* Banner: Gagal Debit Warning */}
                {hasFailedDebit && (
                    <div style={{ 
                        padding: '16px 20px', borderRadius: '12px', marginBottom: 'var(--spacing-lg)',
                        backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                        display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', color: '#991b1b', lineHeight: 1.6
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div>
                            <strong>Gagal Debit Aktif</strong> — Potongan gaji Anda pada periode terakhir gagal diproses oleh bank. Anda saat ini tidak dapat mengajukan pinjaman baru. Silakan hubungi Admin untuk informasi lebih lanjut.
                        </div>
                    </div>
                )}

                {/* Big Dark Card: Estimasi Potongan Gaji */}
                <div style={{ backgroundColor: 'var(--color-surface-dark)', color: 'white', borderRadius: 'var(--rounded-xl)', padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                            Estimasi Potongan Gaji ({new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '48px', fontWeight: 600, letterSpacing: '-1px', marginBottom: 'var(--spacing-md)' }}>
                            Rp {formatRp(estimasiPotongan)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Pemotongan otomatis dijadwalkan pada tanggal 25.
                        </div>
                    </div>
                    {/* Decor circle */}
                    <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '150px', height: '150px', borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)' }}></div>
                </div>

                {/* Saldo per Jenis Simpanan (PRD Bagian 7.1) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div style={{ backgroundColor: '#eef2ff', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid #c7d2fe' }}>
                        <div style={{ fontSize: '12px', color: '#4338ca', marginBottom: '6px', fontWeight: 600 }}>Simpanan Pokok</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: '#3730a3' }}>
                            Rp {formatRp(simpananPokok || 0)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6366f1', marginTop: '4px' }}>Tidak dapat ditarik</div>
                    </div>
                    <div style={{ backgroundColor: '#ecfdf5', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: '12px', color: '#047857', marginBottom: '6px', fontWeight: 600 }}>Simpanan Wajib</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: '#065f46' }}>
                            Rp {formatRp(simpananWajib || 0)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>Rp {formatRp(monthlySimpananWajib || 0)}/bulan</div>
                    </div>
                    <div style={{ backgroundColor: '#fefce8', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid #fde68a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#a16207', fontWeight: 600 }}>Simpanan Sukarela</span>
                            <Link href={route('member.voluntary-saving-requests.index')} style={{ fontSize: '11px', color: '#d97706', fontWeight: 600, textDecoration: 'none' }}>Kelola →</Link>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: '#92400e' }}>
                            Rp {formatRp(simpananSukarela || 0)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#d97706', marginTop: '4px' }}>Rp {formatRp(monthlySimpananSukarela || 0)}/bulan · Dapat ditarik</div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '8px' }}>Total Seluruh Simpanan</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>
                            Rp {formatRp(totalSimpanan)}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '8px' }}>Sisa Utang Pinjaman</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>
                            Rp {formatRp(totalPokokPinjamanAktif)}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '8px' }}>Bagi Hasil (SHU) Terakhir</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600, color: 'var(--color-semantic-up)' }}>
                            Rp {formatRp(lastShu || 0)}
                        </div>
                    </div>
                </div>

                {/* Aktivitas Terakhir */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', overflow: 'hidden' }}>
                    <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="ds-title-md" style={{ margin: 0, fontSize: '16px' }}>Aktivitas Terakhir</h3>
                        <Link href={route('member.mutations.index')} style={{ fontSize: '13px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                            Lihat Semua →
                        </Link>
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
                                                {amountPrefix}Rp {formatRp(Math.abs(mut.amount))}
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
