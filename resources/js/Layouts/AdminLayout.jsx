import { Link } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';

export default function AdminLayout({ auth, children, title }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-ink)', fontFamily: 'var(--font-sans)' }}>
            
            {/* Sidebar */}
            <aside style={{ width: '260px', backgroundColor: 'var(--color-canvas)', borderRight: '1px solid var(--color-hairline)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 40 }}>
                {/* Brand Logo */}
                <div style={{ padding: 'var(--spacing-xl) var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        K
                    </div>
                    <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-body-strong)' }}>Koperasi.</span>
                </div>

                {/* Navigation Menu */}
                <nav style={{ padding: '0 var(--spacing-base)', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: 'var(--spacing-md)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-soft)', letterSpacing: '1px', textTransform: 'uppercase', padding: 'var(--spacing-md) var(--spacing-base) var(--spacing-xs)' }}>
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
                            backgroundColor: route().current('admin.dashboard') ? 'var(--color-surface-strong)' : 'transparent',
                            color: route().current('admin.dashboard') ? 'var(--color-primary)' : 'var(--color-body)',
                            fontWeight: route().current('admin.dashboard') ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                        className="hover:bg-slate-100"
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
                            backgroundColor: route().current('admin.users.*') ? 'var(--color-surface-strong)' : 'transparent',
                            color: route().current('admin.users.*') ? 'var(--color-primary)' : 'var(--color-body)',
                            fontWeight: route().current('admin.users.*') ? 600 : 500,
                            transition: 'all 0.2s ease'
                        }}
                        className="hover:bg-slate-100"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Anggota
                    </Link>
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                
                {/* Floating TopNav (Sneat Style) */}
                <header style={{ padding: 'var(--spacing-lg) var(--spacing-lg) 0' }}>
                    <div style={{ 
                        backgroundColor: 'var(--color-canvas)', 
                        borderRadius: 'var(--rounded-lg)', 
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                        padding: '0 var(--spacing-lg)',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {/* Search Mockup */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted)' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <span style={{ fontSize: '14px' }}>Search (Ctrl+/)</span>
                        </div>

                        {/* Profile Area */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="hidden sm:flex sm:items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-slate-600 bg-white hover:text-slate-900 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {auth.user.name.charAt(0)}
                                                </div>
                                                {auth.user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
