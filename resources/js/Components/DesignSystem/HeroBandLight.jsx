export default function HeroBandLight({ children, className = '', ...props }) {
    return (
        <div className={`ds-hero-band-light ${className}`} {...props}>
            <div className="ds-hero-container">
                {children}
            </div>
        </div>
    );
}
