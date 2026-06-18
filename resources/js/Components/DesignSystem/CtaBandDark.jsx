export default function CtaBandDark({ children, className = '', ...props }) {
    return (
        <div className={`ds-cta-band-dark ${className}`} {...props}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {children}
            </div>
        </div>
    );
}
