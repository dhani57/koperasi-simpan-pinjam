import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth }) {
    return (
        <AdminLayout auth={auth} title="Verifikasi Pinjaman">
            <Head title="Verifikasi Pinjaman" />

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '32px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <p style={{ color: 'var(--color-muted)' }}>Belum ada pengajuan pinjaman yang perlu diverifikasi.</p>
            </div>
        </AdminLayout>
    );
}
