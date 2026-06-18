export default function ProductUiCardLight({ children, className = '', ...props }) {
    return (
        <div className={`ds-product-ui-card-light ${className}`} {...props}>
            {children}
        </div>
    );
}
