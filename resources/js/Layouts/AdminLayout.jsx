import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function AdminLayout({ auth, children, title }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)' }}>
            
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'var(--color-surface-dark)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 40, color: 'var(--color-on-dark)' }}>
                {/* Brand Logo */}
                <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Link href="/">
                        <ApplicationLogo theme="dark" />
                    </Link>
                </div>

                {/* Navigation Menu */}
                <nav style={{ padding: '0 var(--spacing-base)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'var(--spacing-md)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-on-dark-soft)', letterSpacing: '1px', textTransform: 'uppercase', padding: 'var(--spacing-md) var(--spacing-base) var(--spacing-xs)' }}>
                        Menu Pengurus
                    </div>
                    
                    <Link 
                        href={route('admin.dashboard')} 
                        style={{ 
                            padding: '10px 16px', 
                            borderRadius: 'var(--rounded-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: route().current('admin.dashboard') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: route().current('admin.dashboard') ? 'var(--color-on-dark)' : 'rgba(255, 255, 255, 0.7)',
                            fontWeight: route().current('admin.dashboard') ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"></rect><rect x="14" y="3" width="7" height="5" rx="1"></rect><rect x="14" y="12" width="7" height="9" rx="1"></rect><rect x="3" y="16" width="7" height="5" rx="1"></rect></svg>
                        Dasbor
                    </Link>

                    <Link 
                        href={route('admin.users.index')} 
                        style={{ 
                            padding: '10px 16px', 
                            borderRadius: 'var(--rounded-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: route().current('admin.users.*') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: route().current('admin.users.*') ? 'var(--color-on-dark)' : 'rgba(255, 255, 255, 0.7)',
                            fontWeight: route().current('admin.users.*') ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Anggota
                    </Link>

                    <Link 
                        href={route('admin.loans.index')} 
                        style={{ 
                            padding: '10px 16px', 
                            borderRadius: 'var(--rounded-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: route().current('admin.loans.*') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: route().current('admin.loans.*') ? 'var(--color-on-dark)' : 'rgba(255, 255, 255, 0.7)',
                            fontWeight: route().current('admin.loans.*') ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        Verifikasi Pinjaman
                    </Link>

                    <Link 
                        href={route('admin.settings.index')} 
                        style={{ 
                            padding: '10px 16px', 
                            borderRadius: 'var(--rounded-md)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: route().current('admin.settings.*') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                            color: route().current('admin.settings.*') ? 'var(--color-on-dark)' : 'rgba(255, 255, 255, 0.7)',
                            fontWeight: route().current('admin.settings.*') ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        Parameter Sistem
                    </Link>
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                
                {/* Floating TopNav (Sneat Style, but Blue) */}
                <header style={{ padding: 'var(--spacing-lg) var(--spacing-lg) 0' }}>
                    <div style={{ 
                        backgroundColor: 'var(--color-surface-dark)', 
                        borderRadius: 'var(--rounded-lg)', 
                        boxShadow: '0 4px 12px rgba(11, 94, 168, 0.15)',
                        padding: '0 var(--spacing-lg)',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        {/* Profile Area */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="hidden sm:flex sm:items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-transparent hover:bg-white/10 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {auth.user.name.charAt(0)}
                                                </div>
                                                {auth.user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
