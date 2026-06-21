import React from 'react';

export default function TreasurerProfile({ user, roleData }) {
    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900 ds-typography-title-lg">
                    Informasi Jabatan & Akuntabilitas
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Detail jabatan Bendahara dan log aktivitas sistem Anda.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">{user.job_title || 'Bendahara Koperasi'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Periode Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">
                        {user.job_start_date ? new Date(user.job_start_date).toLocaleDateString() : '-'} s/d {user.job_end_date ? new Date(user.job_end_date).toLocaleDateString() : 'Sekarang'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Ringkasan Aktivitas (Bulan Ini)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">Pinjaman Disetujui/Ditolak</p>
                        <p className="mt-2 text-2xl text-blue-600 font-mono font-bold">{roleData.approved_loans_count || 0}</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">Pencairan Dana</p>
                        <p className="mt-2 text-2xl text-gray-900 font-mono font-bold">{roleData.disbursed_loans_count || 0}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Log Aktivitas Terbaru</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aktivitas</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roleData.activity_logs && roleData.activity_logs.length > 0 ? (
                                roleData.activity_logs.map((log) => (
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
                                        Belum ada aktivitas.
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
