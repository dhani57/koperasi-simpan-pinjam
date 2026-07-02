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
                    <div ref={heroRef} className="ds-hero-container w-full px-4 md:px-8 py-12 md:py-24">
                        {/* Left Column: Copy */}
                        <div className="text-left max-w-xl mx-auto md:mx-0 w-full mb-12 md:mb-0">
                            <h1 data-animate className="ds-display-mega mb-6 opacity-0 translate-y-6 transition-all duration-700 ease-out">
                                Koperasi<br />Simpan Pinjam<br />FT Unila.
                            </h1>
                            <p data-animate className="ds-body-md text-slate-300 mb-10 opacity-0 translate-y-6 transition-all duration-700 delay-100 ease-out max-w-md">
                                Sistem tertutup terintegrasi. Aman, transparan, dan tanpa repot. Khusus untuk ekosistem Fakultas Teknik Universitas Lampung.
                            </p>
                            
                            {!auth?.user ? (
                                <div data-animate className="flex flex-wrap gap-4 opacity-0 translate-y-6 transition-all duration-700 delay-200 ease-out">
                                    <Link href={route('login')} className="ds-button-primary">
                                        Login Anggota
                                    </Link>
                                    <a href="#details" className="ds-button-secondary-dark">
                                        Lihat Detail
                                    </a>
                                </div>
                            ) : (
                                <div data-animate className="flex flex-wrap gap-4 opacity-0 translate-y-6 transition-all duration-700 delay-200 ease-out">
                                    <Link href={['pengurus', 'bendahara', 'ketua', 'pengawas'].includes(auth.user.role) ? route('admin.dashboard') : route('dashboard')} className="ds-button-primary">
                                        Lihat Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        {/* Right Column: Layered Cards (Product UI Mockup) */}
                        <div data-animate className="relative w-full max-w-md mx-auto opacity-0 translate-y-6 transition-all duration-700 delay-300 ease-out mt-8 md:mt-0">
                            {/* Main Card */}
                            <div className="ds-product-ui-card-light relative z-10 p-6 md:p-8">
                                <div className="text-sm text-slate-500 mb-1">Total Dana Dikelola</div>
                                <div className="font-mono text-2xl md:text-3xl font-bold text-slate-800 mb-8">
                                    {formatRp((stats?.totalSavings || 0) + (stats?.totalActiveLoans || 0))}
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#0B5EA8] text-white flex items-center justify-center font-bold text-xs">S</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800">Total Simpanan</div>
                                            <div className="text-xs text-slate-500">Pokok, Wajib, Sukarela</div>
                                        </div>
                                        <div className="font-mono text-sm font-medium text-slate-600">
                                            {formatRp(stats?.totalSavings || 0)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">P</div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800">Total Pinjaman</div>
                                            <div className="text-xs text-slate-500">Pinjaman Aktif</div>
                                        </div>
                                        <div className="font-mono text-sm font-medium text-slate-600">
                                            {formatRp(stats?.totalActiveLoans || 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Overlapping Small Card */}
                            <div className="ds-product-ui-card-light absolute -bottom-10 md:-bottom-16 -right-4 md:-right-12 z-20 p-5 md:p-6 shadow-2xl w-64 md:w-72">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-xs font-semibold text-slate-500">Total Anggota Aktif</div>
                                    <span className="ds-badge-pill">AKTIF</span>
                                </div>
                                <div className="font-mono text-xl md:text-2xl font-bold text-[#CA8306] mb-1">
                                    {stats?.totalMembers || 0} <span className="text-sm">Orang</span>
                                </div>
                                <div className="text-xs text-[#05b169] font-medium">
                                    Tersebar di {departmentDistribution?.length || 0} Unit Kerja
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
