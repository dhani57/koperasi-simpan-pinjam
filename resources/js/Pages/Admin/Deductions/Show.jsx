import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ auth, period, details }) {
    const formatMonth = (dateString) => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long' }).format(new Date(dateString));
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const totalSaving = details.reduce((sum, item) => sum + Number(item.routine_saving_amount), 0);
    const totalLoan = details.reduce((sum, item) => sum + Number(item.loan_principal_amount) + Number(item.loan_fee_amount), 0);
    const totalAll = totalSaving + totalLoan;

    return (
        <AdminLayout auth={auth} title={`Detail Potongan: ${formatMonth(`${period.year}-${String(period.month).padStart(2, '0')}-01`)}`}>
            <Head title="Detail Potongan Bulanan" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Link href={route('admin.deductions.index')} className="ds-button-secondary" style={{ textDecoration: 'none' }}>
                    &larr; Kembali
                </Link>
                {auth.user.role === 'bendahara' && (
                    <a 
                        href={route('admin.deductions.export', period.id)}
                        className="ds-button-primary"
                        style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ekspor CSV
                    </a>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--rounded-xl)', border: '1px solid var(--color-hairline)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Total Simpanan</div>
                    <div className="number-display" style={{ fontSize: '24px', color: 'var(--color-semantic-up)' }}>Rp {formatRp(totalSaving)}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--rounded-xl)', border: '1px solid var(--color-hairline)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Total Cicilan Pinjaman</div>
                    <div className="number-display" style={{ fontSize: '24px', color: 'var(--color-semantic-up)' }}>Rp {formatRp(totalLoan)}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--rounded-xl)', border: '1px solid var(--color-hairline)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Total Keseluruhan</div>
                    <div className="number-display" style={{ fontSize: '24px', fontWeight: 'bold' }}>Rp {formatRp(totalAll)}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: 'var(--rounded-xl)', border: '1px solid var(--color-hairline)' }}>
                    <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Status</div>
                    <span style={{ 
                        display: 'inline-block',
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        fontSize: '14px', 
                        fontWeight: 600,
                        backgroundColor: period.status === 'selesai' ? '#dcfce7' : '#fef3c7',
                        color: period.status === 'selesai' ? '#166534' : '#92400e'
                    }}>
                        {period.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', overflowX: 'auto' }}>
                <h2 className="ds-title-md" style={{ marginBottom: '24px' }}>Rincian per Anggota</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Nama Anggota</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>NIP/NIM</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Simpanan Rutin</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Pokok + Jasa Pinjaman</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map((detail) => {
                            const detailLoanTotal = Number(detail.loan_principal_amount) + Number(detail.loan_fee_amount);
                            const detailTotal = Number(detail.routine_saving_amount) + detailLoanTotal;
                            
                            return (
                                <tr key={detail.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{detail.user?.name}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{detail.user?.identity_number}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>Rp {formatRp(detail.routine_saving_amount)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>Rp {formatRp(detailLoanTotal)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Rp {formatRp(detailTotal)}</td>
                                </tr>
                            );
                        })}
                        {details.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>
                                    Belum ada data rincian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
