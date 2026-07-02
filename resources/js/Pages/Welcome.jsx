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
        if (!num) return 'Rp 0';
        if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} M`;
        if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Jt`;
        return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
    };

    const maxDist = departmentDistribution?.length > 0
        ? Math.max(...departmentDistribution.map(d => d.total))
        : 1;

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
        ketua: { bg: 'var(--color-primary)', text: 'var(--color-on-primary)' },
        bendahara: { bg: 'var(--color-surface-strong)', text: 'var(--color-ink)' },
        pengawas: { bg: 'var(--color-surface-strong)', text: 'var(--color-ink)' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-canvas)' }}>
            <Head>
                <title>Koperasi FT Unila</title>
                <meta name="description" content="Melayani kesejahteraan karyawan dan dosen Fakultas Teknik Universitas Lampung melalui program simpanan dan pinjaman yang transparan, aman, dan adil." />
            </Head>

            <TopNavUnila auth={auth} />

            <main style={{ flex: 1 }}>
                {/* Hero Section */}
                <HeroBandDark>
                    <div ref={heroRef} className="ds-hero-container">
                        {/* Left Column: Copy */}
                        <div style={{ textAlign: 'left' }}>
                            <h1 data-animate className="ds-display-mega" style={{ marginBottom: 'var(--spacing-md)', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
                                Koperasi<br />Simpan Pinjam<br />FT Unila
                            </h1>
                            <p data-animate className="ds-body-md" style={{ color: 'var(--color-on-dark-soft)', maxWidth: '480px', opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
                                Melayani kesejahteraan karyawan dan dosen Fakultas Teknik Universitas Lampung melalui program simpanan dan pinjaman yang transparan, aman, dan adil.
                            </p>
                        </div>
                        
                        {/* Right Column: Stats Card */}
                        <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
                            <div className="ds-product-ui-card-dark" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                <div>
                                    <h3 className="ds-title-sm" style={{ color: 'var(--color-on-dark-soft)', marginBottom: 'var(--spacing-xxs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Dana Dikelola</h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600, color: 'var(--color-on-dark)' }}>
                                        {formatRp((stats?.totalSavings || 0) + (stats?.totalActiveLoans || 0))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="ds-title-sm" style={{ color: 'var(--color-on-dark-soft)', marginBottom: 'var(--spacing-xxs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Simpanan Anggota</h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 500, color: 'var(--color-on-dark)' }}>
                                        {formatRp(stats?.totalSavings || 0)}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="ds-title-sm" style={{ color: 'var(--color-on-dark-soft)', marginBottom: 'var(--spacing-xxs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Anggota Aktif</h3>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 500, color: 'var(--color-on-dark)' }}>
                                        {stats?.totalMembers || 0} <span className="ds-body-sm" style={{ color: 'var(--color-on-dark-soft)' }}>Orang</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </HeroBandDark>

                {/* Distribusi Anggota & Pengurus */}
                <section style={{ padding: 'var(--spacing-section) var(--spacing-xl)', backgroundColor: 'var(--color-surface-soft)' }}>
                    <div ref={distRef} style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xxl)' }} className="lg:grid-cols-2 grid-cols-1">
                        
                        {/* Distribusi Anggota */}
                        <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
                            <h2 className="ds-display-lg">Distribusi Anggota</h2>
                            <div className="ds-feature-card" style={{ marginTop: 'var(--spacing-xl)' }}>
                                {departmentDistribution && departmentDistribution.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                        {departmentDistribution.map((dept, i) => {
                                            const pct = Math.round((dept.total / maxDist) * 100);
                                            return (
                                                <div key={i}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xxs)' }}>
                                                        <span className="ds-body-md" style={{ fontWeight: 600 }}>{dept.department}</span>
                                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 500 }}>{dept.total}</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-strong)', borderRadius: 'var(--rounded-pill)' }}>
                                                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--rounded-pill)' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Belum ada data distribusi anggota.</p>
                                )}
                            </div>
                        </div>

                        {/* Pengurus */}
                        <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
                            <h2 className="ds-display-lg">Susunan Pengurus</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
                                {boardMembers && boardMembers.length > 0 ? (
                                    boardMembers.map((member, i) => {
                                        const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                        const roleColor = roleColors[member.role] || roleColors.pengawas;
                                        
                                        return (
                                            <div key={i} className="ds-feature-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)' }}>
                                                <div className="ds-asset-icon-circular" style={{ backgroundColor: roleColor.bg, color: roleColor.text }}>
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="ds-title-sm" style={{ marginBottom: '2px' }}>{member.name}</div>
                                                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        {member.role_label}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="ds-feature-card" style={{ gridColumn: 'span 2' }}>
                                        <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Data pengurus belum tersedia.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <FooterLight>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-xl)' }} className="ds-grid-3up">
                    <div>
                        <div className="ds-title-md">Koperasi FT Unila</div>
                        <p className="ds-body-sm" style={{ color: 'var(--color-muted)', marginTop: 'var(--spacing-sm)' }}>
                            Melayani kesejahteraan anggota melalui program simpanan dan pinjaman yang aman, transparan, dan profesional.
                        </p>
                    </div>
                    <div>
                        <div className="ds-title-md">Layanan</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <li className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Simpanan Pokok & Wajib</li>
                            <li className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Simpanan Sukarela</li>
                            <li className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Pinjaman Terjadwal</li>
                        </ul>
                    </div>
                    <div>
                        <div className="ds-title-md">Kontak</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 'var(--spacing-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                            <li className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Fakultas Teknik Unila</li>
                            <li className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Jl. Prof. Dr. Ir. Sumantri Brojonegoro No.1</li>
                        </ul>
                    </div>
                </div>
            </FooterLight>
            
            <div className="ds-legal-band">
                <div>&copy; {new Date().getFullYear()} Koperasi Simpan Pinjam FT Unila</div>
                <div>Dirancang untuk kesejahteraan bersama</div>
            </div>
        </div>
    );
}
