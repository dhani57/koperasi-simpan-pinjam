export default function FeatureCard({ title, children, className = '', ...props }) {
    return (
        <div className={`ds-feature-card ${className}`} {...props}>
            {title && <h3 className="ds-title-md">{title}</h3>}
            <div className="ds-body-md" style={{ color: 'var(--color-body)' }}>
                {children}
            </div>
        </div>
    );
}
