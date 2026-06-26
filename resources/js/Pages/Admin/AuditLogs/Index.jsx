import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, logs, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        if (search === (filters?.search || '')) return;
        
        const delayDebounceFn = setTimeout(() => {
            router.get(
                route('admin.audit-logs.index'),
                { search },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, filters?.search]);

    const formatActivityType = (type) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Audit Log Sistem</h2>}
        >
            <Head title="Audit Log Sistem" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header & Filter Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Catatan seluruh aktivitas krusial pengguna di dalam sistem.
                            </p>
                        </div>
                        <div className="w-full sm:w-64">
                            <TextInput
                                type="text"
                                placeholder="Cari aktivitas, deskripsi, atau nama user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full"
                                isFocused={false}
                            />
                        </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Waktu
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aktor / User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipe Aktivitas
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {logs.data.length > 0 ? (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">{log.user?.name || 'Sistem'}</div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{log.user?.role || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {formatActivityType(log.activity_type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {log.description}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                Tidak ada log aktivitas ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View (Mobile-First approach) */}
                    <div className="sm:hidden grid grid-cols-1 gap-4">
                        {logs.data.length > 0 ? (
                            logs.data.map((log) => (
                                <div key={log.id} className="bg-white p-4 shadow rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{log.user?.name || 'Sistem'} <span className="text-xs font-normal text-gray-500">({log.user?.role || '-'})</span></p>
                                            <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                                        </div>
                                        <span className="px-2 py-1 inline-flex text-xs leading-tight font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {formatActivityType(log.activity_type)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-800 mt-2">
                                        {log.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center text-sm text-gray-500">
                                Tidak ada log aktivitas ditemukan.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination links={logs.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
