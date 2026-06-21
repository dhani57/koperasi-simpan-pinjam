import React from 'react';

export default function AuditorProfile({ user, roleData }) {
    return (
        <div className="space-y-10 sm:space-y-16">
            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Informasi Jabatan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Detail jabatan Pengawas dan periode kepengurusan Anda.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="bg-white shadow sm:rounded-xl border border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Jabatan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.job_title || 'Pengawas Koperasi'}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Periode Jabatan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user.job_start_date ? new Date(user.job_start_date).toLocaleDateString() : '-'} s/d {user.job_end_date ? new Date(user.job_end_date).toLocaleDateString() : 'Sekarang'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200"></div>
                </div>
            </div>

            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Cakupan & Log Audit
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Hak akses Anda dan riwayat aktivitas audit sistem.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Cakupan Akses Audit (Read-Only)</h4>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                            <li><strong>Mutasi:</strong> Histori transaksi seluruh anggota</li>
                            <li><strong>Rincian Potongan:</strong> Status tagihan bulanan anggota</li>
                            <li><strong>Riwayat Jasa Tahunan:</strong> Dasar perhitungan jasa pinjaman menurun per tahun</li>
                        </ul>
                        <p className="mt-4 text-xs text-gray-500 italic border-t border-gray-200 pt-3">
                            * Catatan: Seluruh akses Pengawas di atas bersifat immutable view untuk menjaga independensi audit.
                        </p>
                    </div>

                    <div className="bg-white shadow sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-sm leading-6 font-medium text-gray-900">Log Waktu Akses Audit Anda</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
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
        </div>
    );
}
