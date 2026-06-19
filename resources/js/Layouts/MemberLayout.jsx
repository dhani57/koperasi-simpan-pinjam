import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function MemberLayout({ auth, children }) {
    const { url } = usePage();

    const navLinks = [
        { label: 'Dashboard', href: route('member.dashboard'), active: url === '/member/dashboard' },
        { label: 'Pengajuan', href: route('member.loans.index'), active: url.startsWith('/member/loans') },
        { label: 'Mutasi', href: route('member.mutations.index'), active: url.startsWith('/member/mutations') },
        { label: 'Rapor SHU', href: route('member.shu.index'), active: url.startsWith('/member/shu') },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface-soft)', display: 'flex', flexDirection: 'column' }}>
            {/* Top Navigation Bar */}
            <header style={{ backgroundColor: 'var(--color-primary)', color: 'white', height: '64px', display: 'flex', alignItems: 'center', padding: '0 var(--spacing-xl)', justifyContent: 'space-between', flexShrink: 0 }}>
                <Link href="/">
                    <ApplicationLogo theme="dark" />
                </Link>

                <nav style={{ display: 'flex', gap: 'var(--spacing-xl)' }}>
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
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
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
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, backgroundColor: 'var(--color-surface-soft)' }}>
                {children}
            </main>
            
            {/* Footer */}
            <footer style={{ backgroundColor: 'var(--color-surface-dark)', padding: 'var(--spacing-xl) 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                &copy; 2026 Koperasi Prima. Hak Cipta Dilindungi Undang-Undang. &bull; Butuh Bantuan? Hubungi Admin
            </footer>
        </div>
    );
}
