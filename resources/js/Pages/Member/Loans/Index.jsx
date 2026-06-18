import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, loans }) {
    return (
        <MemberLayout auth={auth} title="Pinjaman Saya">
            <Head title="Pinjaman Saya" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h2 className="ds-title-lg">Pinjaman Saya</h2>
                    <p className="ds-body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px' }}>Daftar pengajuan dan pinjaman aktif Anda.</p>
                </div>
                <Link href={route('member.loans.create')} className="ds-button-pill-cta">
                    Ajukan Pinjaman
                </Link>
            </div>

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-hairline)' }}>
                        <tr>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Tanggal</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Pokok Pinjaman</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Tenor</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Cicilan/Bulan</th>
                            <th style={{ padding: 'var(--spacing-md)', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans && loans.length > 0 ? (
                            loans.map((loan, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px' }}>
                                        {new Date(loan.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                                        Rp {new Intl.NumberFormat('id-ID').format(loan.principal_amount)}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px' }}>
                                        {loan.tenor_months} bln
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>
                                        Rp {new Intl.NumberFormat('id-ID').format(loan.monthly_installment)}
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className={`ds-badge-pill ${loan.status === 'aktif' || loan.status === 'disetujui' ? 'bg-green-100 text-green-800' : loan.status === 'ditolak' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {loan.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--color-muted)' }}>
                                    Anda belum memiliki riwayat pinjaman.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </MemberLayout>
    );
}
