import React from 'react';

export default function AuditorProfile({ user, roleData }) {
    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900 ds-typography-title-lg">
                    Informasi Jabatan & Cakupan Audit
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Detail jabatan Pengawas dan riwayat aktivitas audit Anda di sistem.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">{user.job_title || 'Pengawas Koperasi'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Periode Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">
                        {user.job_start_date ? new Date(user.job_start_date).toLocaleDateString() : '-'} s/d {user.job_end_date ? new Date(user.job_end_date).toLocaleDateString() : 'Sekarang'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Cakupan Akses Audit</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                        <li><strong>Mutasi:</strong> Histori transaksi seluruh anggota</li>
                        <li><strong>Rincian Potongan:</strong> Status tagihan bulanan anggota</li>
                        <li><strong>Riwayat Jasa Tahunan:</strong> Dasar perhitungan jasa pinjaman menurun per tahun</li>
                    </ul>
                    <p className="mt-3 text-xs text-gray-500 italic">
                        * Catatan: Seluruh akses Pengawas di atas bersifat read-only (immutable view) untuk menjaga independensi audit.
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Log Waktu Akses Audit Anda</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu Akses</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modul yang Diaudit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roleData.activity_logs && roleData.activity_logs.filter(log => log.activity_type === 'audit_access').length > 0 ? (
                                roleData.activity_logs.filter(log => log.activity_type === 'audit_access').map((log) => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.created_at).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {log.description}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Belum ada data akses audit tercatat.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
