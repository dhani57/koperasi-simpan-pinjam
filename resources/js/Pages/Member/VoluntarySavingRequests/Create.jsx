import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Create({ auth, currentAmount }) {
    const { data, setData, post, processing, errors } = useForm({
        proposed_amount: currentAmount || 0,
    });

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const submit = (e) => {
        e.preventDefault();
        post(route('member.voluntary-saving-requests.store'));
    };

    return (
        <MemberLayout auth={auth} title="Ajukan Perubahan Simpanan Sukarela">
            <Head title="Ajukan Perubahan Simpanan Sukarela" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ubah Nominal Simpanan Sukarela</h2>
                    <p className="text-sm text-gray-500">
                        Sesuaikan potongan gaji bulanan Anda untuk simpanan sukarela. Pengajuan ini memerlukan persetujuan dari bendahara.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <form onSubmit={submit}>
                        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 flex justify-between items-center">
                            <div>
                                <div className="text-sm text-gray-500 font-medium">Nominal Saat Ini</div>
                                <div className="text-xl font-bold font-mono text-gray-900 mt-1">Rp {formatRp(currentAmount)}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500 font-medium">Simpanan Wajib (Tetap)</div>
                                <div className="text-xl font-bold font-mono text-gray-900 mt-1">Rp {formatRp(auth.user.monthly_simpanan_wajib)}</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nominal Simpanan Sukarela Baru (per Bulan)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">Rp</span>
                                <input
                                    type="text"
                                    value={data.proposed_amount ? formatRp(data.proposed_amount) : ''}
                                    onChange={(e) => setData('proposed_amount', e.target.value.replace(/\D/g, ''))}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg font-mono text-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                    placeholder="0"
                                />
                            </div>
                            {errors.proposed_amount && (
                                <p className="text-sm text-red-500 mt-2">{errors.proposed_amount}</p>
                            )}
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8">
                            <h4 className="text-sm font-semibold text-blue-800 mb-1">Informasi Total Potongan</h4>
                            <p className="text-sm text-blue-700">
                                Jika disetujui, total potongan simpanan Anda (Wajib + Sukarela) setiap bulan menjadi:
                                <br/>
                                <strong className="font-mono text-lg mt-1 block">
                                    Rp {formatRp(Number(auth.user.monthly_simpanan_wajib) + Number(data.proposed_amount || 0))}
                                </strong>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing || Number(data.proposed_amount) === Number(currentAmount)}
                                className={`w-full py-4 rounded-full font-semibold text-white transition ${
                                    (processing || Number(data.proposed_amount) === Number(currentAmount)) 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-primary hover:bg-primary-dark'
                                }`}
                                style={{ backgroundColor: (processing || Number(data.proposed_amount) === Number(currentAmount)) ? undefined : 'var(--color-primary)' }}
                            >
                                {processing ? 'Memproses...' : 'Kirim Pengajuan'}
                            </button>
                            
                            <Link
                                href={route('member.voluntary-saving-requests.index')}
                                className="w-full py-4 rounded-full font-semibold text-gray-700 border border-gray-300 text-center hover:bg-gray-50 transition"
                            >
                                Batal & Kembali
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MemberLayout>
    );
}
