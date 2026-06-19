import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-blue-400 bg-white/10 text-white focus:border-blue-500 focus:bg-white/20'
                    : 'border-transparent text-gray-300 hover:border-gray-500 hover:bg-white/5 hover:text-white focus:border-gray-500 focus:bg-white/5 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
