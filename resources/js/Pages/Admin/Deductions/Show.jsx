import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Show({ auth, period, details, totals }) {
    const formatMonth = (dateString) => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long' }).format(new Date(dateString));
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const totalSaving = totals?.total_saving || 0;
    const totalLoan = totals?.total_loan || 0;
    const totalAll = Number(totalSaving) + Number(totalLoan);

    const [confirmConfig, setConfirmConfig] = useState({
        show: false,
        title: '',
        message: '',
        type: 'primary',
        confirmText: 'Setujui',
        actionCallback: null,
    });

    const openConfirm = (title, message, type, confirmText, actionCallback) => {
        setConfirmConfig({
            show: true,
            title,
            message,
            type,
            confirmText,
            actionCallback
        });
    };

    const handleConfirm = () => {
        if (confirmConfig.actionCallback) {
            confirmConfig.actionCallback();
        }
        setConfirmConfig({ ...confirmConfig, show: false });
    };

    return (
        <AdminLayout auth={auth} title={`Detail Potongan: ${formatMonth(`${period.year}-${String(period.month).padStart(2, '0')}-01`)}`}>
            <Head title="Detail Potongan Bulanan" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Link href={route('admin.deductions.index')} className="ds-button-secondary" style={{ textDecoration: 'none' }}>
                    &larr; Kembali
                </Link>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {auth.user.role === 'bendahara' && period.status === 'draf' && (
                        <button 
                            onClick={() => {
                                openConfirm(
                                    'Penyelesaian Tagihan',
                                    'Semua potongan tagihan ini sudah berhasil diproses di Penggajian? Tindakan ini akan secara permanen menambah saldo tabungan dan mengurangi sisa pinjaman anggota.',
                                    'primary',
                                    'Sudah Dikirim',
                                    () => router.patch(route('admin.deductions.selesai', period.id))
                                );
                            }}
                            className="ds-button-primary" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#10b981', color: 'white', border: 'none' }}>
                            Sudah Dikirim
                        </button>
                    )}
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
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', width: '40px' }}>No.</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Nama Anggota</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>NIP/NIM</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Simpanan Rutin</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Cicilan + Biaya Layanan</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.data.map((detail, index) => {
                            const detailLoanTotal = Number(detail.loan_principal_amount) + Number(detail.loan_fee_amount);
                            const detailTotal = Number(detail.routine_saving_amount) + detailLoanTotal;
                            
                            return (
                                <tr key={detail.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{(details.current_page - 1) * details.per_page + index + 1}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{detail.user?.name}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{detail.user?.identity_number}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>Rp {formatRp(detail.routine_saving_amount)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>Rp {formatRp(detailLoanTotal)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Rp {formatRp(detailTotal)}</td>
                                </tr>
                            );
                        })}
                        {details.data.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>
                                    Belum ada data rincian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Pagination links={details.links} />
            </div>
            <ConfirmModal 
                show={confirmConfig.show}
                onClose={() => setConfirmConfig({ ...confirmConfig, show: false })}
                onConfirm={handleConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
            />
        </AdminLayout>
    );
}
