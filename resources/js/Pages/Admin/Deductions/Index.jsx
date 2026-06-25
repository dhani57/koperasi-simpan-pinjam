import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth, periods, inactiveMonths = [] }) {
    const monthsList = [
        { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' }, { value: '04', label: 'April' },
        { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' }, { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
    ];
    const activeMonths = monthsList.filter(m => !inactiveMonths.includes(parseInt(m.value, 10)));
    
    const currentYear = new Date().getFullYear();
    
    const { data, setData, post, processing, errors, transform } = useForm({
        selectedMonth: activeMonths.length > 0 ? activeMonths[0].value : '01',
        selectedYear: currentYear.toString(),
    });

    transform((data) => ({
        ...data,
        period_date: `${data.selectedYear}-${data.selectedMonth}-01`,
    }));

    const formatMonth = (dateString) => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long' }).format(new Date(dateString));
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const submit = (e) => {
        e.preventDefault();
        const periodStr = `${data.selectedYear}-${data.selectedMonth}-01`;
        if (confirm(`Yakin mau buat tagihan potongan bulan ${formatMonth(periodStr)}?\nProses ini akan membaca data semua simpanan dan pinjaman anggota aktif.`)) {
            post(route('admin.deductions.store'));
        }
    };

    return (
        <AdminLayout auth={auth} title="Iuran & Tagihan Bulanan">
            <Head title="Tagihan Bulanan" />

            <div className={`grid gap-6 ${auth.user.role === 'pengawas' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
                {/* Generate Form */}
                {auth.user.role !== 'pengawas' && (
                    <div className="lg:col-span-1" style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', alignSelf: 'start' }}>
                        <h2 className="ds-title-md" style={{ marginBottom: '8px' }}>Buat Tagihan Baru</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '13px', marginBottom: '24px' }}>
                            Buat tagihan iuran simpanan rutin dan angsuran pinjaman bulanan untuk diserahkan ke bagian Penggajian.
                        </p>

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Bulan</label>
                                    <select 
                                        value={data.selectedMonth}
                                        onChange={e => setData('selectedMonth', e.target.value)}
                                        required
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-hairline)', borderRadius: 'var(--rounded-md)', backgroundColor: 'white' }}
                                    >
                                        {activeMonths.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Tahun</label>
                                    <input 
                                        type="number" 
                                        value={data.selectedYear}
                                        onChange={e => setData('selectedYear', e.target.value)}
                                        required
                                        min={2020}
                                        max={2100}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--color-hairline)', borderRadius: 'var(--rounded-md)' }}
                                    />
                                </div>
                            </div>
                            {errors.period_date && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginBottom: '16px' }}>{errors.period_date}</div>}

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="ds-button-primary"
                                style={{ width: '100%', padding: '12px' }}
                            >
                                {processing ? 'Memproses...' : 'Buat Tagihan'}
                            </button>
                        </form>
                    </div>
                )}

                {/* List of Periods */}
                <div className={auth.user.role === 'pengawas' ? '' : 'lg:col-span-2'} style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)' }}>
                    <h2 className="ds-title-md" style={{ marginBottom: '24px' }}>Riwayat Potongan Bulanan</h2>

                    {periods.data.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-lg)' }}>
                            <p style={{ color: 'var(--color-muted)' }}>Belum ada riwayat potongan bulanan.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
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
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
