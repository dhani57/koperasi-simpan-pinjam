import { Link } from '@inertiajs/react';

export default function ButtonPrimary({ href, children, isLarge = false, className = '', ...props }) {
    const baseClass = isLarge ? "ds-button-pill-cta" : "ds-button-primary";
    const finalClass = `${baseClass} ${className}`.trim();
    
    if (href) {
        return (
            <Link href={href} className={finalClass} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={finalClass} {...props}>
            {children}
        </button>
    );
}
