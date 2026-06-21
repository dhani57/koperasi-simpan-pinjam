import React from 'react';

export default function MemberProfile({ user, roleData }) {
    return (
        <section className="space-y-6">
            <header>
                <h2 className="text-lg font-medium text-gray-900 ds-typography-title-lg">
                    Informasi Keanggotaan
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Detail keanggotaan koperasi dan ringkasan finansial Anda.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Departemen/Unit Kerja</p>
                    <p className="mt-1 text-lg text-gray-900">{user.department || '-'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Tanggal Bergabung</p>
                    <p className="mt-1 text-lg text-gray-900">{user.joined_at ? new Date(user.joined_at).toLocaleDateString() : '-'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Potongan Simpanan Rutin</p>
                    <p className="mt-1 text-lg text-gray-900 font-mono ds-typography-number-display">Rp {Number(user.monthly_saving_nominal).toLocaleString('id-ID')}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Limit Maksimal Potongan</p>
                    <p className="mt-1 text-lg text-gray-900 font-mono ds-typography-number-display">Rp {Number(user.max_salary_deduction_limit).toLocaleString('id-ID')}</p>
                </div>
            </div>

            <div className="mt-6 border-t pt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Ringkasan Finansial</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">Total Simpanan</p>
                        <p className="mt-2 text-2xl text-blue-600 font-mono font-bold ds-typography-number-display">Rp {Number(user.total_saving_balance).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">Pinjaman Aktif</p>
                        <p className="mt-2 text-2xl text-gray-900 font-mono font-bold">{roleData.active_loans_count}</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl ds-feature-card">
                        <p className="text-sm font-medium text-gray-500">SHU Terakhir</p>
                        <p className="mt-2 text-2xl text-green-600 font-mono font-bold ds-typography-number-display">
                            {roleData.shu_history && roleData.shu_history.length > 0 ? `Rp ${Number(roleData.shu_history[0].amount).toLocaleString('id-ID')}` : '-'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
