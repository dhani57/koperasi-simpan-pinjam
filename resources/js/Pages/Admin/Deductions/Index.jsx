import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth, periods }) {
    const { data, setData, post, processing, errors } = useForm({
        period_date: new Date().toISOString().slice(0, 7) + '-01', // Default to current month, first day
    });

    const formatMonth = (dateString) => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long' }).format(new Date(dateString));
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const submit = (e) => {
        e.preventDefault();
        if (confirm(`Anda yakin ingin memicu tagihan potongan massal untuk bulan ${formatMonth(data.period_date)}?\nProses ini akan membaca data semua simpanan dan pinjaman anggota aktif.`)) {
            post(route('admin.deductions.store'));
        }
    };

    return (
        <AdminLayout auth={auth} title="Potongan Bulanan (Tagihan)">
            <Head title="Potongan Bulanan" />

            <div style={{ display: 'grid', gridTemplateColumns: auth.user.role === 'pengawas' ? '1fr' : '1fr 2fr', gap: '24px' }}>
                {/* Generate Form */}
                {auth.user.role !== 'pengawas' && (
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', alignSelf: 'start' }}>
                        <h2 className="ds-title-md" style={{ marginBottom: '8px' }}>Buat Tagihan Baru</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '13px', marginBottom: '24px' }}>
                            Generate tagihan potongan simpanan rutin dan angsuran pinjaman untuk diserahkan ke bagian Payroll.
                        </p>

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Pilih Bulan & Tahun</label>
                                <input 
                                    type="month" 
                                    value={data.period_date.slice(0, 7)}
                                    onChange={e => setData('period_date', e.target.value + '-01')}
                                    required
                                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-hairline)', borderRadius: 'var(--rounded-md)' }}
                                />
                                {errors.period_date && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginTop: '4px' }}>{errors.period_date}</div>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="ds-button-primary"
                                style={{ width: '100%', padding: '12px' }}
                            >
                                {processing ? 'Memproses...' : 'Generate Tagihan'}
                            </button>
                        </form>
                    </div>
                )}

                {/* List of Periods */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)' }}>
                    <h2 className="ds-title-md" style={{ marginBottom: '24px' }}>Riwayat Potongan Bulanan</h2>

                    {periods.data.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-lg)' }}>
                            <p style={{ color: 'var(--color-muted)' }}>Belum ada riwayat potongan bulanan.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Periode</th>
                                    <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Status</th>
                                    <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'center', width: '200px' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periods.data.map(period => (
                                    <tr key={period.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{formatMonth(`${period.year}-${String(period.month).padStart(2, '0')}-01`)}</td>
                                        <td style={{ padding: '12px', fontSize: '14px' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                fontSize: '12px', 
                                                fontWeight: 600,
                                                backgroundColor: period.status === 'selesai' ? '#dcfce7' : '#fef3c7',
                                                color: period.status === 'selesai' ? '#166534' : '#92400e'
                                            }}>
                                                {period.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                {period.status === 'proses' && auth.user.role === 'bendahara' && (
                                                    <button 
                                                        onClick={() => {
                                                            if(confirm('Anda yakin tagihan ini sudah selesai dipotong oleh HRD? Status tidak dapat dikembalikan lagi.')) {
                                                                router.patch(route('admin.deductions.selesai', period.id));
                                                            }
                                                        }}
                                                        style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: 'var(--color-semantic-up)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                                                    >
                                                        Tandai Selesai
                                                    </button>
                                                )}
                                                <Link 
                                                    href={route('admin.deductions.show', period.id)}
                                                    className="ds-button-primary"
                                                    style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
