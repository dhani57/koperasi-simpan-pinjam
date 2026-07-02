export default function HeroBandDark({ children, heroRef }) {
    return (
        <section className="ds-hero-band-dark">
            <div ref={heroRef} className="ds-hero-container relative">
                {children}
            </div>
        </section>
    );
}
