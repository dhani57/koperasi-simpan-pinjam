import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function MemberLayout({ auth, children }) {
    const { url } = usePage();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navLinks = [
        { label: 'Dashboard', href: route('member.dashboard'), active: url === '/member/dashboard' },
        { label: 'Pengajuan', href: route('member.loans.index'), active: url.startsWith('/member/loans') },
        { label: 'Mutasi', href: route('member.mutations.index'), active: url.startsWith('/member/mutations') },
        { label: 'Rapor SHU', href: route('member.shu.index'), active: url.startsWith('/member/shu') },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-soft)', display: 'flex', flexDirection: 'column' }}>
            {/* Floating Top Navigation Bar */}
            <div style={{ padding: 'var(--spacing-lg) var(--spacing-lg) 0', display: 'flex', justifyContent: 'center' }}>
                <header style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'white', 
                    borderRadius: 'var(--rounded-lg)',
                    boxShadow: '0 4px 12px rgba(11, 94, 168, 0.25)',
                    width: '100%',
                    maxWidth: '1200px',
                    position: 'relative'
                }}>
                    <div style={{ height: '64px', display: 'flex', alignItems: 'center', padding: '0 var(--spacing-lg)', justifyContent: 'space-between' }}>
                        <Link href="/">
                            <ApplicationLogo theme="dark" />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex" style={{ gap: 'var(--spacing-xl)' }}>
                            {navLinks.map((link, idx) => (
                                <Link 
                                    key={idx} 
                                    href={link.href}
                                    style={{ 
                                        color: link.active ? 'white' : 'rgba(255,255,255,0.7)', 
                                        fontWeight: link.active ? 600 : 400,
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                    className="hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>Bantuan</span>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button style={{ 
                                        width: '32px', 
                                        height: '32px', 
                                        borderRadius: '50%', 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        color: 'white', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}>
                                        {auth.user.name.substring(0, 2).toUpperCase()}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right" width="48">
                                    <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="flex items-center md:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' md:hidden'} style={{ backgroundColor: 'var(--color-surface-dark-elevated)', borderRadius: '0 0 var(--rounded-lg) var(--rounded-lg)', overflow: 'hidden' }}>
                        <div className="space-y-1 pb-3 pt-2">
                            {navLinks.map((link, idx) => (
                                <ResponsiveNavLink
                                    key={idx}
                                    href={link.href}
                                    active={link.active}
                                >
                                    {link.label}
                                </ResponsiveNavLink>
                            ))}
                        </div>
                        <div className="border-t border-gray-600 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-white">
                                    {auth.user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-400">
                                    {auth.user.email}
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    Profil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Keluar
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            {/* Main Content Area */}
            <main style={{ flex: 1, backgroundColor: 'var(--color-surface-soft)', padding: 'var(--spacing-lg) 0' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
                    {children}
                </div>
            </main>
            
            {/* Footer */}
            <footer style={{ backgroundColor: 'var(--color-surface-dark)', padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                &copy; 2026 Koperasi Prima. Hak Cipta Dilindungi Undang-Undang. &bull; Butuh Bantuan? Hubungi Admin
            </footer>
        </div>
    );
}
