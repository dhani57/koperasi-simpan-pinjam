import { Link } from '@inertiajs/react';

export default function ButtonSecondaryDark({ className = '', disabled, children, href, ...props }) {
    if (href) {
        return (
            <Link
                href={href}
                className={
                    `ds-button-secondary-dark ${disabled ? 'opacity-25' : ''} ` + className
                }
                disabled={disabled}
                {...props}
            >
                {children}
            </Link>
        );
    }
    
    return (
        <button
            {...props}
            className={
                `ds-button-secondary-dark ${disabled ? 'opacity-25' : ''} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
