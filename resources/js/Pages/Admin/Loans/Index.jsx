import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, loans, filters }) {
    const isBendahara = auth.user.role === 'bendahara';
    const isKetua = auth.user.role === 'ketua';
    const isPengurus = auth.user.role === 'pengurus';

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);
    const formatDate = (dateString) => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));

    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const debounceTimer = setTimeout(() => {
            router.get(
                route('admin.loans.index'),
                { search, status },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search, status]);

    return (
        <AdminLayout auth={auth} title={isPengurus ? "Verifikasi Pinjaman" : "Persetujuan Pinjaman"}>
            <Head title={isPengurus ? "Verifikasi Pinjaman" : "Persetujuan Pinjaman"} />

            <div className="bg-white rounded-xl p-4 md:p-8 border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h2 className="ds-title-md m-0">Daftar Pengajuan Pinjaman</h2>
                    
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Cari anggota..."
                            className="ds-text-input text-sm"
                            style={{ minHeight: '40px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="ds-text-input text-sm bg-white"
                            style={{ minHeight: '40px' }}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="diajukan">Diajukan</option>
                            <option value="menunggu_ketua">Menunggu Ketua</option>
                            <option value="menunggu_bendahara">Menunggu Bendahara</option>
                            <option value="disetujui">Disetujui</option>
                            <option value="aktif">Aktif (Berjalan)</option>
                            <option value="lunas">Lunas</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                    </div>
                </div>

                {loans.data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--color-surface-soft)', borderRadius: 'var(--rounded-lg)' }}>
                        <p style={{ color: 'var(--color-muted)' }}>Belum ada data pinjaman.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Tanggal</th>
                                    <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Anggota</th>
                                    <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Plafon</th>
                                    <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Tenor</th>
                                    <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Status</th>
                                    <th style={{ padding: '12px 16px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.data.map(loan => (
                                    <tr key={loan.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                        <td style={{ padding: '16px', fontSize: '14px' }}>{formatDate(loan.created_at)}</td>
                                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>
                                            {loan.user?.name}
                                            {loan.purpose && (
                                                <div style={{ fontSize: '12px', color: 'var(--color-muted)', fontWeight: 400, marginTop: '4px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={loan.purpose}>
                                                    Ket: {loan.purpose}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>Rp {formatRp(loan.principal_amount)}</td>
                                        <td style={{ padding: '16px', fontSize: '14px' }}>{loan.tenor_months} bln</td>
                                        <td style={{ padding: '16px', fontSize: '14px' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                fontSize: '12px', 
                                                fontWeight: 600,
                                                backgroundColor: loan.status === 'aktif' ? '#dcfce7' : (['diajukan', 'menunggu_ketua', 'menunggu_bendahara'].includes(loan.status) ? '#fef3c7' : (loan.status === 'disetujui' ? '#e0e7ff' : '#f1f5f9')),
                                                color: loan.status === 'aktif' ? '#166534' : (['diajukan', 'menunggu_ketua', 'menunggu_bendahara'].includes(loan.status) ? '#92400e' : (loan.status === 'disetujui' ? '#3730a3' : '#475569'))
                                            }}>
                                                {loan.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                                                {/* Detail Button for Bendahara and Ketua */}
                                                {(isBendahara || isKetua) && (
                                                    <a href={route('admin.loans.show', loan.id)} className="ds-button-secondary" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none', color: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
                                                        Detail
                                                    </a>
                                                )}

                                                {/* Admin Actions */}
                                                {isPengurus && loan.status === 'diajukan' && (
                                                    <>
                                                        <form method="post" action={route('admin.loans.verify', loan.id)} style={{ display: 'inline' }} onSubmit={(e) => { if(!confirm('Anda yakin ingin memverifikasi pengajuan ini?')) e.preventDefault(); }}>
                                                            <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                                            <button type="submit" className="ds-button-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Verifikasi</button>
                                                        </form>
                                                        <form method="post" action={route('admin.loans.reject', loan.id)} style={{ display: 'inline' }} onSubmit={(e) => { if(!confirm('Anda yakin ingin menolak pengajuan ini?')) e.preventDefault(); }}>
                                                            <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                                            <button type="submit" className="ds-button-primary" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none' }}>Tolak</button>
                                                        </form>
                                                    </>
                                                )}

                                                {/* Bendahara / Ketua Actions */}
                                                {(
                                                    (isBendahara && ['diajukan', 'menunggu_bendahara'].includes(loan.status)) ||
                                                    (isKetua && ['diajukan', 'menunggu_ketua'].includes(loan.status))
                                                ) && (
                                                    <>
                                                        <form method="post" action={route('admin.loans.approve', loan.id)} style={{ display: 'inline' }} onSubmit={(e) => { if(!confirm('Anda yakin ingin menyetujui pengajuan ini?')) e.preventDefault(); }}>
                                                            <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                                            <button type="submit" className="ds-button-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Setujui</button>
                                                        </form>
                                                        <form method="post" action={route('admin.loans.reject', loan.id)} style={{ display: 'inline' }} onSubmit={(e) => { if(!confirm('Anda yakin ingin menolak pengajuan ini?')) e.preventDefault(); }}>
                                                            <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                                            <button type="submit" className="ds-button-primary" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none' }}>Tolak</button>
                                                        </form>
                                                    </>
                                                )}

                                                {/* Text indication for the one who already approved */}
                                                {isBendahara && loan.status === 'menunggu_ketua' && (
                                                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic', padding: '6px 0' }}>Menunggu Ketua...</span>
                                                )}
                                                {isKetua && loan.status === 'menunggu_bendahara' && (
                                                    <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontStyle: 'italic', padding: '6px 0' }}>Menunggu Bendahara...</span>
                                                )}

                                                {isBendahara && loan.status === 'disetujui' && (
                                                    <form method="post" action={route('admin.loans.disburse', loan.id)} style={{ display: 'inline' }} onSubmit={(e) => { if(!confirm('Anda yakin ingin mencairkan dana ini? Pastikan Anda telah mentransfer dana ke rekening anggota di luar sistem.')) e.preventDefault(); }}>
                                                        <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                                        <button type="submit" className="ds-button-primary" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10b981', color: 'white' }}>Dana Terkirim</button>
                                                    </form>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <Pagination links={loans.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
