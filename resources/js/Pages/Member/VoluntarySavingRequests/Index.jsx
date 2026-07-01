import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MemberLayout from '@/Layouts/MemberLayout';

export default function Index({ auth, requests }) {
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    return (
        <MemberLayout auth={auth} title="Pengajuan Simpanan Sukarela">
            <Head title="Pengajuan Simpanan Sukarela" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Riwayat Pengajuan Simpanan Sukarela</h2>
                        <p className="text-sm text-gray-500 mt-1">Daftar permintaan perubahan potongan gaji bulanan untuk simpanan sukarela.</p>
                    </div>
                    <Link
                        href={route('member.voluntary-saving-requests.create')}
                        className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        Ajukan Perubahan
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    {requests.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Belum ada riwayat pengajuan.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Tanggal</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Nominal Lama</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Nominal Baru</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(req.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-500 text-right">Rp {formatRp(req.balance_before)}</td>
                                            <td className="px-6 py-4 font-mono text-primary font-semibold text-right">Rp {formatRp(req.new_monthly_amount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    req.status === 'disetujui' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
