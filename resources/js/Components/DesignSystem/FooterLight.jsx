export default function FooterLight({ children, className = '', ...props }) {
    return (
        <footer {...props}>
            <div className={`ds-footer-light ${className}`}>
                {children}
            </div>
            <div className="ds-legal-band">
                <div>&copy; {new Date().getFullYear()} Koperasi Simpan Pinjam Internal. Seluruh hak cipta dilindungi.</div>
                <div>Data internal rahasia dan tidak untuk disebarluaskan.</div>
            </div>
        </footer>
    );
}
