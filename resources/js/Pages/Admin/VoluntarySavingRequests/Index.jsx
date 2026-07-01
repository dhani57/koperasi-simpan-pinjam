import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ auth, requests }) {
    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const [confirmConfig, setConfirmConfig] = useState({
        show: false,
        title: '',
        message: '',
        type: 'primary',
        confirmText: 'Setujui',
        actionUrl: null,
    });

    const openConfirm = (title, message, type, confirmText, actionUrl) => {
        setConfirmConfig({
            show: true,
            title,
            message,
            type,
            confirmText,
            actionUrl
        });
    };

    const handleConfirm = () => {
        if (confirmConfig.actionUrl) {
            router.post(confirmConfig.actionUrl);
        }
        setConfirmConfig({ ...confirmConfig, show: false });
    };

    return (
        <AdminLayout auth={auth} title="Persetujuan Simpanan Sukarela">
            <Head title="Persetujuan Simpanan Sukarela" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Persetujuan Perubahan Simpanan Sukarela</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola daftar pengajuan perubahan nominal simpanan sukarela dari anggota.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {requests.data.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Tidak ada pengajuan yang perlu diproses.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Tanggal Pengajuan</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Anggota</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Nominal Lama</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-right">Nominal Baru</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.data.map(req => (
                                        <tr key={req.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(req.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{req.user?.name}</div>
                                                <div className="text-xs text-gray-500">{req.user?.identity_number}</div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-right text-gray-500">Rp {formatRp(req.balance_before)}</td>
                                            <td className="px-6 py-4 font-mono text-right text-primary font-semibold">Rp {formatRp(req.new_monthly_amount)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    req.status === 'disetujui' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {req.status === 'menunggu' && auth.user.role === 'bendahara' && (
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => openConfirm('Setujui Pengajuan', `Yakin menyetujui perubahan simpanan sukarela untuk ${req.user?.name} menjadi Rp ${formatRp(req.new_monthly_amount)}?`, 'primary', 'Setujui', route('admin.voluntary_saving_requests.approve', req.id))}
                                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-semibold transition"
                                                        >
                                                            Setujui
                                                        </button>
                                                        <button 
                                                            onClick={() => openConfirm('Tolak Pengajuan', `Yakin menolak perubahan simpanan sukarela untuk ${req.user?.name}?`, 'danger', 'Tolak', route('admin.voluntary_saving_requests.reject', req.id))}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs font-semibold transition"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </div>
                                                )}
                                                {req.status !== 'menunggu' && (
                                                    <span className="text-gray-400 text-xs italic">Selesai</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination placeholder (if paginated) */}
            </div>

            <ConfirmModal 
                show={confirmConfig.show}
                onClose={() => setConfirmConfig({ ...confirmConfig, show: false })}
                onConfirm={handleConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
            />
        </AdminLayout>
    );
}
