import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, mutations, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const debounceTimer = setTimeout(() => {
            router.get(
                route('admin.mutations.index'),
                { search },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search]);

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <AdminLayout auth={auth} title="Log Mutasi (Audit Trail)">
            <Head title="Log Mutasi" />

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '32px', border: '1px solid var(--color-hairline)' }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="ds-title-md">Histori Mutasi Sistem</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>
                            Pelacakan seluruh riwayat transaksi dan perubahan saldo anggota untuk kebutuhan audit.
                        </p>
                    </div>
                    
                    <div className="w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Cari transaksi..."
                            className="ds-text-input text-sm w-full"
                            style={{ minHeight: '40px', width: '250px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-hairline)' }}>
                            <tr>
                                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Waktu</th>
                                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Anggota</th>
                                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Tipe</th>
                                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Nominal</th>
                                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Saldo Akhir</th>
                                <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mutations.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada log mutasi.</td>
                                </tr>
                            ) : (
                                mutations.data.map(mutation => (
                                    <tr key={mutation.id} style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-muted)' }}>{formatDateTime(mutation.created_at)}</td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500 }}>{mutation.user?.name || 'Sistem'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                fontSize: '11px', 
                                                fontWeight: 600,
                                                backgroundColor: mutation.type === 'credit' ? '#dcfce7' : '#fee2e2',
                                                color: mutation.type === 'credit' ? '#166534' : '#991b1b'
                                            }}>
                                                {mutation.type === 'credit' ? 'KREDIT' : 'DEBIT'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontFamily: 'var(--font-mono)', color: mutation.type === 'credit' ? '#166534' : '#991b1b', fontWeight: 500 }}>
                                            {mutation.type === 'credit' ? '+' : '-'} Rp {formatRp(mutation.amount)}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                                            Rp {formatRp(mutation.balance_after)}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-body)' }}>{mutation.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination links={mutations.links} />
            </div>
        </AdminLayout>
    );
}
