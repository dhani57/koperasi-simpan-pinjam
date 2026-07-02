import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import InputLabel from '@/Components/InputLabel';
import AlertModal from '@/Components/AlertModal';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        identity_number: '',
        name: '',
        email: '',
        department: '',
        joined_at: new Date().toISOString().split('T')[0],
        retirement_month: '',
        retirement_year: '',
        monthly_simpanan_wajib: 50000,
        simpanan_pokok_balance: 0,
        simpanan_wajib_balance: 0,
        simpanan_sukarela_balance: 0,
        bank_account_number: '',
        roles: ['anggota'],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined || num === '') return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleNumberInput = (field, value) => {
        const rawValue = value.replace(/\D/g, '');
        setData(field, rawValue ? parseInt(rawValue, 10) : 0);
    };

    const availableRoles = [
        { value: 'anggota', label: 'Anggota' },
        { value: 'bendahara', label: 'Bendahara' },
        { value: 'pengurus', label: 'Pengurus (Admin)' },
        { value: 'ketua', label: 'Ketua' },
        { value: 'pengawas', label: 'Pengawas' }
    ];

    const faculties = [
        'FEB', 'FH', 'FKIP', 'FT', 'FK', 'FP', 'FMIPA', 'FISIP'
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

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', maxWidth: '900px' }}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-2">Informasi Dasar</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="identity_number" value={<span>NIP/NIM <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="identity_number" type="text" className="ds-text-input" value={data.identity_number} onChange={e => setData('identity_number', e.target.value)} required />
                            <p className="text-xs text-slate-500 mt-1">NIP akan menjadi password default anggota.</p>
                            {errors.identity_number && <div className="ds-error-text mt-1">{errors.identity_number}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value={<span>Nama Lengkap <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="name" type="text" className="ds-text-input" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            {errors.name && <div className="ds-error-text mt-1">{errors.name}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="email" value={<span>Email <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="email" type="email" className="ds-text-input" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <div className="ds-error-text mt-1">{errors.email}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="department" value={<span>Fakultas/Unit <span className="text-red-500">*</span></span>} className="ds-label" />
                            <select id="department" className="ds-text-input" value={data.department} onChange={e => setData('department', e.target.value)} required>
                                <option value="" disabled>Pilih Fakultas/Unit</option>
                                {faculties.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            {errors.department && <div className="ds-error-text mt-1">{errors.department}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="joined_at" value={<span>Tanggal Bergabung <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="joined_at" type="date" className="ds-text-input" value={data.joined_at} onChange={e => setData('joined_at', e.target.value)} required />
                            {errors.joined_at && <div className="ds-error-text mt-1">{errors.joined_at}</div>}
                        </div>
                        <div>
                            <InputLabel value="Pensiun (Opsional)" className="ds-label mb-2" />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input type="number" placeholder="Bulan (1-12)" min="1" max="12" className="ds-text-input" value={data.retirement_month} onChange={e => setData('retirement_month', e.target.value)} />
                                    {errors.retirement_month && <div className="ds-error-text mt-1">{errors.retirement_month}</div>}
                                </div>
                                <div className="flex-1">
                                    <input type="number" placeholder="Tahun" min="2020" className="ds-text-input" value={data.retirement_year} onChange={e => setData('retirement_year', e.target.value)} />
                                    {errors.retirement_year && <div className="ds-error-text mt-1">{errors.retirement_year}</div>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="bank_account_number" value="Nomor Rekening Bank (Opsional)" className="ds-label" />
                            <input id="bank_account_number" type="text" className="ds-text-input" value={data.bank_account_number} onChange={e => setData('bank_account_number', e.target.value)} placeholder="Contoh: 1234567890" />
                            {errors.bank_account_number && <div className="ds-error-text mt-1">{errors.bank_account_number}</div>}
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

                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mt-6 mb-2">Informasi Simpanan</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="monthly_simpanan_wajib" value={<span>Iuran Simpanan Wajib per Bulan (Rp) <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="monthly_simpanan_wajib" type="text" className="ds-text-input" value={formatNumber(data.monthly_simpanan_wajib)} onChange={e => handleNumberInput('monthly_simpanan_wajib', e.target.value)} required />
                            <p className="text-xs text-slate-500 mt-1">Minimal Rp 50.000</p>
                            {errors.monthly_simpanan_wajib && <div className="ds-error-text mt-1">{errors.monthly_simpanan_wajib}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="simpanan_pokok_balance" value="Saldo Awal Simpanan Pokok (Rp)" className="ds-label" />
                            <input id="simpanan_pokok_balance" type="text" className="ds-text-input" value={formatNumber(data.simpanan_pokok_balance)} onChange={e => handleNumberInput('simpanan_pokok_balance', e.target.value)} placeholder="0" />
                            <p className="text-xs text-slate-500 mt-1">Opsional, isi jika migrasi data anggota lama.</p>
                            {errors.simpanan_pokok_balance && <div className="ds-error-text mt-1">{errors.simpanan_pokok_balance}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <InputLabel htmlFor="simpanan_wajib_balance" value="Saldo Awal Simpanan Wajib (Rp)" className="ds-label" />
                            <input id="simpanan_wajib_balance" type="text" className="ds-text-input" value={formatNumber(data.simpanan_wajib_balance)} onChange={e => handleNumberInput('simpanan_wajib_balance', e.target.value)} placeholder="0" />
                            {errors.simpanan_wajib_balance && <div className="ds-error-text mt-1">{errors.simpanan_wajib_balance}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="simpanan_sukarela_balance" value="Saldo Awal Simpanan Sukarela (Rp)" className="ds-label" />
                            <input id="simpanan_sukarela_balance" type="text" className="ds-text-input" value={formatNumber(data.simpanan_sukarela_balance)} onChange={e => handleNumberInput('simpanan_sukarela_balance', e.target.value)} placeholder="0" />
                            {errors.simpanan_sukarela_balance && <div className="ds-error-text mt-1">{errors.simpanan_sukarela_balance}</div>}
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

