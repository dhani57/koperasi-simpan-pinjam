import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ auth, stats, chartData }) {
    const getDashboardTitle = () => {
        switch(auth.user.role) {
            case 'pengurus': return 'Dasbor Pengurus';
            case 'bendahara': return 'Dasbor Bendahara';
            case 'ketua': return 'Dasbor Ketua';
            case 'pengawas': return 'Dasbor Pengawas';
            default: return 'Dasbor';
        }
    };

    return (
        <AdminLayout auth={auth} title={getDashboardTitle()}>
            <Head title={getDashboardTitle()} />

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
                                    : auth.user.role === 'pengawas'
                                    ? 'Anda memiliki akses independen untuk memantau, melacak, dan meninjau seluruh log mutasi dan riwayat aktivitas koperasi.'
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
                            ) : auth.user.role === 'pengawas' ? (
                                <ButtonPrimary href={route('admin.mutations.index')} style={{ height: '40px', padding: '0 16px', fontSize: '14px' }}>
                                    Lihat Log Mutasi
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
                    
                    {auth.user.role === 'pengurus' && (
                        <>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Anggota Aktif</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px' }}>{stats.total_members}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Menunggu Verifikasi</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px' }}>{stats.pending_verification}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Status Job Queue</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-semantic-up)', marginTop: '8px' }}>{stats.job_queue_status}</div>
                            </div>
                        </>
                    )}

                    {auth.user.role === 'bendahara' && (
                        <>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Simpanan</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(stats.total_savings)}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Pinjaman Outstanding</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(stats.total_active_loans)}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Menunggu Approval</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px' }}>{stats.pending_approval}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Pencairan Bulan Ini</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-semantic-up)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(stats.disbursement_this_month)}</div>
                            </div>
                        </>
                    )}

                    {auth.user.role === 'ketua' && (
                        <>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Aset Koperasi</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(stats.total_assets)}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Pinjaman Outstanding</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(stats.total_active_loans)}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Estimasi SHU</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-semantic-up)', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>Rp {numberFormat(stats.total_shu_expected)}</div>
                            </div>
                        </>
                    )}

                    {auth.user.role === 'pengawas' && (
                        <>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Transaksi (Bulan Ini)</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px' }}>{stats.total_transactions}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Jumlah Potongan Gagal</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-semantic-down)', marginTop: '8px' }}>{stats.failed_deductions}</div>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Belum Direkalkulasi</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px' }}>{stats.pending_recalculation}</div>
                            </div>
                        </>
                    )}

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
