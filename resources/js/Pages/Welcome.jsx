import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useRef } from 'react';
import TopNavUnila from '../Components/DesignSystem/TopNavUnila';
import HeroBandDark from '../Components/DesignSystem/HeroBandDark';
import FooterLight from '../Components/DesignSystem/FooterLight';

export default function Welcome({ auth, stats, departmentDistribution, boardMembers }) {
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const boardRef = useRef(null);
    const distRef = useRef(null);

    const formatRp = (num) => {
        if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} M`;
        if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Jt`;
        return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
    };

    useEffect(() => {
        const observerOptions = { threshold: 0.15 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.querySelectorAll('[data-animate]');
                    children.forEach((el, i) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, i * 120);
                    });
                }
            });
        }, observerOptions);

        [heroRef, statsRef, boardRef, distRef].forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    const roleColors = {
        ketua: { bg: '#4f46e5', text: '#fff' },
        bendahara: { bg: '#0891b2', text: '#fff' },
        pengurus: { bg: '#7c3aed', text: '#fff' },
    };

    // Calculate max for distribution bar chart
    const maxDist = departmentDistribution?.length > 0
        ? Math.max(...departmentDistribution.map(d => d.total))
        : 1;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-canvas)' }}>
            <Head title="Koperasi FT Unila" />

            <div style={{ backgroundColor: 'var(--color-surface-dark)' }}>
                <TopNavUnila auth={auth} />
            </div>

            <main style={{ flex: 1 }}>
                {/* Hero — Profil Koperasi */}
                <HeroBandDark>
                    <div ref={heroRef} style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto', padding: '24px 0' }}>
                        <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 20px', borderRadius: '100px', backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>K</span>
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px' }}>Koperasi FT Unila</span>
                            </div>
                        </div>

                        <h1 data-animate className="ds-display-mega" style={{ marginBottom: '16px', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s', lineHeight: 1.15 }}>
                            Koperasi Simpan Pinjam<br />Fakultas Teknik Universitas Lampung
                        </h1>

                        <p data-animate className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)', marginBottom: '32px', maxWidth: '520px', margin: '0 auto 32px', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s', lineHeight: 1.7 }}>
                            Melayani kesejahteraan karyawan dan dosen Fakultas Teknik Universitas Lampung melalui program simpanan dan pinjaman yang transparan, aman, dan adil.
                        </p>

                        <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s' }}>
                            {auth?.user ? (
                                <Link
                                    href={['pengurus', 'bendahara', 'ketua', 'pengawas'].includes(auth.user.role) ? route('admin.dashboard') : route('dashboard')}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '100px', backgroundColor: '#fff', color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
                                >
                                    Buka Dashboard
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '100px', backgroundColor: '#fff', color: 'var(--color-primary)', fontWeight: 600, fontSize: '15px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
                                >
                                    Login Anggota
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </Link>
                            )}
                        </div>
                    </div>
                </HeroBandDark>

                {/* Statistik Umum Koperasi */}
                <section style={{ padding: '64px 24px', backgroundColor: 'var(--color-canvas)' }}>
                    <div ref={statsRef} style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div data-animate style={{ textAlign: 'center', marginBottom: '40px', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
                            <h2 className="ds-display-lg" style={{ marginBottom: '8px' }}>Ringkasan Koperasi</h2>
                            <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Data agregat keuangan koperasi saat ini</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                            {[
                                {
                                    label: 'Total Dana Dikelola',
                                    value: formatRp((stats?.totalSavings || 0) + (stats?.totalActiveLoans || 0)),
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/></svg>
                                    ),
                                    gradient: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                                    color: '#4338ca'
                                },
                                {
                                    label: 'Total Simpanan Anggota',
                                    value: formatRp(stats?.totalSavings || 0),
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-0.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.5a.5.5 0 1 0 1 0 .5.5 0 1 0-1 0"/></svg>
                                    ),
                                    gradient: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                                    color: '#047857'
                                },
                                {
                                    label: 'Total Anggota Aktif',
                                    value: `${stats?.totalMembers || 0} Orang`,
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                    ),
                                    gradient: 'linear-gradient(135deg, #ecfeff, #cffafe)',
                                    color: '#0e7490'
                                },
                            ].map((item, i) => (
                                <div data-animate key={i} style={{
                                    background: item.gradient,
                                    borderRadius: 'var(--rounded-xl)',
                                    padding: '28px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    opacity: 0,
                                    transform: 'translateY(24px)',
                                    transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s`
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginBottom: '6px', fontWeight: 500 }}>{item.label}</div>
                                    <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: item.color, letterSpacing: '-0.5px' }}>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Profil Pengurus */}
                <section style={{ padding: '64px 24px', backgroundColor: 'var(--color-surface-soft)' }}>
                    <div ref={boardRef} style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div data-animate style={{ textAlign: 'center', marginBottom: '40px', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
                            <h2 className="ds-display-lg" style={{ marginBottom: '8px' }}>Pengurus Koperasi</h2>
                            <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Dipercaya mengelola keuangan anggota dengan integritas</p>
                        </div>

                        {boardMembers && boardMembers.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', justifyItems: 'center' }}>
                                {boardMembers.map((member, i) => {
                                    const colors = roleColors[member.role] || { bg: '#6b7280', text: '#fff' };
                                    const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                    return (
                                        <div data-animate key={i} style={{
                                            backgroundColor: '#fff',
                                            borderRadius: 'var(--rounded-xl)',
                                            padding: '32px 24px',
                                            textAlign: 'center',
                                            border: '1px solid var(--color-hairline)',
                                            width: '100%',
                                            maxWidth: '280px',
                                            opacity: 0,
                                            transform: 'translateY(24px)',
                                            transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s`
                                        }}>
                                            {/* Avatar with initials */}
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '50%',
                                                background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 16px',
                                                boxShadow: `0 4px 16px ${colors.bg}30`,
                                            }}>
                                                <span style={{ color: colors.text, fontSize: '28px', fontWeight: 700 }}>{initials}</span>
                                            </div>
                                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)', marginBottom: '6px' }}>{member.name}</h3>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                backgroundColor: `${colors.bg}15`,
                                                color: colors.bg,
                                                marginBottom: '8px'
                                            }}>
                                                {member.role_label}
                                            </span>
                                            {member.department && (
                                                <div style={{ fontSize: '12px', color: 'var(--color-muted)', marginTop: '4px' }}>{member.department}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)', fontSize: '14px' }}>
                                Data pengurus akan segera ditampilkan.
                            </div>
                        )}
                    </div>
                </section>

                {/* Distribusi Anggota per Fakultas */}
                <section style={{ padding: '64px 24px', backgroundColor: 'var(--color-canvas)' }}>
                    <div ref={distRef} style={{ maxWidth: '700px', margin: '0 auto' }}>
                        <div data-animate style={{ textAlign: 'center', marginBottom: '40px', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
                            <h2 className="ds-display-lg" style={{ marginBottom: '8px' }}>Distribusi Anggota</h2>
                            <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Jumlah anggota berdasarkan Fakultas / Unit Kerja</p>
                        </div>

                        {departmentDistribution && departmentDistribution.length > 0 ? (
                            <div style={{ backgroundColor: '#fff', borderRadius: 'var(--rounded-xl)', padding: '32px', border: '1px solid var(--color-hairline)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {departmentDistribution.map((dept, i) => {
                                        const pct = Math.round((dept.total / maxDist) * 100);
                                        const barColors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#be185d'];
                                        const barColor = barColors[i % barColors.length];
                                        return (
                                            <div data-animate key={i} style={{
                                                opacity: 0,
                                                transform: 'translateY(16px)',
                                                transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.05 + i * 0.08}s`
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{dept.department}</span>
                                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: barColor }}>{dept.total} anggota</span>
                                                </div>
                                                <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '5px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${pct}%`,
                                                        backgroundColor: barColor,
                                                        borderRadius: '5px',
                                                        transition: 'width 1s cubic-bezier(0.16,1,0.3,1) 0.3s'
                                                    }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-muted)', fontSize: '14px', backgroundColor: '#fff', borderRadius: 'var(--rounded-xl)', border: '1px solid var(--color-hairline)' }}>
                                Belum ada data distribusi anggota per fakultas.
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <FooterLight>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-xl)' }}>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Koperasi FT Unila</h3>
                        <p style={{ marginTop: 'var(--spacing-sm)', lineHeight: 1.6, fontSize: '13px' }}>
                            Koperasi Simpan Pinjam Fakultas Teknik Universitas Lampung. Melayani kesejahteraan anggota melalui program simpanan dan pinjaman yang aman dan transparan.
                        </p>
                    </div>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Layanan</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', fontSize: '13px' }}>
                            <li>Simpanan Pokok, Wajib &amp; Sukarela</li>
                            <li>Pinjaman dengan Potong Gaji Otomatis</li>
                            <li>Sisa Hasil Usaha (SHU) Tahunan</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="ds-title-md" style={{ color: 'var(--color-ink)' }}>Kontak</h3>
                        <ul style={{ listStyle: 'none', padding: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', fontSize: '13px' }}>
                            <li>Fakultas Teknik, Universitas Lampung</li>
                            <li>Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1</li>
                            <li>Bandar Lampung, Lampung</li>
                        </ul>
                    </div>
                </div>
            </FooterLight>
        </div>
    );
}
