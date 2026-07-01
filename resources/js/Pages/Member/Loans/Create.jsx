import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Create({ auth, hasPendingLoan, activeLoan, defaultFee, availableLimit }) {
    const { data, setData, post, processing, errors } = useForm({
        principal_amount: '',
        tenor_years: 1,
        tenor_months: '',
        purpose: '',
        is_custom_tenor: false,
    });

    const [simulation, setSimulation] = useState(null);

    useEffect(() => {
        if (data.principal_amount && (data.tenor_years || data.tenor_months)) {
            let principal = parseFloat(data.principal_amount);
            
            // Top up logic: add active loan remaining principal
            if (activeLoan && activeLoan.current_remaining_principal) {
                principal += parseFloat(activeLoan.current_remaining_principal);
            }

            const activeMonths = 10; // Approx

            let totalTenorMonths = 0;
            let computedTenorYears = 0;

            if (data.is_custom_tenor && data.tenor_months) {
                totalTenorMonths = parseInt(data.tenor_months);
                computedTenorYears = Math.ceil(totalTenorMonths / activeMonths);
            } else if (!data.is_custom_tenor && data.tenor_years) {
                computedTenorYears = parseInt(data.tenor_years);
                totalTenorMonths = computedTenorYears * activeMonths;
            }

            if (principal > 0 && totalTenorMonths > 0) {
                const pokokSebulan = principal / totalTenorMonths;
                const jasaSebulan = principal * (defaultFee / 100);
                const monthly = Math.ceil(pokokSebulan + jasaSebulan);
                
                setSimulation({
                    totalPrincipal: principal,
                    monthly,
                    jasaSebulan,
                    pokokSebulan,
                    computedTenorYears
                });
            } else {
                setSimulation(null);
            }
        } else {
            setSimulation(null);
        }
    }, [data.principal_amount, data.tenor_years, data.tenor_months, data.is_custom_tenor, defaultFee]);

    const submit = (e) => {
        e.preventDefault();
        
        // Before submit, clean up mutually exclusive fields
        const submitData = { ...data };
        if (submitData.is_custom_tenor) {
            submitData.tenor_years = '';
        } else {
            submitData.tenor_months = '';
        }
        
        setData(submitData);
        post(route('member.loans.store'));
    };

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title="Pengajuan Pinjaman">
            <Head title="Pengajuan Pinjaman" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-3">Pengajuan Pinjaman</h2>
                    <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto' }}>
                        Pembayaran cicilan akan otomatis dipotong dari gaji bulanan Anda. Bebas repot, transparan di awal.
                    </p>
                </div>

                {hasPendingLoan ? (
                    <div style={{ backgroundColor: 'white', padding: 'var(--spacing-xl)', borderRadius: 'var(--rounded-lg)', textAlign: 'center', border: '1px solid var(--color-hairline)' }}>
                        <h3 className="ds-title-md" style={{ marginBottom: '8px' }}>Pengajuan Sedang Diproses</h3>
                        <p className="ds-body-sm" style={{ color: 'var(--color-muted)', maxWidth: '400px', margin: '0 auto' }}>
                            Anda memiliki pinjaman yang sedang dalam proses pengajuan. Silakan tunggu hingga proses selesai.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        {activeLoan && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-sm mb-1">Info Top Up Pinjaman</h4>
                                <p className="text-xs">
                                    Anda memiliki pinjaman aktif dengan sisa utang pokok sebesar <strong>Rp {formatRp(activeLoan.current_remaining_principal)}</strong>.
                                    Pengajuan pinjaman baru ini akan digabungkan dengan sisa pinjaman lama (Top Up). Biaya admin akan dikenakan sebesar 1% dari total pinjaman baru.
                                </p>
                            </div>
                        )}

                        {/* Input Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Jumlah Tambahan Pinjaman Baru</label>
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
                                        Batas pinjaman Anda: <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Rp {formatRp(availableLimit * 12)}</span>
                                    </span>
                                    <span style={{ color: 'var(--color-semantic-up)', fontWeight: 600 }}>Tersedia</span>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Pilihan Lama Pinjaman</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[1, 2, 3].map(years => (
                                        <div 
                                            key={years}
                                            onClick={() => { setData('is_custom_tenor', false); setData('tenor_years', years); }}
                                            style={{ 
                                                border: (!data.is_custom_tenor && data.tenor_years === years) ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                                                borderRadius: 'var(--rounded-md)',
                                                padding: '16px 8px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                backgroundColor: (!data.is_custom_tenor && data.tenor_years === years) ? 'var(--color-surface-soft)' : 'white'
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, color: (!data.is_custom_tenor && data.tenor_years === years) ? 'var(--color-primary)' : 'var(--color-ink)', marginBottom: '4px' }}>{years} Tahun</div>
                                            <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Biaya Layanan {defaultFee}% / bln</div>
                                        </div>
                                    ))}
                                    <div 
                                        onClick={() => setData('is_custom_tenor', true)}
                                        style={{ 
                                            border: data.is_custom_tenor ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                                            borderRadius: 'var(--rounded-md)',
                                            padding: '16px 8px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: data.is_custom_tenor ? 'var(--color-surface-soft)' : 'white'
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, color: data.is_custom_tenor ? 'var(--color-primary)' : 'var(--color-ink)', marginBottom: '4px' }}>Custom</div>
                                        <div style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Bulanan</div>
                                    </div>
                                </div>
                                {errors.tenor_years && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginTop: '4px' }}>{errors.tenor_years}</div>}

                                {data.is_custom_tenor && (
                                    <div style={{ marginTop: '16px' }}>
                                        <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Lama Pinjaman Pilihan (Bulan)</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="number"
                                                value={data.tenor_months}
                                                onChange={e => setData('tenor_months', e.target.value)}
                                                required={data.is_custom_tenor}
                                                min="1"
                                                max="60"
                                                style={{ 
                                                    width: '100%', 
                                                    fontFamily: 'var(--font-mono)', 
                                                    fontSize: '16px', 
                                                    padding: '12px 16px', 
                                                    borderRadius: 'var(--rounded-md)', 
                                                    border: '1px solid var(--color-hairline)',
                                                    outline: 'none'
                                                }}
                                                placeholder="Contoh: 6"
                                            />
                                        </div>
                                        {errors.tenor_months && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginTop: '4px' }}>{errors.tenor_months}</div>}
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Keterangan / Keperluan Pinjaman (Opsional)</label>
                                <textarea
                                    value={data.purpose}
                                    onChange={e => setData('purpose', e.target.value)}
                                    style={{ 
                                        width: '100%', 
                                        fontSize: '14px', 
                                        padding: '12px', 
                                        borderRadius: 'var(--rounded-md)', 
                                        border: '1px solid var(--color-hairline)',
                                        outline: 'none',
                                        minHeight: '80px',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Contoh: Biaya pendidikan anak, renovasi rumah..."
                                />
                                {errors.purpose && <div style={{ color: 'var(--color-semantic-down)', fontSize: '12px', marginTop: '4px' }}>{errors.purpose}</div>}
                            </div>
                        </div>

                        {/* Simulasi Card */}
                        {simulation && (
                            <div className="bg-[#1e293b] text-white rounded-xl p-6 sm:p-8 mb-8 shadow-lg border border-slate-700">
                                <h3 className="text-lg font-semibold mb-4 text-white">Simulasi Transparansi</h3>
                                <p className="text-sm text-white/70 mb-6 leading-relaxed">
                                    Total Pokok Pinjaman (Baru + Lama) adalah <strong className="text-white">Rp {formatRp(simulation.totalPrincipal)}</strong>. Dengan tenor <strong className="text-white">{data.is_custom_tenor ? data.tenor_months + ' Bulan' : data.tenor_years + ' Tahun'}</strong>, berikut adalah estimasi total potongan gaji Anda di <strong className="text-white">Tahun Pertama</strong>:
                                </p>

                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-start gap-4 text-sm text-white/80">
                                        <span className="flex-1 leading-snug">Potongan Simpanan Wajib</span>
                                        <span className="font-mono font-medium text-white whitespace-nowrap text-right">Rp {formatRp(auth.user.monthly_simpanan_wajib)}</span>
                                    </div>
                                    <div className="flex justify-between items-start gap-4 text-sm text-white/80">
                                        <span className="flex-1 leading-snug">Cicilan Pokok Pinjaman</span>
                                        <span className="font-mono font-medium text-white whitespace-nowrap text-right">Rp {formatRp(simulation.pokokSebulan)}</span>
                                    </div>
                                    <div className="flex justify-between items-start gap-4 text-sm text-white/80">
                                        <span className="flex-1 leading-snug">Biaya Layanan Pinjaman ({defaultFee}%)</span>
                                        <span className="font-mono font-medium text-white whitespace-nowrap text-right">Rp {formatRp(simulation.jasaSebulan)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-2 sm:gap-4 mt-6 pt-6 border-t border-white/10">
                                    <span className="text-base font-semibold leading-tight text-white">Total Potongan Gaji<br className="hidden sm:block" /> Bulan Depan</span>
                                    <span className="font-mono text-3xl sm:text-4xl font-bold text-[#eab308] whitespace-nowrap">Rp {formatRp(simulation.monthly + Number(auth.user.monthly_simpanan_wajib))}</span>
                                </div>

                                {(simulation.monthly > availableLimit) && (
                                    <div style={{ marginTop: '16px', backgroundColor: 'var(--color-semantic-down)', padding: '12px', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                                        Peringatan: Total cicilan pinjaman ({formatRp(simulation.monthly)}) melebihi sisa plafon potong gaji Anda ({formatRp(availableLimit)}).
                                    </div>
                                )}
                                {(simulation.totalPrincipal > 50000000) && (
                                    <div style={{ marginTop: '16px', backgroundColor: 'var(--color-semantic-down)', padding: '12px', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                                        Peringatan: Total pokok pinjaman ({formatRp(simulation.totalPrincipal)}) melebihi batas maksimal Rp 50.000.000.
                                    </div>
                                )}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={processing || !simulation || (simulation && simulation.monthly > availableLimit) || (simulation && simulation.totalPrincipal > 50000000)}
                            style={{ 
                                width: '100%', 
                                padding: '16px', 
                                backgroundColor: 'var(--color-primary)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '100px',
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: (processing || !simulation || (simulation && simulation.monthly > availableLimit) || (simulation && simulation.totalPrincipal > 50000000)) ? 'not-allowed' : 'pointer',
                                opacity: (processing || !simulation || (simulation && simulation.monthly > availableLimit) || (simulation && simulation.totalPrincipal > 50000000)) ? 0.5 : 1
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
