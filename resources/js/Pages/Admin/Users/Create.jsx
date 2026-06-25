import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import InputLabel from '@/Components/InputLabel';
import AlertModal from '@/Components/AlertModal';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        identity_number: '',
        email: '',
        roles: ['anggota'],
        monthly_saving_nominal: 0,
        max_salary_deduction_limit: 0,
        total_saving_balance: 0,
        joined_at: new Date().toISOString().split('T')[0],
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    const formatNumber = (num) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleNumberInput = (field, value) => {
        const rawValue = value.replace(/\D/g, '');
        setData(field, rawValue);
    };

    const availableRoles = [
        { value: 'anggota', label: 'Anggota' },
        { value: 'bendahara', label: 'Bendahara' },
        { value: 'pengurus', label: 'Pengurus (Admin)' },
        { value: 'ketua', label: 'Ketua' },
        { value: 'pengawas', label: 'Pengawas' }
    ];

    const [alertConfig, setAlertConfig] = useState({
        show: false,
        message: ''
    });

    const handleRoleChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        let newRoles = [...data.roles];
        
        if (checked) {
            if (newRoles.length < 2) {
                newRoles.push(value);
            } else {
                setAlertConfig({ show: true, message: 'Maksimal memilih 2 peran!' });
                return;
            }
        } else {
            newRoles = newRoles.filter(r => r !== value);
        }
        setData('roles', newRoles);
    };

    return (
        <AdminLayout auth={auth} title="Tambah Anggota Baru">
            <Head title="Tambah Anggota" />

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', maxWidth: '800px' }}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="identity_number" value={<span>NIP/NIM <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="identity_number" type="text" className="ds-text-input" value={data.identity_number} onChange={e => setData('identity_number', e.target.value)} required />
                            {errors.identity_number && <div className="ds-error-text">{errors.identity_number}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value={<span>Nama Lengkap <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="name" type="text" className="ds-text-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <div className="ds-error-text">{errors.name}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="email" value={<span>Email <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="email" type="email" className="ds-text-input" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <div className="ds-error-text">{errors.email}</div>}
                        </div>
                        <div>
                            <InputLabel value={<span>Peran (Maksimal 2) <span className="text-red-500">*</span></span>} className="ds-label mb-3" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                                {availableRoles.map(role => (
                                    <label key={role.value} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            value={role.value}
                                            checked={data.roles.includes(role.value)}
                                            onChange={handleRoleChange}
                                            className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                        />
                                        {role.label}
                                    </label>
                                ))}
                            </div>
                            {errors.roles && <div className="ds-error-text mt-1">{errors.roles}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="monthly_saving_nominal" value={<span>Iuran Simpanan Bulanan (Rp) <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="monthly_saving_nominal" type="text" className="ds-text-input" value={formatNumber(data.monthly_saving_nominal)} onChange={e => handleNumberInput('monthly_saving_nominal', e.target.value)} required />
                            {errors.monthly_saving_nominal && <div className="ds-error-text">{errors.monthly_saving_nominal}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="max_salary_deduction_limit" value={<span>Batas Potongan Gaji (Rp) <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="max_salary_deduction_limit" type="text" className="ds-text-input" value={formatNumber(data.max_salary_deduction_limit)} onChange={e => handleNumberInput('max_salary_deduction_limit', e.target.value)} required />
                            {errors.max_salary_deduction_limit && <div className="ds-error-text">{errors.max_salary_deduction_limit}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="total_saving_balance" value="Saldo Awal Simpanan (Opsional/Migrasi)" className="ds-label" />
                            <input id="total_saving_balance" type="text" className="ds-text-input" value={formatNumber(data.total_saving_balance) || ''} onChange={e => handleNumberInput('total_saving_balance', e.target.value)} placeholder="0" />
                            {errors.total_saving_balance && <div className="ds-error-text">{errors.total_saving_balance}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="joined_at" value={<span>Tanggal Bergabung <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="joined_at" type="date" className="ds-text-input" value={data.joined_at} onChange={e => setData('joined_at', e.target.value)} required />
                            {errors.joined_at && <div className="ds-error-text">{errors.joined_at}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4 border-t border-slate-200">
                        <div>
                            <InputLabel htmlFor="password" value={<span>Password <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="password" type="password" className="ds-text-input" value={data.password} onChange={e => setData('password', e.target.value)} required />
                            {errors.password && <div className="ds-error-text">{errors.password}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="password_confirmation" value={<span>Konfirmasi Password <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="password_confirmation" type="password" className="ds-text-input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                        <Link href={route('admin.users.index')} className="text-slate-500 font-medium py-3 px-4 hover:bg-slate-100 rounded-full transition-colors">Batal</Link>
                        <ButtonPrimary type="submit" disabled={processing}>Simpan Data</ButtonPrimary>
                    </div>
                </form>
            </div>

            <AlertModal 
                show={alertConfig.show}
                onClose={() => setAlertConfig({ ...alertConfig, show: false })}
                title="Peringatan"
                message={alertConfig.message}
                type="warning"
            />
        </AdminLayout>
    );
}
