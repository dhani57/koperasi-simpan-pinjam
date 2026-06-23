import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ auth, loan, limitInfo }) {
    const isBendahara = auth.user.role === 'bendahara';
    const isKetua = auth.user.role === 'ketua';
    const isPengurus = auth.user.role === 'pengurus';

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);
    const formatDate = (dateString) => new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));

    return (
        <AdminLayout auth={auth} title="Detail Pengajuan Pinjaman">
            <Head title="Detail Pinjaman" />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="ds-title-md">Detail Pinjaman</h2>
                    <Link href={route('admin.loans.index')} className="ds-button-secondary" style={{ textDecoration: 'none' }}>
                        Kembali
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left Column: Loan Details */}
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '32px', border: '1px solid var(--color-hairline)' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-hairline)' }}>Informasi Pinjaman</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '4px' }}>Tanggal Pengajuan</div>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>{formatDate(loan.created_at)}</div>
                            </div>
                            
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '4px' }}>Nama Anggota</div>
                                <div style={{ fontSize: '15px', fontWeight: 600 }}>{loan.user?.name}</div>
                            </div>

                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '4px' }}>Nominal Pinjaman (Plafon)</div>
                                <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary)' }}>Rp {formatRp(loan.principal_amount)}</div>
                            </div>

                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '4px' }}>Tenor</div>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>{loan.tenor_months} Bulan</div>
                            </div>

                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '4px' }}>Status Saat Ini</div>
                                <div>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '12px', 
                                        fontWeight: 600,
                                        backgroundColor: loan.status === 'aktif' ? '#dcfce7' : (['diajukan', 'diverifikasi', 'menunggu_ketua', 'menunggu_bendahara'].includes(loan.status) ? '#fef3c7' : (loan.status === 'disetujui' ? '#e0e7ff' : '#f1f5f9')),
                                        color: loan.status === 'aktif' ? '#166534' : (['diajukan', 'diverifikasi', 'menunggu_ketua', 'menunggu_bendahara'].includes(loan.status) ? '#92400e' : (loan.status === 'disetujui' ? '#3730a3' : '#475569'))
                                    }}>
                                        {loan.status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '4px' }}>Keterangan / Keperluan</div>
                                <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '12px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '8px', fontStyle: loan.purpose ? 'normal' : 'italic', color: loan.purpose ? 'var(--color-ink)' : 'var(--color-muted)' }}>
                                    {loan.purpose || 'Tidak ada keterangan tambahan yang dilampirkan.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Limit & Approvals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Approval Actions */}
                        <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '32px', border: '1px solid var(--color-hairline)' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-hairline)' }}>Aksi Persetujuan</h3>
                            
                            {(
                                (isBendahara && ['diajukan', 'diverifikasi', 'menunggu_bendahara'].includes(loan.status)) ||
                                (isKetua && ['diajukan', 'diverifikasi', 'menunggu_ketua'].includes(loan.status))
                            ) ? (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <form method="post" action={route('admin.loans.approve', loan.id)} style={{ flex: 1 }}>
                                        <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                        <button type="submit" className="ds-button-primary" style={{ width: '100%', padding: '12px' }}>Setujui Pengajuan</button>
                                    </form>
                                    <form method="post" action={route('admin.loans.reject', loan.id)} style={{ flex: 1 }}>
                                        <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                        <button type="submit" className="ds-button-primary" style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none' }}>Tolak</button>
                                    </form>
                                </div>
                            ) : isBendahara && loan.status === 'disetujui' ? (
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <form method="post" action={route('admin.loans.disburse', loan.id)} style={{ flex: 1 }}>
                                        <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]')?.content} />
                                        <button type="submit" className="ds-button-primary" style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white' }}>Dana Terkirim</button>
                                    </form>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '8px', fontSize: '14px', color: 'var(--color-muted)' }}>
                                    {loan.status === 'disetujui' ? 'Pinjaman ini telah disetujui sepenuhnya.' : 
                                     loan.status === 'aktif' ? 'Pinjaman ini sudah aktif/berjalan.' :
                                     loan.status === 'ditolak' ? 'Pinjaman ini telah ditolak.' :
                                     'Tidak ada aksi yang diperlukan dari Anda saat ini.'}
                                </div>
                            )}

                            {/* Tracking Status */}
                            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-muted)' }}>Persetujuan Bendahara</span>
                                    {(loan.bendahara_approved_at || ['disetujui', 'menunggu_pencairan', 'aktif', 'lunas', 'menunggu_ketua'].includes(loan.status)) ? (
                                        <span style={{ color: 'var(--color-semantic-up)' }}>Selesai ✓</span>
                                    ) : (
                                        <span>Menunggu</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--color-muted)' }}>Persetujuan Ketua</span>
                                    {(loan.ketua_approved_at || ['disetujui', 'menunggu_pencairan', 'aktif', 'lunas', 'menunggu_bendahara'].includes(loan.status)) ? (
                                        <span style={{ color: 'var(--color-semantic-up)' }}>Selesai ✓</span>
                                    ) : (
                                        <span>Menunggu</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Limit Info Card */}
                        <div style={{ backgroundColor: 'var(--color-surface-dark)', color: 'white', borderRadius: 'var(--rounded-xl)', padding: '32px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '24px' }}>Analisis Kapasitas Bayar (DBR)</h3>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Limit Potongan Maksimal</span>
                                    <span style={{ fontFamily: 'var(--font-mono)' }}>Rp {formatRp(limitInfo.maxLimit)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Simpanan Wajib Anggota</span>
                                    <span style={{ fontFamily: 'var(--font-mono)' }}>- Rp {formatRp(limitInfo.monthlySaving)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Total Cicilan Berjalan (termasuk ini)</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: '#fca5a5' }}>- Rp {formatRp(limitInfo.totalInstallments)}</span>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Penggunaan Limit</span>
                                    <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{limitInfo.usedPercentage}%</span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div 
                                        style={{ 
                                            height: '100%', 
                                            width: `${Math.min(100, limitInfo.usedPercentage)}%`, 
                                            backgroundColor: limitInfo.usedPercentage > 100 ? '#ef4444' : (limitInfo.usedPercentage > 80 ? '#f59e0b' : '#10b981'),
                                            borderRadius: '4px'
                                        }}
                                    ></div>
                                </div>

                                {limitInfo.usedPercentage > 100 && (
                                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#ef444420', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontSize: '12px', lineHeight: '1.5' }}>
                                        <strong>⚠️ Peringatan:</strong> Total cicilan anggota ini telah melampaui limit potongan gaji yang diizinkan institusi. Disarankan untuk menolak pengajuan ini demi keamanan finansial.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
