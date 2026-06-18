import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, mutations }) {
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title="Riwayat Mutasi">
            <Head title="Riwayat Mutasi" />

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--spacing-xl) 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h2 className="ds-display-mega" style={{ fontSize: '32px', letterSpacing: '-0.5px', marginBottom: '12px' }}>Riwayat Mutasi & E-Slip</h2>
                    <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                        Pantau rekam jejak kontribusi dan potongan gaji Anda setiap bulan secara transparan.
                    </p>
                </div>

                {/* Filter and Summary Card */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-lg)', border: '1px solid var(--color-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Periode:</span>
                        <select style={{ 
                            padding: '8px 32px 8px 16px', 
                            borderRadius: '100px', 
                            border: '1px solid var(--color-hairline)', 
                            backgroundColor: 'var(--color-surface-soft)',
                            fontSize: '14px',
                            fontWeight: 500,
                            appearance: 'none',
                            cursor: 'pointer'
                        }}>
                            <option>Semua Periode</option>
                            <option>Juli 2026</option>
                            <option>Juni 2026</option>
                            <option>Mei 2026</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>Total Potongan Bulan Ini</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 600 }}>Rp {formatRp(auth.user.monthly_saving_nominal)}</div>
                        </div>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', backgroundColor: 'var(--color-primary)', border: 'none', borderRadius: '100px', fontSize: '14px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="12" y2="18"></line><line x1="15" y1="15" x2="12" y2="18"></line></svg>
                            Unduh E-Slip PDF
                        </button>
                    </div>
                </div>

                {/* Mutations List */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', overflow: 'hidden' }}>
                    {mutations && mutations.length > 0 ? (
                        mutations.map((mut, idx) => {
                            const isPositive = mut.amount > 0 || mut.type === 'pencairan_pinjaman';
                            const iconColor = isPositive ? 'var(--color-semantic-up)' : 'var(--color-semantic-down)';
                            const bgColor = isPositive ? '#dcfce7' : '#fee2e2'; // green-100 or red-100
                            const amountColor = isPositive ? 'var(--color-semantic-up)' : 'var(--color-semantic-down)';
                            const prefix = isPositive ? '+' : '-';

                            return (
                                <div key={idx} style={{ padding: 'var(--spacing-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx < mutations.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: bgColor, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {isPositive ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>
                                                {mut.description || mut.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </div>
                                            <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                                                {new Date(mut.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {' • '}{mut.type.replace(/_/g, ' ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '16px', color: amountColor }}>
                                            {prefix}Rp {formatRp(Math.abs(mut.amount))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-muted)' }}>
                            Belum ada catatan mutasi.
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
