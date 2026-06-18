import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        identifier: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-canvas)' }}>
            <Head title="Log in" />

            {/* Left Pane - Information (Hidden on small screens) */}
            <div className="hidden lg:flex" style={{ 
                flex: '0 0 50%', 
                backgroundColor: 'var(--color-surface-soft)', 
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--spacing-section)',
                borderRight: '1px solid var(--color-hairline)'
            }}>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                    <div style={{ marginBottom: 'var(--spacing-xxl)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: 'var(--rounded-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--color-canvas)', fontWeight: 'bold' }}>K</span>
                            </div>
                            <span className="ds-nav-link" style={{ color: 'var(--color-ink)', fontSize: '18px', fontWeight: '600' }}>
                                Koperasi Internal
                            </span>
                        </div>
                        <h2 className="ds-display-sm" style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Kemudahan Finansial dalam Genggaman
                        </h2>
                        <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>
                            Sistem buku besar digital yang mengotomatisasi pemotongan simpanan dan pinjaman.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        {/* Feature 1 */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface-strong)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="ds-title-sm" style={{ marginBottom: '4px' }}>Pemotongan Gaji Terpusat</h3>
                                <p className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>
                                    Integrasi mulus dengan sistem HR/Payroll untuk autodebet cicilan tiap bulan tanpa perlu transfer manual.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface-strong)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h3 className="ds-title-sm" style={{ marginBottom: '4px' }}>Transparansi Real-time</h3>
                                <p className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>
                                    Akses buku besar mutasi pribadi Anda secara instan. Saldo ter-*update* detik itu juga.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-base)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface-strong)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="ds-title-sm" style={{ marginBottom: '4px' }}>Integritas Keamanan</h3>
                                <p className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>
                                    Proses peninjauan berjenjang memastikan akuntabilitas dana dan pencatatan tak tergoyahkan.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Login Form */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {/* Mobile Header (Hidden on Desktop) */}
                <header className="lg:hidden" style={{ padding: 'var(--spacing-md) var(--spacing-xl)', borderBottom: '1px solid var(--color-hairline)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: 'var(--rounded-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--color-canvas)', fontWeight: 'bold' }}>K</span>
                    </div>
                    <span className="ds-nav-link" style={{ color: 'var(--color-ink)', fontSize: '16px', fontWeight: '600' }}>
                        Koperasi Internal
                    </span>
                </header>

                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h1 className="ds-display-sm" style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)' }}>Masuk</h1>
                            <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Sistem Manajemen Finansial</p>
                        </div>

                        {status && (
                            <div style={{ marginBottom: 'var(--spacing-base)', color: 'var(--color-semantic-up)', fontSize: '14px', fontWeight: '500', textAlign: 'center', padding: 'var(--spacing-sm)', backgroundColor: 'rgba(5, 177, 105, 0.1)', borderRadius: 'var(--rounded-md)' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label htmlFor="identifier" className="ds-label" style={{ color: 'var(--color-muted)' }}>
                                    ALAMAT EMAIL ATAU NIP/NIM
                                </label>
                                <input
                                    id="identifier"
                                    type="text"
                                    name="identifier"
                                    value={data.identifier}
                                    className="ds-text-input"
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="user@instansi.com"
                                    onChange={(e) => setData('identifier', e.target.value)}
                                    style={{ backgroundColor: 'var(--color-surface-soft)' }}
                                />
                                {errors.identifier && (
                                    <p className="ds-error-text">{errors.identifier}</p>
                                )}
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label htmlFor="password" className="ds-label" style={{ color: 'var(--color-muted)' }}>
                                    KATA SANDI
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="ds-text-input"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        style={{ paddingRight: '48px', backgroundColor: 'var(--color-surface-soft)' }}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: 'var(--color-muted)',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="ds-error-text">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="ds-button-primary"
                                disabled={processing}
                                style={{ width: '100%', height: '48px', fontSize: '16px', marginBottom: 'var(--spacing-lg)' }}
                            >
                                Log me in
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}
                                    >
                                        Lupa kata sandi? Klik disini
                                    </Link>
                                )}
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
