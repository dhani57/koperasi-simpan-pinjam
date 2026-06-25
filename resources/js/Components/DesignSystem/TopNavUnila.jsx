import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function TopNavUnila({ auth }) {
    return (
        <nav className="ds-top-nav-unila">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <ApplicationLogo theme="dark" />
                </Link>
            </div>
            <div className="flex items-center gap-6">
                {auth?.user ? (
                    <Link href={['pengurus', 'bendahara', 'ketua', 'pengawas'].includes(auth.user.role) ? route('admin.dashboard') : route('dashboard')} className="ds-nav-link" style={{ opacity: 0.9 }}>
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href={route('login')} className="ds-button-secondary-dark hover:opacity-80 transition-opacity" style={{ height: '36px', padding: '8px 16px', fontSize: '14px' }}>
                            Masuk
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
