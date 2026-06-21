import React from 'react';

export default function TreasurerProfile({ user, roleData }) {
    return (
        <div className="space-y-10 sm:space-y-16">
            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Informasi Jabatan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Detail jabatan dan periode kepengurusan Anda.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="bg-white shadow sm:rounded-xl border border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Jabatan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.job_title || 'Bendahara Koperasi'}</dd>
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
                            Akuntabilitas & Log
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Ringkasan performa dan log aktivitas sistem Anda.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">Pinjaman Disetujui/Ditolak</p>
                            <p className="mt-2 text-2xl text-blue-600 font-mono font-bold">{roleData.approved_loans_count || 0}</p>
                        </div>
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">Pencairan Dana</p>
                            <p className="mt-2 text-2xl text-gray-900 font-mono font-bold">{roleData.disbursed_loans_count || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white shadow sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-sm leading-6 font-medium text-gray-900">Log Aktivitas Terbaru</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
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
        </div>
    );
}
