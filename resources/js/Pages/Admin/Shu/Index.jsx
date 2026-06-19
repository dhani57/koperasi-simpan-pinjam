import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth }) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        if (confirm('Anda yakin ingin memicu proses Tutup Buku & Perhitungan SHU tahun ini?\n\nPERINGATAN: Tindakan ini akan menghitung keuntungan, membagikannya ke saldo SHU anggota, dan me-reset persentase. Hanya lakukan ini jika siklus keuangan tahunan telah selesai.')) {
            post(route('admin.shu.store'));
        }
    };

    return (
        <AdminLayout auth={auth} title="Laporan SHU & Tutup Buku">
            <Head title="Laporan SHU" />

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '32px', border: '1px solid var(--color-hairline)', maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
                
                <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    color: '#10b981', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                </div>

                <h2 className="ds-display-base" style={{ marginBottom: '16px' }}>
                    {auth.user.role === 'ketua' ? 'Persetujuan Distribusi SHU' : 'Tutup Buku Tahunan'}
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
                    {auth.user.role === 'ketua' 
                        ? 'Tinjau draf perhitungan Sisa Hasil Usaha (SHU) sebelum didistribusikan ke masing-masing anggota. Persetujuan Anda diperlukan untuk mengesahkan proses ini.'
                        : 'Proses tutup buku akan mengkalkulasi Sisa Hasil Usaha (SHU) berdasarkan total pendapatan jasa pinjaman dan akan didistribusikan ke masing-masing anggota secara proporsional sesuai dengan kontribusi mereka.'
                    }
                </p>

                <div style={{ backgroundColor: 'var(--color-surface-soft)', padding: '16px', borderRadius: 'var(--rounded-md)', textAlign: 'left', marginBottom: '32px' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Apa yang akan terjadi?</h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--color-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {auth.user.role === 'ketua' ? (
                            <>
                                <li>Status draf perhitungan SHU akan diubah menjadi disetujui.</li>
                                <li>Dana akan langsung dialokasikan ke saldo masing-masing anggota.</li>
                                <li>Laporan tahun berjalan resmi ditutup.</li>
                            </>
                        ) : (
                            <>
                                <li>Sistem akan menghitung total keuntungan dari bunga pinjaman tahun berjalan.</li>
                                <li>Draf laporan akan dibuat dan menunggu persetujuan Ketua.</li>
                                <li>Setelah disetujui, dana akan dialokasikan ke Saldo SHU anggota.</li>
                            </>
                        )}
                    </ul>
                </div>

                {auth.user.role === 'ketua' ? (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (confirm('Anda yakin ingin menyetujui distribusi SHU ini? Tindakan ini tidak dapat dibatalkan.')) {
                            post(route('admin.shu.approve'));
                        }
                    }}>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="ds-button-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '16px', backgroundColor: '#10b981' }}
                        >
                            {processing ? 'Memproses...' : 'Setujui Distribusi SHU'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={submit}>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="ds-button-primary"
                            style={{ width: '100%', padding: '16px', fontSize: '16px', backgroundColor: 'var(--color-semantic-down)' }}
                        >
                            {processing ? 'Memproses...' : 'Buat Draf Perhitungan SHU'}
                        </button>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
