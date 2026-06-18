import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';

export default function Dashboard({ auth, stats }) {
    return (
        <AdminLayout auth={auth} title="Dasbor Pengurus">
            <Head title="Admin Dashboard" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--spacing-lg)' }}>
                
                {/* Hero Welcome Card (Spans 8 columns on large screens) */}
                <div style={{ gridColumn: 'span 12', '@media (min-width: 1024px)': { gridColumn: 'span 8' } }} className="lg:col-span-8 col-span-12">
                    <div style={{ 
                        backgroundColor: 'var(--color-canvas)', 
                        borderRadius: 'var(--rounded-xl)', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%'
                    }}>
                        <div style={{ padding: '32px', flex: 1, zIndex: 10 }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '12px' }}>
                                Selamat Datang Kembali, {auth.user.name.split(' ')[0]}! 🎉
                            </h2>
                            <p style={{ color: 'var(--color-body)', marginBottom: '24px', maxWidth: '400px', lineHeight: 1.5 }}>
                                Anda memiliki wewenang penuh untuk mengelola anggota, melihat pergerakan dana, dan mengatur parameter koperasi hari ini.
                            </p>
                            <ButtonPrimary href={route('admin.users.index')} style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}>
                                Kelola Anggota
                            </ButtonPrimary>
                        </div>
                        {/* Hero Illustration */}
                        <div style={{ position: 'absolute', right: 0, bottom: 0, height: '120%', width: '35%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none' }}>
                            <img src="/images/admin_welcome_hero.png" alt="Admin Illustration" style={{ height: '90%', objectFit: 'contain', transform: 'translateY(10%)' }} />
                        </div>
                    </div>
                </div>

                {/* Metric Grid (Spans 4 columns) */}
                <div className="lg:col-span-4 col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                    
                    {/* Metric 1 */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(11, 94, 168, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Anggota</div>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '4px' }}>{stats.total_members}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-semantic-up)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                <span>Aktif</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(5, 177, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-semantic-up)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Dana Tersimpan</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(stats.total_savings)}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-semantic-up)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                <span>Total Kumulatif</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}

function numberFormat(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    }
    return new Intl.NumberFormat('id-ID').format(number);
}
