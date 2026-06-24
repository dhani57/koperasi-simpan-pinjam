import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminProfile({ user, roleData }) {
    return (
        <div className="space-y-10 sm:space-y-16">
            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Informasi Jabatan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Detail jabatan Admin dan periode kepengurusan.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="bg-white shadow sm:rounded-xl border border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Jabatan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.job_title || 'Pengurus/Admin Koperasi'}</dd>
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
                            Parameter Sistem & Log
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Ringkasan parameter yang aktif dan log perubahannya.
                        </p>
                        <div className="mt-4">
                            <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Kelola Parameter &rarr;</Link>
                        </div>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roleData.active_parameters && roleData.active_parameters.length > 0 ? (
                            roleData.active_parameters.map(setting => {
                                const formatValue = (val, type) => {
                                    if (type === 'integer') return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
                                    if (type === 'float') return `${val}%`;
                                    if (type === 'json') {
                                        try { return JSON.parse(val).join(', '); } catch { return val; }
                                    }
                                    if (type === 'string' && val === 'total_mutation_amount') return 'Total Mutasi';
                                    return val;
                                };

                                return (
                                    <div key={setting.id} className="p-5 bg-white shadow sm:rounded-xl border border-gray-200 flex flex-col justify-between">
                                        <p className="text-sm font-medium text-gray-500 line-clamp-2" title={setting.description || setting.key}>
                                            {setting.description || setting.key}
                                        </p>
                                        <p className="mt-3 text-sm text-gray-900 font-medium">
                                            {formatValue(setting.value, setting.type)}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200 col-span-1 sm:col-span-2 text-center text-gray-500 text-sm">
                                Belum ada parameter yang dikonfigurasi.
                            </div>
                        )}
                    </div>

                    <div className="bg-white shadow sm:rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-sm leading-6 font-medium text-gray-900">Log Perubahan Parameter (Oleh Anda)</h3>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perubahan</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roleData.activity_logs && roleData.activity_logs.filter(log => log.activity_type === 'parameter_change').length > 0 ? (
                                    roleData.activity_logs.filter(log => log.activity_type === 'parameter_change').map((log) => (
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
                                            Belum ada perubahan parameter yang Anda lakukan.
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
