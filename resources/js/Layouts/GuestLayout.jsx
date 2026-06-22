import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-16 w-auto fill-current text-[#0B5EA8]" />
                </Link>
            </div>

            <div className="mt-10 w-full bg-white px-6 py-8 sm:max-w-md sm:rounded-[24px] border border-[#e2e8f0]">
                {children}
            </div>
        </div>
    );
}
