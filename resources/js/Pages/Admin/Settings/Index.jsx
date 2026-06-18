import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';

export default function Index({ auth, settings }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        default_monthly_saving: settings?.default_monthly_saving || '100000',
        default_salary_limit: settings?.default_salary_limit || '2000000',
        loan_interest_rate: settings?.loan_interest_rate || '1.5',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.store'));
    };

    return (
        <AdminLayout auth={auth} title="Parameter Sistem">
            <Head title="Parameter Sistem" />

            <form onSubmit={submit} className="max-w-4xl space-y-8">
                
                {/* Parameter Anggota */}
                <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '32px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-ink)' }}>Parameter Anggota</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>Pengaturan *default* untuk anggota koperasi baru.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="default_monthly_saving" value="Simpanan Rutin Default (Rp)" />
                            <TextInput
                                id="default_monthly_saving"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.default_monthly_saving}
                                onChange={(e) => setData('default_monthly_saving', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.default_monthly_saving} />
                        </div>

                        <div>
                            <InputLabel htmlFor="default_salary_limit" value="Limit Maksimal Potongan Gaji (Rp)" />
                            <TextInput
                                id="default_salary_limit"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.default_salary_limit}
                                onChange={(e) => setData('default_salary_limit', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.default_salary_limit} />
                        </div>
                    </div>
                </div>

                {/* Parameter Pinjaman */}
                <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-xl)', padding: '32px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-ink)' }}>Parameter Pinjaman</h2>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>Pengaturan perhitungan jasa (bunga) untuk pengajuan pinjaman.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div>
                            <InputLabel htmlFor="loan_interest_rate" value="Persentase Jasa Pinjaman (% per bulan)" />
                            <div className="relative mt-1">
                                <TextInput
                                    id="loan_interest_rate"
                                    type="number"
                                    step="0.1"
                                    className="block w-full pr-10"
                                    value={data.loan_interest_rate}
                                    onChange={(e) => setData('loan_interest_rate', e.target.value)}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">%</span>
                                </div>
                            </div>
                            <InputError className="mt-2" message={errors.loan_interest_rate} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0' }}>
                    <ButtonPrimary disabled={processing} type="submit">
                        Simpan Perubahan
                    </ButtonPrimary>

                    {recentlySuccessful && (
                        <p style={{ color: 'var(--color-semantic-up)', fontSize: '14px', fontWeight: 500, margin: 0 }}>
                            Berhasil disimpan.
                        </p>
                    )}
                </div>
            </form>
        </AdminLayout>
    );
}
