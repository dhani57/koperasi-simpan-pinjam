import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Link href="/">
                        <ApplicationLogo theme="light" />
                    </Link>
                </div>

                <div className="w-full bg-white px-6 py-8 sm:p-10 rounded-[24px] border border-[#e2e8f0] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
