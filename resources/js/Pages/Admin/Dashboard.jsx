import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ auth, stats, chartData }) {
    return (
        <AdminLayout auth={auth} title="Dasbor Pengurus">
            <Head title="Admin Dashboard" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--spacing-lg)' }}>
                
                {/* Hero Welcome Card (Spans 12 columns) */}
                <div className="col-span-12">
                    <div style={{ 
                        backgroundColor: 'var(--color-canvas)', 
                        borderRadius: 'var(--rounded-xl)', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        display: 'flex',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: '220px'
                    }}>
                        <div style={{ padding: '32px', flex: 1, zIndex: 10 }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '12px' }}>
                                Selamat Datang Kembali, {auth.user.name.split(' ')[0]}! 🎉
                            </h2>
                            <p style={{ color: 'var(--color-body)', marginBottom: '24px', maxWidth: '500px', lineHeight: 1.5 }}>
                                {auth.user.role === 'bendahara' 
                                    ? 'Anda memiliki wewenang untuk menyetujui pengajuan pinjaman anggota, melakukan pencairan, dan mengelola tagihan potongan bulanan.' 
                                    : auth.user.role === 'ketua'
                                    ? 'Anda memiliki wewenang eksekutif untuk memantau ringkasan finansial, menyetujui pengajuan pinjaman anggota, dan memvalidasi laporan distribusi SHU.'
                                    : 'Anda memiliki wewenang penuh untuk mengelola anggota, melihat pergerakan dana, dan mengatur parameter koperasi hari ini.'
                                }
                            </p>
                            
                            {auth.user.role === 'bendahara' ? (
                                <ButtonPrimary href={route('admin.loans.index')} style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}>
                                    Lihat Pinjaman
                                </ButtonPrimary>
                            ) : auth.user.role === 'ketua' ? (
                                <ButtonPrimary href={route('admin.shu.index')} style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}>
                                    Laporan SHU
                                </ButtonPrimary>
                            ) : (
                                <ButtonPrimary href={route('admin.users.index')} style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}>
                                    Kelola Anggota
                                </ButtonPrimary>
                            )}
                        </div>
                        {/* Hero Illustration */}
                        <div className="hidden md:flex" style={{ position: 'absolute', right: 0, bottom: 0, height: '120%', width: '30%', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none' }}>
                            <img src="/images/admin_welcome_hero.png" alt="Admin Illustration" style={{ height: '100%', objectFit: 'contain', transform: 'translateY(10%)' }} />
                        </div>
                    </div>
                </div>

                {/* Metric Grid (Spans 12 columns, 4 cards side-by-side) */}
                <div className="col-span-12" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    
                    {/* Metric 1: Total Anggota */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(11, 94, 168, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Anggota</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '4px' }}>{stats.total_members}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-semantic-up)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                                <span>Aktif</span>
                            </div>
                        </div>
                    </div>

                    {/* Metric 2: Dana Tersimpan */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(5, 177, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-semantic-up)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Dana Tersimpan</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(stats.total_savings)}</div>
                        </div>
                    </div>

                    {/* Metric 3: Pinjaman Aktif */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(235, 168, 52, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eba834' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Pinjaman Aktif</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(stats.total_active_loans)}</div>
                        </div>
                    </div>

                    {/* Metric 4: Potensi Jasa */}
                    <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(156, 39, 176, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9c27b0' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Potensi Jasa</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(stats.total_expected_interest)}</div>
                        </div>
                    </div>

                </div>

                {/* Chart Area (Spans 12 columns) */}
                <div className="col-span-12" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '32px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginTop: 'var(--spacing-md)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-ink)' }}>Tren Aliran Kas (Simulasi)</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginTop: '4px' }}>Perbandingan akumulasi Simpanan masuk dan Pinjaman keluar selama 6 bulan terakhir.</p>
                    </div>
                    
                    <div style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#888', fontSize: 12}} 
                                    tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}M`}
                                />
                                <Tooltip 
                                    formatter={(value) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="Simpanan" stroke="var(--color-semantic-up)" strokeWidth={3} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="Pinjaman" stroke="var(--color-primary)" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}

function numberFormat(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + 'M';
    }
    return new Intl.NumberFormat('id-ID').format(number);
}
