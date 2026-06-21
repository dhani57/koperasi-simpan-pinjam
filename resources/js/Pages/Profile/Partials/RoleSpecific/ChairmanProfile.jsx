import React from 'react';

export default function ChairmanProfile({ user, roleData }) {
    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900 ds-typography-title-lg">
                    Informasi Jabatan & Ringkasan Keputusan
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Detail jabatan Ketua dan ringkasan keputusan strategis Anda.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">{user.job_title || 'Ketua Koperasi'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Periode Jabatan</p>
                    <p className="mt-1 text-lg text-gray-900">
                        {user.job_start_date ? new Date(user.job_start_date).toLocaleDateString() : '-'} s/d {user.job_end_date ? new Date(user.job_end_date).toLocaleDateString() : 'Sekarang'}
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Ringkasan Keputusan (Periode Berjalan)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">Approval Pinjaman</p>
                        <p className="mt-2 text-2xl text-blue-600 font-mono font-bold">{roleData.approved_decisions_count || 0}</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">Approval SHU</p>
                        <p className="mt-2 text-2xl text-green-600 font-mono font-bold">0</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
