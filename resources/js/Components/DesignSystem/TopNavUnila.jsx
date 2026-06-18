import { Link } from '@inertiajs/react';

export default function TopNavUnila({ auth }) {
    return (
        <nav className="ds-top-nav-unila">
            <div className="flex items-center gap-4">
                <div className="font-bold text-lg ds-display-mega" style={{ fontSize: '24px', letterSpacing: '0px' }}>
                    Koperasi Institusi
                </div>
            </div>
            <div className="flex items-center gap-6">
                {auth?.user ? (
                    <Link href={route('dashboard')} className="ds-nav-link" style={{ opacity: 0.9 }}>
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href={route('login')} className="ds-button-secondary-dark hover:opacity-80 transition-opacity" style={{ height: '36px', padding: '8px 16px', fontSize: '14px' }}>
                            Log in
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
