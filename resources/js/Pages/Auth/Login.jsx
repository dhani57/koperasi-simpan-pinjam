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
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-surface-soft)' }}>
            <Head title="Log in" />

            {/* Top Nav (Simplified for Login Page) */}
            <header className="ds-top-nav-unila">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>K</span>
                    </div>
                    <span className="ds-nav-link" style={{ color: 'var(--color-canvas)', fontSize: '18px' }}>
                        Koperasi Simpan Pinjam
                    </span>
                </div>
                <Link href="/" className="ds-nav-link" style={{ color: 'var(--color-canvas)', opacity: 0.8 }}>
                    Kembali ke Beranda
                </Link>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
                <div className="ds-product-ui-card-light" style={{ width: '100%', maxWidth: '440px', position: 'relative', overflow: 'hidden' }}>
                    {/* Subtle Enterprise Top Border Accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: 'var(--color-primary)' }}></div>

                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', marginTop: 'var(--spacing-xs)' }}>
                        <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--color-surface-strong)', borderRadius: 'var(--rounded-lg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </div>
                        <h1 className="ds-title-md" style={{ fontSize: '24px', marginBottom: 'var(--spacing-xs)' }}>Masuk ke Akun</h1>
                        <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Sistem Manajemen Finansial Internal</p>
                    </div>

                    {status && (
                        <div style={{ marginBottom: 'var(--spacing-base)', color: 'var(--color-semantic-up)', fontSize: '14px', fontWeight: '500', textAlign: 'center', padding: 'var(--spacing-sm)', backgroundColor: 'rgba(5, 177, 105, 0.1)', borderRadius: 'var(--rounded-md)' }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label htmlFor="identifier" className="ds-label">
                                Email atau NIP/NIM
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                name="identifier"
                                value={data.identifier}
                                className="ds-text-input"
                                autoComplete="username"
                                autoFocus
                                placeholder="Masukkan identitas Anda"
                                onChange={(e) => setData('identifier', e.target.value)}
                            />
                            {errors.identifier && (
                                <p className="ds-error-text">{errors.identifier}</p>
                            )}
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label htmlFor="password" className="ds-label">
                                Kata Sandi
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    className="ds-text-input"
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi"
                                    style={{ paddingRight: '48px' }}
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

                        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    style={{ borderRadius: 'var(--rounded-xs)', border: '1px solid var(--color-hairline)', width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)' }}>
                                    Ingat perangkat ini
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '500' }}
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="ds-button-primary"
                            disabled={processing}
                            style={{ width: '100%', height: '48px', fontSize: '16px' }}
                        >
                            Masuk ke Sistem
                        </button>
                    </form>
                </div>
                
                {/* Footer legal note for enterprise feel */}
                <div style={{ position: 'absolute', bottom: 'var(--spacing-xl)', textAlign: 'center', width: '100%' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-muted-soft)' }}>
                        Akses sistem ini dilindungi dan dimonitor secara ketat.
                    </p>
                </div>
            </main>
        </div>
    );
}
