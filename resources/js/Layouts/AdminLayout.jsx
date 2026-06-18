import { Link } from '@inertiajs/react';
import TopNavUnila from '../Components/DesignSystem/TopNavUnila';

export default function AdminLayout({ auth, children, title }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-soft)' }}>
            <div style={{ backgroundColor: 'var(--color-surface-dark)' }}>
                <TopNavUnila auth={auth} />
            </div>

            <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {/* Sidebar */}
                <aside style={{ width: '250px', padding: 'var(--spacing-xl) var(--spacing-lg) var(--spacing-xl) 0' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                        <div className="ds-title-sm" style={{ padding: 'var(--spacing-xs) var(--spacing-base)', color: 'var(--color-muted)' }}>MENU PENGURUS</div>
                        
                        <Link 
                            href={route('admin.dashboard')} 
                            className={`ds-nav-link ${route().current('admin.dashboard') ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                            style={{ 
                                padding: 'var(--spacing-sm) var(--spacing-base)', 
                                borderRadius: 'var(--rounded-md)',
                                backgroundColor: route().current('admin.dashboard') ? 'var(--color-surface-strong)' : 'transparent'
                            }}
                        >
                            Dasbor Ringkasan
                        </Link>
                        <Link 
                            href={route('admin.users.index')} 
                            className={`ds-nav-link ${route().current('admin.users.*') ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                            style={{ 
                                padding: 'var(--spacing-sm) var(--spacing-base)', 
                                borderRadius: 'var(--rounded-md)',
                                backgroundColor: route().current('admin.users.*') ? 'var(--color-surface-strong)' : 'transparent'
                            }}
                        >
                            Manajemen Anggota
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: 'var(--spacing-xl) 0 var(--spacing-xl) var(--spacing-xl)', borderLeft: '1px solid var(--color-hairline)' }}>
                    {title && <h1 className="ds-display-lg" style={{ fontSize: '32px', marginBottom: 'var(--spacing-lg)' }}>{title}</h1>}
                    {children}
                </main>
            </div>
        </div>
    );
}
