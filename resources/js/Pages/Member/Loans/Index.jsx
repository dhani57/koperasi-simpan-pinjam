import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, loans }) {
    return (
        <MemberLayout auth={auth} title="Pinjaman Saya">
            <Head title="Pinjaman Saya" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Pinjaman Saya</h2>
                        <p className="text-sm text-gray-500 mt-2">Daftar pengajuan dan pinjaman aktif Anda.</p>
                    </div>
                    <Link 
                        href={route('member.loans.create')} 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '12px 24px', 
                            backgroundColor: 'var(--color-primary)', 
                            border: 'none', 
                            borderRadius: '100px', 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: 'white', 
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Ajukan Pinjaman
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
                        <thead style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-hairline)' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>Tanggal</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>Jumlah Pinjaman</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>Tenor</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>Cicilan/Bulan</th>
                                <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans && loans.length > 0 ? (
                                loans.map((loan, idx) => (
                                    <tr key={idx} style={{ borderBottom: idx < loans.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                                            {new Date(loan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                                            Rp {new Intl.NumberFormat('id-ID').format(loan.principal_amount)}
                                            {loan.purpose && (
                                                <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 400, marginTop: '4px', fontFamily: 'var(--font-sans)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={loan.purpose}>
                                                    Ket: {loan.purpose}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                                            {loan.tenor_months} bln
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '15px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                                            Rp {new Intl.NumberFormat('id-ID').format(loan.monthly_installment)}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ 
                                                backgroundColor: loan.status === 'aktif' || loan.status === 'disetujui' ? '#dcfce7' : loan.status === 'ditolak' ? '#fee2e2' : '#fef9c3',
                                                color: loan.status === 'aktif' || loan.status === 'disetujui' ? '#166534' : loan.status === 'ditolak' ? '#991b1b' : '#854d0e',
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                textTransform: 'uppercase'
                                            }}>
                                                {loan.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-muted)' }}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-hairline)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        </div>
                                        Anda belum memiliki riwayat pinjaman.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MemberLayout>
    );
}
