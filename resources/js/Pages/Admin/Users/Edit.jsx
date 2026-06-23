import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import InputLabel from '@/Components/InputLabel';

export default function Edit({ auth, user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        identity_number: user.identity_number,
        email: user.email,
        roles: user.roles_array || ['anggota'],
        monthly_saving_nominal: user.monthly_saving_nominal,
        max_salary_deduction_limit: user.max_salary_deduction_limit,
        joined_at: user.joined_at ? user.joined_at.split(' ')[0] : '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    const availableRoles = [
        { value: 'anggota', label: 'Anggota' },
        { value: 'bendahara', label: 'Bendahara' },
        { value: 'pengurus', label: 'Pengurus (Admin)' },
        { value: 'ketua', label: 'Ketua' },
        { value: 'pengawas', label: 'Pengawas' }
    ];

    const handleRoleChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        let newRoles = [...data.roles];
        
        if (checked) {
            if (newRoles.length < 2) {
                newRoles.push(value);
            } else {
                alert('Maksimal memilih 2 peran!');
                return;
            }
        } else {
            newRoles = newRoles.filter(r => r !== value);
        }
        setData('roles', newRoles);
    };

    return (
        <AdminLayout auth={auth} title={`Edit Anggota: ${user.name}`}>
            <Head title={`Edit ${user.name}`} />

            <div style={{ backgroundColor: 'var(--color-canvas)', borderRadius: 'var(--rounded-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-hairline)', maxWidth: '800px' }}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    
                    <div className="grid grid-cols-2 gap-6">
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

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="email" value={<span>Email <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="email" type="email" className="ds-text-input" value={data.email} onChange={e => setData('email', e.target.value)} required />
                            {errors.email && <div className="ds-error-text">{errors.email}</div>}
                        </div>
                        <div>
                            <InputLabel value={<span>Peran (Maksimal 2) <span className="text-red-500">*</span></span>} className="ds-label mb-3" />
                            <div className="grid grid-cols-2 gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
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

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="monthly_saving_nominal" value={<span>Potongan Simpanan Wajib (Rp) <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="monthly_saving_nominal" type="number" min="0" className="ds-text-input" value={data.monthly_saving_nominal} onChange={e => setData('monthly_saving_nominal', e.target.value)} required />
                            {errors.monthly_saving_nominal && <div className="ds-error-text">{errors.monthly_saving_nominal}</div>}
                        </div>
                        <div>
                            <InputLabel htmlFor="max_salary_deduction_limit" value={<span>Limit Maksimal Gaji (Rp) <span className="text-red-500">*</span></span>} className="ds-label" />
                            <input id="max_salary_deduction_limit" type="number" min="0" className="ds-text-input" value={data.max_salary_deduction_limit} onChange={e => setData('max_salary_deduction_limit', e.target.value)} required />
                            {errors.max_salary_deduction_limit && <div className="ds-error-text">{errors.max_salary_deduction_limit}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="joined_at" value={<span>Tanggal Bergabung</span>} className="ds-label" />
                            <input id="joined_at" type="date" className="ds-text-input" value={data.joined_at} onChange={e => setData('joined_at', e.target.value)} />
                            {errors.joined_at && <div className="ds-error-text">{errors.joined_at}</div>}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                        <h3 className="ds-title-sm mb-4">Ganti Password (Opsional)</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="password" value="Password Baru" className="ds-label" />
                                <input id="password" type="password" className="ds-text-input" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Kosongkan jika tidak ingin diubah" />
                                {errors.password && <div className="ds-error-text">{errors.password}</div>}
                            </div>
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="ds-label" />
                                <input id="password_confirmation" type="password" className="ds-text-input" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                        <Link href={route('admin.users.index')} className="text-slate-500 font-medium py-3 px-4 hover:bg-slate-100 rounded-full transition-colors">Batal</Link>
                        <ButtonPrimary type="submit" disabled={processing}>Simpan Perubahan</ButtonPrimary>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
