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
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-canvas)', position: 'relative', overflow: 'hidden' }}>
            <Head title="Log in" />

            {/* Background Decorative Blobs for whole screen to reduce stiffness */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(11,94,168,0.03) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', right: '20%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(11,94,168,0.04) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>

            {/* Left Pane - Information (Hidden on small screens) */}
            <div className="hidden lg:flex" style={{ 
                flex: '0 0 45%', 
                backgroundColor: 'var(--color-surface-dark)', 
                color: 'var(--color-on-dark)',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--spacing-section)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Curved Separator SVG overlapping to the right */}
                <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none" 
                    style={{ 
                        position: 'absolute', 
                        top: 0, 
                        right: '-99px', 
                        height: '100%', 
                        width: '100px', 
                        fill: 'var(--color-surface-dark)',
                        zIndex: -1
                    }}
                >
                    <path d="M0,0 C100,20 100,80 0,100 Z" />
                </svg>

                {/* Decorative floating elements in left pane */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '120px', height: '120px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                <div style={{ position: 'absolute', top: '40%', right: '5%', width: '60px', height: '60px', border: '2px solid rgba(255,255,255,0.05)', borderRadius: '12px', transform: 'rotate(15deg)', pointerEvents: 'none' }}></div>

                <div style={{ maxWidth: '480px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                    <div style={{ marginBottom: 'var(--spacing-xxl)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xl)', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--rounded-full)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '14px' }}>K</span>
                            </div>
                            <span style={{ color: 'var(--color-on-dark)', fontSize: '16px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                Koperasi Internal
                            </span>
                        </div>
                        <h2 className="ds-display-sm" style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-on-dark)', lineHeight: '1.2' }}>
                            Platform Finansial<br/>Generasi Baru.
                        </h2>
                        <p className="ds-body-md" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '400px' }}>
                            Sistem terintegrasi yang membebaskan Anda dari administrasi manual dan memberikan transparansi penuh.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                        {/* Feature 1 */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-canvas)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="ds-title-sm" style={{ marginBottom: '6px', color: 'var(--color-on-dark)', fontSize: '16px' }}>Otomatisasi Payroll</h3>
                                <p className="ds-body-sm" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                                    Cicilan dan simpanan wajib langsung terdebet dari gaji bulanan tanpa perlu konfirmasi manual.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.08)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-canvas)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h3 className="ds-title-sm" style={{ marginBottom: '6px', color: 'var(--color-on-dark)', fontSize: '16px' }}>Visibilitas Real-time</h3>
                                <p className="ds-body-sm" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                                    Lacak pergerakan dana, sisa pinjaman, dan akumulasi simpanan Anda secara langsung.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Login Form */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
                    <div style={{ width: '100%', maxWidth: '400px', marginLeft: '5%' }}>
                        
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '16px', marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                            </div>
                            <h1 className="ds-display-sm" style={{ fontSize: '32px', marginBottom: 'var(--spacing-xs)', color: 'var(--color-ink)' }}>Selamat Datang</h1>
                            <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Silakan masuk ke akun Anda untuk melanjutkan.</p>
                        </div>

                        {status && (
                            <div style={{ marginBottom: 'var(--spacing-base)', color: 'var(--color-semantic-up)', fontSize: '14px', fontWeight: '500', textAlign: 'center', padding: 'var(--spacing-sm)', backgroundColor: 'rgba(5, 177, 105, 0.1)', borderRadius: 'var(--rounded-md)' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label htmlFor="identifier" className="ds-label" style={{ color: 'var(--color-muted)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                    ALAMAT EMAIL / NIP
                                </label>
                                <input
                                    id="identifier"
                                    type="text"
                                    name="identifier"
                                    value={data.identifier}
                                    className="ds-text-input"
                                    autoComplete="username"
                                    autoFocus
                                    placeholder="Misal: user@instansi.com"
                                    onChange={(e) => setData('identifier', e.target.value)}
                                    style={{ 
                                        backgroundColor: 'var(--color-canvas)', 
                                        borderColor: 'var(--color-hairline)',
                                        padding: '16px',
                                        height: '52px',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                />
                                {errors.identifier && (
                                    <p className="ds-error-text">{errors.identifier}</p>
                                )}
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label htmlFor="password" className="ds-label" style={{ color: 'var(--color-muted)', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>
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
                                        onChange={(e) => setData('password', e.target.value)}
                                        style={{ 
                                            backgroundColor: 'var(--color-canvas)', 
                                            borderColor: 'var(--color-hairline)',
                                            padding: '16px',
                                            paddingRight: '50px',
                                            height: '52px',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '16px',
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
                                style={{ width: '100%', height: '52px', fontSize: '16px', marginBottom: 'var(--spacing-lg)', boxShadow: '0 4px 12px rgba(11,94,168,0.2)' }}
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
