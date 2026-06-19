import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';

export default function Index({ auth, users }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus anggota ini? Data finansial mungkin terpengaruh.')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth} title="Manajemen Anggota">
            <Head title="Manajemen Anggota" />

            {auth.user.role !== 'pengawas' && (
                <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'flex-end' }}>
                    <ButtonPrimary href={route('admin.users.create')}>
                        + Tambah Anggota Baru
                    </ButtonPrimary>
                </div>
            )}

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', border: '1px solid var(--color-hairline)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                                    <span className="ds-badge-pill" style={{ 
                                        backgroundColor: user.role === 'pengurus' ? '#DBEAFE' : 'var(--color-surface-strong)',
                                        color: user.role === 'pengurus' ? '#1E40AF' : 'var(--color-muted)'
                                    }}>
                                        {user.role.toUpperCase()}
                                    </span>
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

            {/* Pagination placeholder */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {users.links.map((link, index) => (
                    link.url ? (
                        <Link key={index} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`px-3 py-1 rounded-md text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} />
                    ) : (
                        <span key={index} dangerouslySetInnerHTML={{ __html: link.label }} className="px-3 py-1 rounded-md text-sm bg-slate-50 text-slate-400" />
                    )
                ))}
            </div>
        </AdminLayout>
    );
}

function numberFormat(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}
