import React from 'react';

export default function ChairmanProfile({ user, roleData }) {
    return (
        <div className="space-y-10 sm:space-y-16">
            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Informasi Jabatan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Detail jabatan Ketua dan periode kepengurusan Anda.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="bg-white shadow sm:rounded-xl border border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Jabatan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.job_title || 'Ketua Koperasi'}</dd>
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
                            Ringkasan Keputusan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Aktivitas strategis yang telah Anda setujui periode ini.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">Approval Pinjaman</p>
                            <p className="mt-2 text-2xl text-blue-600 font-mono font-bold">{roleData.approved_decisions_count || 0}</p>
                        </div>
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">Approval SHU</p>
                            <p className="mt-2 text-2xl text-green-600 font-mono font-bold">0</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
