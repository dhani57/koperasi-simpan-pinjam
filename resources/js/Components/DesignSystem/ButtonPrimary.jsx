import { Link } from '@inertiajs/react';

export default function ButtonPrimary({ href, children, isLarge = false, ...props }) {
    const className = isLarge ? "ds-button-pill-cta" : "ds-button-primary";
    
    if (href) {
        return (
            <Link href={href} className={className} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={className} {...props}>
            {children}
        </button>
    );
}
