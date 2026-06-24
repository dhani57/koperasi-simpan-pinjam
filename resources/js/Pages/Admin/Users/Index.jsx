import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, users, filters }) {
    const { delete: destroy } = useForm();
    const [search, setSearch] = useState(filters?.search || '');
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const debounceTimer = setTimeout(() => {
            router.get(
                route('admin.users.index'),
                { search },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search]);

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus anggota ini? Data finansial mungkin terpengaruh.')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth} title="Manajemen Anggota">
            <Head title="Manajemen Anggota" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Cari NIP/NIM, nama, email..."
                    className="ds-text-input text-sm w-full md:w-64"
                    style={{ minHeight: '40px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                
                {auth.user.role !== 'pengawas' && (
                    <ButtonPrimary href={route('admin.users.create')} className="w-full md:w-auto text-center justify-center">
                        + Tambah Anggota Baru
                    </ButtonPrimary>
                )}
            </div>

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', overflow: 'hidden' }}>
                <div className="overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead style={{ backgroundColor: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-hairline)' }}>
                        <tr>
                            <th className="ds-body-sm" style={{ padding: '16px', color: 'var(--color-muted)', fontWeight: 600 }}>NIP/NIM</th>
                            <th className="ds-body-sm" style={{ padding: '16px', color: 'var(--color-muted)', fontWeight: 600 }}>Nama & Email</th>
                            <th className="ds-body-sm" style={{ padding: '16px', color: 'var(--color-muted)', fontWeight: 600 }}>Peran</th>
                            <th className="ds-body-sm" style={{ padding: '16px', color: 'var(--color-muted)', fontWeight: 600 }}>Limit Potongan</th>
                            {auth.user.role !== 'pengawas' && (
                                <th className="ds-body-sm" style={{ padding: '16px', color: 'var(--color-muted)', fontWeight: 600 }}>Aksi</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--color-hairline-soft)' }}>
                                <td style={{ padding: '16px', fontFamily: 'var(--font-mono)' }}>{user.identity_number}</td>
                                <td style={{ padding: '16px' }}>
                                    <div className="font-medium text-slate-900">{user.name}</div>
                                    <div className="text-sm text-slate-500">{user.email}</div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <div className="flex gap-2">
                                        {(user.roles_array || [user.role]).map((r, idx) => (
                                            <span key={idx} className="ds-badge-pill" style={{ 
                                                backgroundColor: r === 'pengurus' ? '#DBEAFE' : 'var(--color-surface-strong)',
                                                color: r === 'pengurus' ? '#1E40AF' : 'var(--color-muted)'
                                            }}>
                                                {r.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '16px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(user.max_salary_deduction_limit)}</td>
                                {auth.user.role !== 'pengawas' && (
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link href={route('admin.users.edit', user.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-muted)' }}>Belum ada data anggota.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>

                {/* Pagination */}
                <Pagination links={users.links} />
        </AdminLayout>
    );
}

function numberFormat(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}
