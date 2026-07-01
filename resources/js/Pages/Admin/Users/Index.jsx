import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import Pagination from '@/Components/Pagination';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ auth, users, filters }) {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });
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

    const [confirmConfig, setConfirmConfig] = useState({
        show: false,
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Hapus',
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

    const handleDelete = (id) => {
        openConfirm(
            'Hapus Anggota',
            'Yakin ingin menghapus anggota ini? Data finansial mungkin terpengaruh.',
            'danger',
            'Hapus',
            () => destroy(route('admin.users.destroy', id))
        );
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('file', file);
        }
    };

    const handleImport = (e) => {
        e.preventDefault();
        post(route('admin.users.import'), {
            onSuccess: () => {
                alert('Import berhasil');
                setData('file', null);
            },
            onError: (err) => {
                alert('Gagal import: ' + JSON.stringify(err));
            }
        });
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
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <a href={route('admin.users.template')} className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-50 flex items-center justify-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            Unduh Template
                        </a>
                        <form onSubmit={handleImport} className="flex gap-2">
                            <input 
                                type="file" 
                                accept=".xlsx,.xls" 
                                onChange={handleFileChange} 
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {data.file && (
                                <button type="submit" disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
                                    {processing ? 'Loading...' : 'Upload'}
                                </button>
                            )}
                        </form>
                        <ButtonPrimary href={route('admin.users.create')} className="w-full md:w-auto text-center justify-center">
                            + Tambah Anggota
                        </ButtonPrimary>
                    </div>
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
                            <th className="ds-body-sm" style={{ padding: '16px', color: 'var(--color-muted)', fontWeight: 600 }}>Batas Potongan</th>
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

            <Pagination links={users.links} />

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

function numberFormat(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}
