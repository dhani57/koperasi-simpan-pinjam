import { Head } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, mutations }) {
    return (
        <MemberLayout auth={auth} title="Riwayat Mutasi">
            <Head title="Riwayat Mutasi" />

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h2 className="ds-title-lg">Buku Besar Pribadi</h2>
                <p className="ds-body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px' }}>Seluruh riwayat mutasi masuk dan keluar dari akun koperasi Anda.</p>
            </div>

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-hairline)' }}>
                        <tr>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Tanggal</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Deskripsi</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Jenis Mutasi</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500, textAlign: 'right' }}>Nominal Mutasi</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500, textAlign: 'right' }}>Saldo Akhir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mutations && mutations.length > 0 ? (
                            mutations.map((mut, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                        {new Date(mut.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px' }}>
                                        {mut.description || '-'}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px' }}>
                                        <span style={{ backgroundColor: 'var(--color-surface-soft)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {mut.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', textAlign: 'right', color: mut.amount > 0 ? 'var(--color-semantic-up)' : 'var(--color-ink)', fontWeight: 500 }}>
                                        {mut.amount > 0 ? '+' : ''}Rp {new Intl.NumberFormat('id-ID').format(mut.amount)}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                                        Rp {new Intl.NumberFormat('id-ID').format(mut.balance_after)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-muted)' }}>
                                    Belum ada catatan mutasi untuk akun Anda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MemberLayout>
    );
}
