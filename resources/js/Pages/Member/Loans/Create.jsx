import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Create({ auth, hasActiveLoan, defaultFee, availableLimit }) {
    const { data, setData, post, processing, errors } = useForm({
        principal_amount: '',
        tenor_months: 3,
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
                    totalRepayment,
                    jasaSebulan: principal * (defaultFee / 100),
                    pokokSebulan: principal / tenor
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

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title="Pengajuan Pinjaman">
            <Head title="Pengajuan Pinjaman" />

            <div style={{ maxWidth: '640px', margin: '0 auto', padding: 'var(--spacing-xl) 0' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h2 className="ds-display-mega" style={{ fontSize: '32px', letterSpacing: '-0.5px', marginBottom: '12px' }}>Pengajuan Pinjaman</h2>
                    <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
                        Pembayaran cicilan akan otomatis dipotong dari gaji bulanan Anda. Bebas repot, transparan di awal.
                    </p>
                </div>

                {hasActiveLoan ? (
                    <div style={{ backgroundColor: 'white', padding: 'var(--spacing-xl)', borderRadius: 'var(--rounded-lg)', textAlign: 'center', border: '1px solid var(--color-hairline)' }}>
                        <h3 className="ds-title-md" style={{ marginBottom: '8px' }}>Pengajuan Terkunci</h3>
                        <p className="ds-body-sm" style={{ color: 'var(--color-muted)', maxWidth: '400px', margin: '0 auto' }}>
                            Anda masih memiliki pinjaman aktif atau dalam proses pengajuan. Silakan lunasi pinjaman sebelumnya terlebih dahulu.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        {/* Input Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Nominal Pinjaman</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--color-muted)' }}>Rp</span>
                                    <input
                                        type="text"
                                        value={data.principal_amount ? new Intl.NumberFormat('id-ID').format(data.principal_amount) : ''}
                                        onChange={e => setData('principal_amount', e.target.value.replace(/\D/g, ''))}
                                        required
                                        min="100000"
                                        style={{ 
                                            width: '100%', 
                                            fontFamily: 'var(--font-mono)', 
                                            fontSize: '18px', 
                                            padding: '16px 16px 16px 48px', 
                                            borderRadius: 'var(--rounded-md)', 
                                            border: '1px solid var(--color-hairline)',
                                            outline: 'none'
                                        }}
                                        placeholder="0"
                                    />
                                </div>
                                {errors.principal_amount && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginTop: '4px' }}>{errors.principal_amount}</div>}
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--color-muted)' }}>
                                        Plafon maksimal Anda: <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Rp {formatRp(availableLimit * 12)}</span>
                                    </span>
                                    <span style={{ color: 'var(--color-semantic-up)', fontWeight: 600 }}>Tersedia</span>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Pilihan Tenor (Bulan)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                    {[3, 6, 12].map(months => (
                                        <div 
                                            key={months}
                                            onClick={() => setData('tenor_months', months)}
                                            style={{ 
                                                border: data.tenor_months === months ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                                                borderRadius: 'var(--rounded-md)',
                                                padding: '16px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: data.tenor_months === months ? 'var(--color-surface-soft)' : 'white'
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, color: data.tenor_months === months ? 'var(--color-primary)' : 'var(--color-ink)', marginBottom: '4px' }}>{months} Bulan</div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Jasa {defaultFee}% / bln</div>
                                        </div>
                                    ))}
                                </div>
                                {errors.tenor_months && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginTop: '4px' }}>{errors.tenor_months}</div>}
                            </div>
                        </div>

                        {/* Simulasi Card */}
                        {simulation && (
                            <div style={{ backgroundColor: 'var(--color-surface-dark)', color: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Simulasi Transparansi</h3>
                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: '1.5' }}>
                                    Jika Anda meminjam <strong style={{ color: 'white' }}>Rp {formatRp(data.principal_amount)}</strong> selama <strong style={{ color: 'white' }}>{data.tenor_months} Bulan</strong>, berikut adalah estimasi total potongan gaji Anda bulan depan:
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                                        <span>Potongan Simpanan Wajib (Rutin)</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'white' }}>Rp {formatRp(auth.user.monthly_saving_nominal)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                                        <span>Cicilan Pokok Pinjaman Baru</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'white' }}>Rp {formatRp(simulation.pokokSebulan)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                                        <span>Jasa Pinjaman ({defaultFee}%)</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'white' }}>Rp {formatRp(simulation.jasaSebulan)}</span>
                                    </div>
                                </div>

                                <div style={{ margin: '24px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 600 }}>Total Potongan Gaji Bulan Depan</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>Rp {formatRp(simulation.monthly + Number(auth.user.monthly_saving_nominal))}</span>
                                </div>

                                {(simulation.monthly > availableLimit) && (
                                    <div style={{ marginTop: '16px', backgroundColor: 'var(--color-semantic-down)', padding: '12px', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                                        Peringatan: Total cicilan ({formatRp(simulation.monthly)}) melebihi sisa plafon potong gaji Anda ({formatRp(availableLimit)}).
                                    </div>
                                )}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={processing || !simulation || (simulation && simulation.monthly > availableLimit)}
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: 'var(--color-primary)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '100px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: (processing || !simulation || (simulation && simulation.monthly > availableLimit)) ? 'not-allowed' : 'pointer',
                                opacity: (processing || !simulation || (simulation && simulation.monthly > availableLimit)) ? 0.5 : 1
                            }}
                        >
                            {processing ? 'Memproses...' : 'Ajukan Pinjaman & Setujui Potong Gaji'}
                        </button>

                        <Link 
                            href={route('member.loans.index')}
                            style={{ 
                                display: 'block',
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: 'transparent', 
                                color: 'var(--color-ink)', 
                                border: '1px solid var(--color-hairline)', 
                                borderRadius: '100px',
                                fontSize: '16px',
                                fontWeight: 600,
                                textAlign: 'center',
                                marginTop: '12px',
                                textDecoration: 'none',
                                boxSizing: 'border-box'
                            }}
                        >
                            Batal & Kembali
                        </Link>

                        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'var(--color-muted)' }}>
                            Dengan menekan tombol di atas, Anda menyetujui pemotongan gaji bulanan otomatis untuk pelunasan pinjaman. Dana akan ditransfer ke rekening Anda setelah disetujui oleh admin.
                        </div>
                    </form>
                )}
            </div>
        </MemberLayout>
    );
}
