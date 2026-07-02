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
        if (num >= 1000000000) {
            const val = num / 1000000000;
            return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} M`;
        }
        if (num >= 1000000) {
            const val = num / 1000000;
            return `Rp ${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)} Jt`;
        }
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
                <HeroBandDark heroRef={heroRef}>
                    {/* Left Column: Copy */}
                    <div className="flex flex-col justify-center text-center lg:text-left pr-0 lg:pr-8">
                        <h1 data-animate className="ds-display-mega mb-6 opacity-0 translate-y-6 transition-all duration-700 ease-out">
                            Koperasi<br />Simpan Pinjam<br />FT Unila.
                        </h1>
                        <p data-animate className="ds-body-md text-slate-400 max-w-md mx-auto lg:mx-0 opacity-0 translate-y-6 transition-all duration-700 delay-100 ease-out">
                            Melayani kesejahteraan karyawan dan dosen Fakultas Teknik Universitas Lampung melalui program simpanan dan pinjaman yang transparan, aman, dan adil.
                        </p>
                    </div>
                    
                    {/* Right Column: Layered Cards (Mobile First & Centered on Tablet/Mobile) */}
                    <div className="relative w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto lg:max-w-[460px] mt-12 lg:mt-0 flex flex-col items-center lg:items-end">
                        
                        {/* Main Card */}
                        <div 
                            data-animate 
                            className="relative z-10 w-full bg-white text-slate-900 rounded-[24px] p-8 shadow-xl opacity-0 translate-y-6 transition-all duration-700 delay-300 ease-out text-left"
                        >
                            <div className="text-slate-400 text-[13px] font-semibold mb-2 uppercase tracking-wider">Total Dana Dikelola</div>
                            <div className="flex items-baseline gap-2 mb-8">
                                {/* Desktop/Tablet view (Full numbers) */}
                                <div className="hidden sm:flex items-baseline gap-2">
                                    <span className="font-mono text-xl font-bold text-slate-900">Rp</span>
                                    <span className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                                        {new Intl.NumberFormat('id-ID').format((stats?.totalSavings || 0) + (stats?.totalActiveLoans || 0))}
                                    </span>
                                </div>
                                {/* Mobile view (Abbreviated Jt/M) */}
                                <div className="flex sm:hidden items-baseline gap-2">
                                    <span className="font-mono text-3xl font-bold text-slate-900 tracking-tight">
                                        {formatRp((stats?.totalSavings || 0) + (stats?.totalActiveLoans || 0))}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                {/* Simpanan */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">S</div>
                                        <div>
                                            <div className="text-[15px] font-semibold text-slate-900 leading-tight">Total Simpanan</div>
                                            <div className="text-[13px] text-slate-500 mt-0.5">Pokok, Wajib & Sukarela</div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm font-semibold text-slate-700 whitespace-nowrap pl-2">
                                        <span className="hidden sm:inline">Rp {new Intl.NumberFormat('id-ID').format(stats?.totalSavings || 0)}</span>
                                        <span className="inline sm:hidden">{formatRp(stats?.totalSavings || 0)}</span>
                                    </div>
                                </div>
                                
                                {/* Pinjaman */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">P</div>
                                        <div>
                                            <div className="text-[15px] font-semibold text-slate-900 leading-tight">Total Pinjaman</div>
                                            <div className="text-[13px] text-slate-500 mt-0.5">Pinjaman Aktif Koperasi</div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm font-semibold text-slate-700 whitespace-nowrap pl-2">
                                        <span className="hidden sm:inline">Rp {new Intl.NumberFormat('id-ID').format(stats?.totalActiveLoans || 0)}</span>
                                        <span className="inline sm:hidden">{formatRp(stats?.totalActiveLoans || 0)}</span>
                                    </div>
                                </div>

                                {/* Mobile Only: Total Anggota Aktif Row */}
                                <div className="flex items-center justify-between w-full lg:hidden border-t border-slate-100 pt-5 mt-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 shrink-0 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-200">A</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[15px] font-semibold text-slate-900 leading-tight">Total Anggota Aktif</span>
                                                <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">AKTIF</span>
                                            </div>
                                            <div className="text-[13px] text-slate-500 mt-0.5">Tersebar di {departmentDistribution?.length || 0} Unit Kerja</div>
                                        </div>
                                    </div>
                                    <div className="font-mono text-sm font-bold text-amber-600 whitespace-nowrap pl-2">
                                        {stats?.totalMembers || 0} Orang
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Overlapping Small Card (Desktop Only) */}
                        <div 
                            data-animate 
                            className="hidden lg:block absolute bottom-[-96px] right-[-48px] z-20 w-[320px] bg-white text-slate-900 rounded-[24px] p-6 shadow-2xl opacity-0 translate-y-6 transition-all duration-700 delay-500 ease-out border border-slate-100/50"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-[13px] text-slate-500 font-semibold uppercase tracking-wider">Total Anggota Aktif</div>
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">AKTIF</span>
                            </div>
                            <div className="flex items-baseline gap-1.5 mb-2">
                                <span className="font-mono text-3xl font-bold text-amber-600">
                                    {stats?.totalMembers || 0}
                                </span>
                                <span className="text-sm font-bold text-amber-600">Orang</span>
                            </div>
                            <div className="text-[12px] text-emerald-600 font-semibold">
                                Tersebar di {departmentDistribution?.length || 0} Unit Kerja
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
