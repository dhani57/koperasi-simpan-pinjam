import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        identifier: '',
        password: '',
        remember: false,
    });

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
                <div className="ds-product-ui-card-light" style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <h1 className="ds-title-md" style={{ fontSize: '24px', marginBottom: 'var(--spacing-xs)' }}>Masuk ke Akun</h1>
                        <p className="ds-body-md" style={{ color: 'var(--color-muted)' }}>Gunakan Email atau NIP/NIM yang terdaftar</p>
                    </div>

                    {status && (
                        <div style={{ marginBottom: 'var(--spacing-base)', color: 'var(--color-semantic-up)', fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
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
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="ds-text-input"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <p className="ds-error-text">{errors.password}</p>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    style={{ borderRadius: 'var(--rounded-xs)', border: '1px solid var(--color-hairline)', width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                                />
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)' }}>
                                    Ingat saya
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none' }}
                                >
                                    Lupa sandi?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="ds-button-primary"
                            disabled={processing}
                            style={{ width: '100%' }}
                        >
                            Masuk Sekarang
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
