import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Create({ auth, currentAmount }) {
    const { data, setData, post, processing, errors } = useForm({
        type: 'ubah_nominal',
        amount: 0,
    });

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const submit = (e) => {
        e.preventDefault();
        post(route('member.voluntary-saving-requests.store'));
    };

    return (
        <MemberLayout auth={auth} title="Ajukan Simpanan Sukarela">
            <Head title="Ajukan Simpanan Sukarela" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Simpanan Sukarela</h2>
                    <p className="text-sm text-gray-500">
                        Ajukan perubahan setoran bulanan atau tarik saldo simpanan sukarela Anda.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <form onSubmit={submit}>
                        
                        <div className="flex gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setData('type', 'ubah_nominal')}
                                className={`flex-1 py-3 rounded-lg font-semibold border ${data.type === 'ubah_nominal' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
                            >
                                Ubah Setoran Bulanan
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('type', 'tarik')}
                                className={`flex-1 py-3 rounded-lg font-semibold border ${data.type === 'tarik' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}
                            >
                                Tarik Saldo
                            </button>
                        </div>

                        {data.type === 'ubah_nominal' ? (
                            <>
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
                                            value={data.amount ? formatRp(data.amount) : ''}
                                            onChange={(e) => setData('amount', e.target.value.replace(/\D/g, ''))}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg font-mono text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.amount && (
                                        <p className="text-sm text-red-500 mt-2">{errors.amount}</p>
                                    )}
                                </div>

                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8">
                                    <h4 className="text-sm font-semibold text-blue-800 mb-1">Informasi Total Potongan</h4>
                                    <p className="text-sm text-blue-700">
                                        Jika disetujui, total potongan simpanan Anda (Wajib + Sukarela) setiap bulan menjadi:
                                        <br/>
                                        <strong className="font-mono text-lg mt-1 block">
                                            Rp {formatRp(Number(auth.user.monthly_simpanan_wajib) + Number(data.amount || 0))}
                                        </strong>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 text-center">
                                    <div className="text-sm text-gray-500 font-medium">Total Saldo Sukarela Tersedia</div>
                                    <div className="text-2xl font-bold font-mono text-gray-900 mt-1">Rp {formatRp(auth.user.simpanan_sukarela_balance || 0)}</div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Jumlah Penarikan
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-lg">Rp</span>
                                        <input
                                            type="text"
                                            value={data.amount ? formatRp(data.amount) : ''}
                                            onChange={(e) => setData('amount', e.target.value.replace(/\D/g, ''))}
                                            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg font-mono text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        {errors.amount ? (
                                            <p className="text-sm text-red-500">{errors.amount}</p>
                                        ) : (
                                            <p className="text-xs text-gray-500">Maksimal penarikan: Rp {formatRp(auth.user.simpanan_sukarela_balance || 0)}</p>
                                        )}
                                        <button type="button" className="text-xs text-indigo-600 font-semibold" onClick={() => setData('amount', auth.user.simpanan_sukarela_balance || 0)}>Tarik Semua</button>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full py-4 rounded-full font-semibold text-white transition ${
                                    processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
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
