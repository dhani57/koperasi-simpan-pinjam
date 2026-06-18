import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Create({ auth, hasActiveLoan, defaultFee, availableLimit }) {
    const { data, setData, post, processing, errors } = useForm({
        principal_amount: '',
        tenor_months: 12,
    });

    const [simulation, setSimulation] = useState(null);

    useEffect(() => {
        if (data.principal_amount && data.tenor_months) {
            const principal = parseFloat(data.principal_amount);
            const tenor = parseInt(data.tenor_months);
            if (principal > 0 && tenor > 0) {
                const totalFee = principal * (defaultFee / 100) * tenor;
                const totalRepayment = principal + totalFee;
                const monthly = Math.ceil(totalRepayment / tenor);
                setSimulation({
                    monthly,
                    totalFee,
                    totalRepayment
                });
            } else {
                setSimulation(null);
            }
        } else {
            setSimulation(null);
        }
    }, [data.principal_amount, data.tenor_months, defaultFee]);

    const submit = (e) => {
        e.preventDefault();
        post(route('member.loans.store'));
    };

    return (
        <MemberLayout auth={auth} title="Ajukan Pinjaman">
            <Head title="Ajukan Pinjaman" />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <Link href={route('member.loans.index')} style={{ color: 'var(--color-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: 'var(--spacing-md)' }}>
                        &larr; Kembali
                    </Link>
                    <h2 className="ds-title-lg">Ajukan Pinjaman</h2>
                    <p className="ds-body-sm" style={{ color: 'var(--color-muted)', marginTop: '4px' }}>Simulasikan cicilan Anda sebelum mengajukan pinjaman.</p>
                </div>

                {hasActiveLoan ? (
                    <div style={{ backgroundColor: 'var(--color-surface-soft)', padding: 'var(--spacing-xl)', borderRadius: 'var(--rounded-lg)', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-surface-strong)', color: 'var(--color-ink)', marginBottom: 'var(--spacing-md)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <h3 className="ds-title-md" style={{ marginBottom: '8px' }}>Pengajuan Terkunci</h3>
                        <p className="ds-body-sm" style={{ color: 'var(--color-muted)', maxWidth: '400px', margin: '0 auto' }}>
                            Anda masih memiliki pinjaman aktif atau dalam proses pengajuan. Silakan lunasi pinjaman sebelumnya terlebih dahulu.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 'var(--spacing-xl)', gridTemplateColumns: 'repeat(12, 1fr)' }}>
                        <div className="col-span-12 md:col-span-7" style={{ backgroundColor: 'var(--color-canvas)', padding: 'var(--spacing-xl)', borderRadius: 'var(--rounded-lg)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <form onSubmit={submit}>
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <label className="ds-body-sm" style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Pokok Pinjaman (Rp)</label>
                                    <input
                                        type="number"
                                        className="ds-text-input"
                                        value={data.principal_amount}
                                        onChange={e => setData('principal_amount', e.target.value)}
                                        placeholder="Contoh: 5000000"
                                        min="100000"
                                        required
                                        style={{ width: '100%' }}
                                    />
                                    {errors.principal_amount && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.principal_amount}</div>}
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                    <label className="ds-body-sm" style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Tenor (Bulan)</label>
                                    <select
                                        className="ds-text-input"
                                        value={data.tenor_months}
                                        onChange={e => setData('tenor_months', e.target.value)}
                                        required
                                        style={{ width: '100%' }}
                                    >
                                        <option value="3">3 Bulan</option>
                                        <option value="6">6 Bulan</option>
                                        <option value="12">12 Bulan</option>
                                        <option value="24">24 Bulan</option>
                                        <option value="36">36 Bulan</option>
                                    </select>
                                    {errors.tenor_months && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.tenor_months}</div>}
                                </div>

                                <button 
                                    type="submit"
                                    className="ds-button-pill-cta"
                                    disabled={processing || (simulation && simulation.monthly > availableLimit)}
                                    style={{ 
                                        width: '100%', 
                                        justifyContent: 'center',
                                        opacity: (processing || (simulation && simulation.monthly > availableLimit)) ? 0.5 : 1
                                    }}
                                >
                                    {processing ? 'Memproses...' : 'Ajukan Sekarang'}
                                </button>
                            </form>
                        </div>

                        <div className="col-span-12 md:col-span-5">
                            <div style={{ backgroundColor: 'var(--color-surface-soft)', padding: 'var(--spacing-lg)', borderRadius: 'var(--rounded-lg)' }}>
                                <h3 className="ds-title-sm" style={{ marginBottom: 'var(--spacing-md)' }}>Simulasi Pinjaman</h3>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span style={{ color: 'var(--color-muted)' }}>Jasa Koperasi:</span>
                                    <span style={{ fontWeight: 600 }}>{defaultFee}% / bln</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                    <span style={{ color: 'var(--color-muted)' }}>Plafon Potongan Gaji:</span>
                                    <span style={{ fontWeight: 600, color: 'var(--color-semantic-up)' }}>Rp {new Intl.NumberFormat('id-ID').format(availableLimit)}</span>
                                </div>

                                <div style={{ margin: 'var(--spacing-md) 0', borderTop: '1px solid var(--color-hairline)' }}></div>

                                {simulation ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                            <span style={{ color: 'var(--color-muted)' }}>Total Jasa:</span>
                                            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Rp {new Intl.NumberFormat('id-ID').format(simulation.totalFee)}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                            <span style={{ color: 'var(--color-muted)' }}>Total Pengembalian:</span>
                                            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>Rp {new Intl.NumberFormat('id-ID').format(simulation.totalRepayment)}</span>
                                        </div>
                                        
                                        <div style={{ 
                                            marginTop: 'var(--spacing-md)', 
                                            padding: 'var(--spacing-md)', 
                                            backgroundColor: simulation.monthly > availableLimit ? 'var(--color-semantic-down)' : 'var(--color-surface-dark)', 
                                            color: 'white', 
                                            borderRadius: 'var(--rounded-md)',
                                            textAlign: 'center'
                                        }}>
                                            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Estimasi Cicilan per Bulan</div>
                                            <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                                                Rp {new Intl.NumberFormat('id-ID').format(simulation.monthly)}
                                            </div>
                                            {simulation.monthly > availableLimit && (
                                                <div style={{ fontSize: '11px', marginTop: '8px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px', borderRadius: '4px' }}>
                                                    Melebihi sisa plafon gaji Anda!
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0', color: 'var(--color-muted)', fontSize: '14px' }}>
                                        Masukkan pokok pinjaman untuk melihat simulasi.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MemberLayout>
    );
}
