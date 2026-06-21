import React from 'react';
import { Link } from '@inertiajs/react';

export default function AdminProfile({ user, roleData }) {
    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900 ds-typography-title-lg">
                    Informasi Jabatan & Parameter
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Detail jabatan Admin dan ringkasan parameter sistem yang dikelola.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">{user.job_title || 'Pengurus/Admin Koperasi'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Periode Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">
                        {user.job_start_date ? new Date(user.job_start_date).toLocaleDateString() : '-'} s/d {user.job_end_date ? new Date(user.job_end_date).toLocaleDateString() : 'Sekarang'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-900">Ringkasan Parameter Aktif</h3>
                    <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Kelola Parameter &rarr;</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleData.active_parameters && roleData.active_parameters.length > 0 ? (
                        roleData.active_parameters.map(setting => (
                            <div key={setting.id} className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                                <p className="text-sm font-medium text-gray-500">{setting.name}</p>
                                <p className="mt-2 text-xl text-gray-900 font-mono font-bold">{setting.value}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 border border-gray-200 rounded-xl ds-feature-card col-span-2 text-center text-gray-500 text-sm">
                            Belum ada parameter yang dikonfigurasi.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Log Perubahan Parameter (Oleh Anda)</h3>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
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
    );
}
