import React from 'react';

export default function MemberProfile({ user, roleData }) {
    return (
        <div className="space-y-10 sm:space-y-16">
            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Informasi Keanggotaan
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Detail keanggotaan dan batas pemotongan gaji.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="bg-white shadow sm:rounded-xl border border-gray-200">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Departemen/Unit Kerja</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.department || '-'}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Tanggal Bergabung</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.joined_at ? new Date(user.joined_at).toLocaleDateString() : '-'}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Potongan Simpanan Rutin</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono ds-typography-number-display">Rp {Number(user.monthly_saving_nominal).toLocaleString('id-ID')}</dd>
                            </div>
                            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Limit Maksimal Potongan</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono ds-typography-number-display">Rp {Number(user.max_salary_deduction_limit).toLocaleString('id-ID')}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                    <div className="border-t border-gray-200"></div>
                </div>
            </div>

            <section className="md:grid md:grid-cols-3 md:gap-6">
                <header className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                            Ringkasan Finansial
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Gambaran singkat posisi keuangan Anda di koperasi.
                        </p>
                    </div>
                </header>

                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">Total Simpanan</p>
                            <p className="mt-2 text-2xl text-blue-600 font-mono font-bold ds-typography-number-display">Rp {Number(user.total_saving_balance).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">Pinjaman Aktif</p>
                            <p className="mt-2 text-2xl text-gray-900 font-mono font-bold">{roleData.active_loans_count}</p>
                        </div>
                        <div className="p-5 bg-white shadow sm:rounded-xl border border-gray-200">
                            <p className="text-sm font-medium text-gray-500 truncate">SHU Terakhir</p>
                            <p className="mt-2 text-2xl text-green-600 font-mono font-bold ds-typography-number-display">
                                {roleData.shu_history && roleData.shu_history.length > 0 ? `Rp ${Number(roleData.shu_history[0].amount).toLocaleString('id-ID')}` : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
