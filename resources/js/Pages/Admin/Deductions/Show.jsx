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

    const isPengurus = auth.user.role === 'pengurus';
    const isBendahara = auth.user.role === 'bendahara';
    const isPengawas = auth.user.role === 'pengawas';
    const isNotConfirmed = period.status !== 'dikonfirmasi';
    const failedCount = details.data.filter(d => d.status === 'gagal').length;

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

    const handleMarkFailed = (detail) => {
        openConfirm(
            'Tandai Gagal Debit',
            `Tandai ${detail.user?.name} sebagai gagal debit untuk periode ini? Anggota yang gagal debit tidak akan bisa mengajukan pinjaman baru.`,
            'danger',
            'Tandai Gagal',
            () => router.patch(route('admin.deductions.detail.fail', [period.id, detail.id]))
        );
    };

    const handleMarkUnfailed = (detail) => {
        openConfirm(
            'Batalkan Status Gagal',
            `Batalkan status gagal debit untuk ${detail.user?.name}?`,
            'primary',
            'Batalkan Gagal',
            () => router.patch(route('admin.deductions.detail.unfail', [period.id, detail.id]))
        );
    };

    const handleConfirmPeriod = () => {
        openConfirm(
            'Konfirmasi Final Periode',
            `Anda yakin ingin mengkonfirmasi periode ini? Setelah dikonfirmasi:\n• Saldo anggota yang BERHASIL akan diperbarui\n• Anggota yang GAGAL DEBIT tidak akan diproses\n• Tindakan ini tidak dapat dibatalkan`,
            'primary',
            'Konfirmasi Final',
            () => router.post(route('admin.deductions.confirm', period.id))
        );
    };

    const getStatusBadge = (status) => {
        const configs = {
            'berhasil': { bg: '#dcfce7', color: '#166534', label: 'BERHASIL' },
            'gagal': { bg: '#fee2e2', color: '#991b1b', label: 'GAGAL DEBIT' },
            'menunggu': { bg: '#fef3c7', color: '#92400e', label: 'MENUNGGU' },
        };
        const config = configs[status] || configs['menunggu'];
        return (
            <span style={{ 
                display: 'inline-block', padding: '3px 8px', borderRadius: '4px', 
                fontSize: '11px', fontWeight: 700, backgroundColor: config.bg, color: config.color 
            }}>
                {config.label}
            </span>
        );
    };

    const getPeriodStatusBadge = (status) => {
        const configs = {
            'dikonfirmasi': { bg: '#dcfce7', color: '#166534', label: 'DIKONFIRMASI' },
            'selesai': { bg: '#dcfce7', color: '#166534', label: 'SELESAI' },
            'proses': { bg: '#fef3c7', color: '#92400e', label: 'PROSES' },
            'draf': { bg: '#e0e7ff', color: '#3730a3', label: 'DRAF' },
        };
        const config = configs[status] || { bg: '#f1f5f9', color: '#475569', label: status?.toUpperCase() };
        return (
            <span style={{ 
                display: 'inline-block', padding: '6px 12px', borderRadius: '4px', 
                fontSize: '14px', fontWeight: 600, backgroundColor: config.bg, color: config.color 
            }}>
                {config.label}
            </span>
        );
    };

    return (
        <AdminLayout auth={auth} title={`Detail Potongan: ${formatMonth(`${period.year}-${String(period.month).padStart(2, '0')}-01`)}`}>
            <Head title="Detail Potongan Bulanan" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <Link href={route('admin.deductions.index')} className="ds-button-secondary" style={{ textDecoration: 'none' }}>
                    &larr; Kembali
                </Link>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Bendahara: Konfirmasi Final (replaces markAsSelesai for new flow) */}
                    {isBendahara && isNotConfirmed && period.status !== 'proses' && (
                        <button 
                            onClick={handleConfirmPeriod}
                            className="ds-button-primary" 
                            style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#10b981', color: 'white', border: 'none' }}
                        >
                            Konfirmasi Final
                        </button>
                    )}
                    {/* Bendahara: Legacy selesai button */}
                    {isBendahara && period.status === 'draf' && (
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
                            className="ds-button-primary" style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#6366f1', color: 'white', border: 'none' }}>
                            Sudah Dikirim
                        </button>
                    )}
                    {(isBendahara || isPengawas) && (
                        <>
                            <a 
                                href={route('admin.deductions.export', period.id)}
                                className="ds-button-primary"
                                style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none' }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ekspor CSV
                            </a>
                            <a 
                                href={route('admin.deductions.export-failed', period.id)}
                                className="ds-button-primary"
                                style={{ padding: '8px 16px', fontSize: '14px', textDecoration: 'none', backgroundColor: '#e53e3e', border: 'none' }}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ekspor Gagal Debit
                            </a>
                        </>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
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
                    <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Status Periode</div>
                    {getPeriodStatusBadge(period.status)}
                </div>
                {failedCount > 0 && (
                    <div style={{ backgroundColor: '#fef2f2', padding: '24px', borderRadius: 'var(--rounded-xl)', border: '1px solid #fecaca' }}>
                        <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: 600, marginBottom: '8px' }}>Gagal Debit</div>
                        <div className="number-display" style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{failedCount} anggota</div>
                    </div>
                )}
            </div>

            {/* Info Banner for unconfirmed periods */}
            {isNotConfirmed && period.status !== 'proses' && (
                <div style={{ 
                    padding: '16px 20px', borderRadius: '12px', marginBottom: '24px',
                    backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                    display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '13px', color: '#1e40af', lineHeight: 1.6
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <div>
                        <strong>Alur Gagal Debit:</strong> Admin dapat menandai anggota yang gagal debit berdasarkan laporan bank. Setelah semua koreksi selesai, Bendahara mengklik "Konfirmasi Final" untuk memperbarui saldo anggota yang berhasil. Saldo anggota tidak akan berubah sampai Bendahara mengkonfirmasi.
                    </div>
                </div>
            )}

            {/* Detail Table */}
            <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', overflowX: 'auto' }}>
                <h2 className="ds-title-md" style={{ marginBottom: '24px' }}>Rincian per Anggota</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', width: '40px' }}>No.</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Nama Anggota</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>NIP/NIM</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Simpanan</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Cicilan + Jasa</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>Status</th>
                            {isPengurus && isNotConfirmed && (
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>Aksi</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {details.data.map((detail, index) => {
                            const savingTotal = Number(detail.simpanan_wajib_amount || 0) + Number(detail.simpanan_sukarela_amount || 0);
                            const loanTotal = Number(detail.loan_principal_amount || 0) + Number(detail.loan_fee_amount || 0) + Number(detail.admin_fee_amount || 0);
                            const detailTotal = savingTotal + loanTotal;
                            
                            return (
                                <tr key={detail.id} style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: detail.status === 'gagal' ? '#fef2f2' : 'transparent' }}>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{(details.current_page - 1) * details.per_page + index + 1}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{detail.user?.name}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{detail.user?.identity_number}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>Rp {formatRp(savingTotal)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>Rp {formatRp(loanTotal)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Rp {formatRp(detailTotal)}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{getStatusBadge(detail.status)}</td>
                                    {isPengurus && isNotConfirmed && (
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {detail.status !== 'gagal' ? (
                                                <button
                                                    onClick={() => handleMarkFailed(detail)}
                                                    style={{ 
                                                        padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                                                        backgroundColor: '#fee2e2', color: '#dc2626', 
                                                        border: '1px solid #fecaca', borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Tandai Gagal
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleMarkUnfailed(detail)}
                                                    style={{ 
                                                        padding: '4px 10px', fontSize: '11px', fontWeight: 600,
                                                        backgroundColor: '#dbeafe', color: '#2563eb', 
                                                        border: '1px solid #bfdbfe', borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Batalkan Gagal
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {details.data.length === 0 && (
                            <tr>
                                <td colSpan={isPengurus && isNotConfirmed ? 8 : 7} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>
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
