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

    const faculties = ['FEB', 'FH', 'FKIP', 'FT', 'FK', 'FP', 'FMIPA', 'FISIP'];
    const facultyDistribution = faculties.map(fac => {
        const match = departmentDistribution?.find(d => d.department?.toUpperCase() === fac);
        return {
            faculty: fac,
            total: match ? match.total : 0
        };
    });

    const maxDist = facultyDistribution.length > 0
        ? Math.max(...facultyDistribution.map(f => f.total), 1)
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
                            className="hidden lg:block absolute lg:top-[calc(100%-24px)] lg:right-[-32px] z-20 w-[320px] bg-white text-slate-900 rounded-[24px] p-6 shadow-2xl opacity-0 translate-y-6 transition-all duration-700 delay-500 ease-out border border-slate-100/50"
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

                {/* Visi & Misi Section */}
                <section style={{ padding: 'var(--spacing-section) var(--spacing-xl)', backgroundColor: 'var(--color-canvas)' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div className="text-center mb-12">
                            <h2 className="ds-display-md">Visi & Misi Koperasi</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Visi (Kiri) */}
                            <div className="ds-feature-card hover:shadow-md transition-shadow duration-300">
                                <h3 className="ds-title-md text-slate-900 mb-6">
                                    Visi Koperasi
                                </h3>
                                <ol className="flex flex-col gap-4 list-decimal pl-5 text-slate-600 text-sm leading-relaxed">
                                    <li>
                                        Menjadi wadah keuangan bersama yang amanah, unggul, dan bebas riba demi terwujudnya kemandirian ekonomi anggota.
                                    </li>
                                    <li>
                                        Membangun ekosistem simpan pinjam yang berlandaskan asas kekeluargaan dan profesionalisme di Fakultas Teknik Unila.
                                    </li>
                                </ol>
                            </div>
                            
                            {/* Misi (Kanan) */}
                            <div className="ds-feature-card hover:shadow-md transition-shadow duration-300">
                                <h3 className="ds-title-md text-slate-900 mb-6">
                                    Misi Koperasi
                                </h3>
                                <ol className="flex flex-col gap-4 list-decimal pl-5 text-slate-600 text-sm leading-relaxed">
                                    <li>
                                        Menyelenggarakan transaksi simpanan dan pinjaman tanpa unsur riba demi keberkahan dan ketenangan berfinansial.
                                    </li>
                                    <li>
                                        Menyediakan transparansi data dan bagi hasil yang adil bagi seluruh anggota secara terbuka dan berkala.
                                    </li>
                                    <li>
                                        Memberikan kemudahan layanan keuangan yang cepat, aman, dan terintegrasi bagi dosen dan karyawan.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Distribusi Anggota & Pengurus */}
                <section style={{ padding: 'var(--spacing-section) var(--spacing-xl)', backgroundColor: 'var(--color-surface-soft)' }}>
                    <div ref={distRef} style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        
                        <div className="text-center mb-12">
                            <h2 className="ds-display-md">Informasi Pengurus & Anggota</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                            {/* Pengurus */}
                            <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }} className="lg:col-span-5 flex flex-col gap-4">
                                {boardMembers && boardMembers.length > 0 ? (
                                    boardMembers.map((member, i) => {
                                        const avatarSrc = member.profile_photo_path
                                            ? `/storage/${member.profile_photo_path}`
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&color=0F82E6&background=EBF4FF`;

                                        return (
                                            <div key={i} className="ds-feature-card flex items-center gap-4 hover:shadow-md transition-shadow duration-300" style={{ padding: '20px' }}>
                                                <img
                                                    src={avatarSrc}
                                                    alt={member.name}
                                                    className="w-12 h-12 rounded-full object-cover border border-slate-100/80 shadow-sm shrink-0"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{member.role_label}</span>
                                                    <span className="text-[16px] font-semibold text-slate-800 mt-0.5">{member.name}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="ds-feature-card" style={{ padding: '20px' }}>
                                        <p className="ds-body-md text-slate-500">Data pengurus belum tersedia.</p>
                                    </div>
                                )}
                            </div>

                            {/* Distribusi Anggota */}
                            <div data-animate style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s' }} className="lg:col-span-7">
                                <div className="ds-feature-card">
                                    <div className="flex justify-between items-baseline mb-6 pb-4 border-b border-slate-100">
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Anggota</span>
                                        <span className="font-mono text-2xl font-bold text-slate-900">{stats?.totalMembers || 0} Orang</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                        {facultyDistribution.map((item, i) => {
                                            const pct = Math.round((item.total / maxDist) * 100);
                                            const facultyColors = {
                                                FEB: '#DC2626',   // Crimson
                                                FH: '#E11D48',    // Rose
                                                FKIP: '#8B5CF6',  // Purple
                                                FT: '#0F82E6',    // Blue
                                                FK: '#0D9488',    // Teal Green
                                                FP: '#16A34A',    // Green
                                                FMIPA: '#92400E', // Brown
                                                FISIP: '#EA580C', // Orange
                                            };
                                            const barColor = facultyColors[item.faculty] || 'var(--color-primary)';
                                            return (
                                                <div key={i}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xxs)' }}>
                                                        <span className="ds-body-md" style={{ fontWeight: 600 }}>{item.faculty}</span>
                                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 500 }}>{item.total} Orang</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-strong)', borderRadius: 'var(--rounded-pill)' }}>
                                                        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: 'var(--rounded-pill)', transition: 'width 0.8s ease-out' }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
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
