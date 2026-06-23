import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ auth, stats, roleData }) {
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Hero Welcome Card (Spans 12 columns) */}
                <div className="col-span-1 lg:col-span-12">
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
                        {/* Decorative Background Elements */}
                        <div className="hidden md:block" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', pointerEvents: 'none', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '350px', height: '350px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 100%)', opacity: 0.08 }}></div>
                            <div style={{ position: 'absolute', right: '20%', bottom: '-15%', width: '200px', height: '200px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 100%)', opacity: 0.06 }}></div>
                        </div>
                    </div>
                </div>

                {/* Metric Grid (Spans 12 columns, 4 cards side-by-side) */}
                <div className="col-span-1 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {auth.user.role === 'pengurus' && (
                        <>
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '14px', color: 'var(--color-muted)', fontWeight: 500 }}>Total Anggota Aktif</div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ink)', marginTop: '8px' }}>{stats.total_members}</div>
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

                {/* Role Specific Areas */}
                
                {/* 1. Pengurus */}
                {auth.user.role === 'pengurus' && (
                    <>
                        <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Pertumbuhan Anggota</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={roleData.member_growth}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Line type="monotone" dataKey="Anggota_Baru" stroke="var(--color-primary)" strokeWidth={3} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Distribusi Limit Potongan</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={roleData.limit_distribution}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Bar dataKey="Jumlah" fill="var(--color-accent-teal)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-12 flex flex-col lg:flex-row gap-6 mt-4">
                            <div className="flex-1" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Parameter Sistem</h3>
                                {Object.entries(roleData.system_parameters || {}).map(([key, value]) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <span style={{ color: 'var(--color-muted)' }}>{key}</span>
                                        <span style={{ fontWeight: 600 }}>{value}</span>
                                    </div>
                                ))}
                            </div>
                            {roleData.alerts && roleData.alerts.length > 0 && (
                                <div className="flex-1" style={{ backgroundColor: 'rgba(235, 168, 52, 0.1)', border: '1px solid #eba834', borderRadius: 'var(--rounded-xl)', padding: '24px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#b87e14', marginBottom: '16px' }}>Peringatan (Alert)</h3>
                                    {roleData.alerts.map((alert, idx) => (
                                        <div key={idx} style={{ fontSize: '13px', color: '#b87e14', marginBottom: '8px' }}>• {alert.message}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* 2. Bendahara */}
                {auth.user.role === 'bendahara' && (
                    <>
                        <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Arus Kas (Cash Flow)</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={roleData.cash_flow}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}jt`} />
                                            <Tooltip formatter={(value) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`} />
                                            <Legend />
                                            <Line type="monotone" dataKey="Masuk" stroke="var(--color-semantic-up)" strokeWidth={3} />
                                            <Line type="monotone" dataKey="Keluar" stroke="var(--color-semantic-down)" strokeWidth={3} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Komposisi Pinjaman</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={roleData.loan_composition} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {roleData.loan_composition?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['var(--color-semantic-up)', 'var(--color-primary)', 'var(--color-accent-yellow)'][index % 3]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-8" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginTop: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)' }}>Antrian Approval Bendahara</h3>
                            </div>
                            {roleData.approval_queue && roleData.approval_queue.length > 0 ? (
                                <div className="overflow-x-auto w-full">
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '400px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Anggota</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Nominal</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleData.approval_queue.map((loan, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                                <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 500 }}>{loan.user?.name}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(loan.principal_amount)}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px' }}>
                                                    <Link href={route('admin.loans.index')} style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600 }}>Proses</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '14px' }}>Tidak ada antrian persetujuan.</div>
                            )}
                        </div>

                        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 mt-4">
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Aksi Cepat</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Link href={route('admin.deductions.index')} style={{ display: 'block', padding: '12px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-ink)', textAlign: 'center' }}>Proses Potongan Bulanan</Link>
                                    <Link href={route('admin.shu.index')} style={{ display: 'block', padding: '12px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--color-ink)', textAlign: 'center' }}>Hitung SHU Tahunan</Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* 3. Ketua */}
                {auth.user.role === 'ketua' && (
                    <>
                        <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Tren Dana Koperasi</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={roleData.asset_trend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}M`} />
                                            <Tooltip formatter={(value) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`} />
                                            <Line type="monotone" dataKey="Aset" stroke="var(--color-primary)" strokeWidth={3} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Simpanan vs Pinjaman</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={roleData.savings_vs_loans}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(val) => `Rp${(val/1000000).toFixed(0)}M`} />
                                            <Tooltip formatter={(value) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`} />
                                            <Legend />
                                            <Bar dataKey="Simpanan" fill="var(--color-semantic-up)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Pinjaman" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-8" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginTop: 'var(--spacing-md)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Approval Tingkat Eksekutif</h3>
                            {roleData.executive_approvals && roleData.executive_approvals.length > 0 ? (
                                <div className="overflow-x-auto w-full">
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '400px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Anggota / Keterangan</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Nominal</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleData.executive_approvals.map((item, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                                <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 500 }}>{item.user?.name || 'Sistem'}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(item.principal_amount || 0)}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{item.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '14px' }}>Tidak ada antrian persetujuan eksekutif.</div>
                            )}
                        </div>

                        <div className="col-span-1 lg:col-span-4" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginTop: 'var(--spacing-md)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Top Anggota (Simpanan)</h3>
                            {roleData.top_members?.map((member, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{member.name.split(' ')[0]}</span>
                                    <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>Rp{numberFormat(member.total_saving_balance)}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* 4. Pengawas */}
                {auth.user.role === 'pengawas' && (
                    <>
                        <div className="col-span-1 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '16px' }}>Tren Transaksi (Berhasil vs Gagal)</h3>
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={roleData.transaction_trend}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Berhasil" fill="var(--color-semantic-up)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Gagal" fill="var(--color-semantic-down)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)' }}>Riwayat Jasa Tahunan</h3>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                                <th style={{ padding: '8px 4px', fontSize: '12px', color: 'var(--color-muted)', fontWeight: 500 }}>Pinjaman</th>
                                                <th style={{ padding: '8px 4px', fontSize: '12px', color: 'var(--color-muted)', fontWeight: 500 }}>Tahun Ke</th>
                                                <th style={{ padding: '8px 4px', fontSize: '12px', color: 'var(--color-muted)', fontWeight: 500 }}>Pokok Sisa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roleData.annual_services?.map((svc, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                                    <td style={{ padding: '8px 4px', fontSize: '13px' }}>{svc.loan?.user?.name}</td>
                                                    <td style={{ padding: '8px 4px', fontSize: '13px' }}>{svc.year_number}</td>
                                                    <td style={{ padding: '8px 4px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(svc.remaining_principal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-12" style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', marginTop: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)' }}>Log Mutasi Terbaru</h3>
                                <Link href={route('admin.mutations.index')} style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>Lihat Semua Data</Link>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '400px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Tanggal</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Anggota</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Tipe</th>
                                            <th style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--color-muted)', fontWeight: 500 }}>Nominal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roleData.mutation_logs?.map((log, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{new Date(log.created_at).toLocaleDateString('id-ID')}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px', fontWeight: 500 }}>{log.user?.name}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px' }}>{log.type}</td>
                                                <td style={{ padding: '12px 8px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>Rp{numberFormat(Math.abs(log.amount))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </AdminLayout>
    );
}

function numberFormat(number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + 'jt';
    }
    return new Intl.NumberFormat('id-ID').format(number);
}
