import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            profile_photo: null,
            _method: 'patch',
        });

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'));
    };

    return (
        <section className={`md:grid md:grid-cols-3 md:gap-6 ${className}`}>
            <header className="md:col-span-1">
                <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                        Informasi Pribadi & Kontak
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Perbarui foto profil, alamat email, dan nomor kontak aktif Anda.
                    </p>
                </div>
            </header>

            <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="px-4 py-5 bg-white sm:p-6 shadow sm:rounded-t-xl space-y-6 border border-gray-200 border-b-0">
                <div className="flex items-center gap-6">
                    <div className="shrink-0">
                        {user.profile_photo_path ? (
                            <img className="h-24 w-24 object-cover rounded-full" src={`/storage/${user.profile_photo_path}`} alt="Avatar Profile" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <InputLabel value="Foto Profil" className="ds-label" />
                        <input
                            type="file"
                            className="mt-1 block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                            onChange={(e) => setData('profile_photo', e.target.files[0])}
                        />
                        <InputError className="mt-2" message={errors.profile_photo} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel value="NIP / NIM" className="ds-label" />
                        <input
                            className="ds-text-input bg-gray-100 cursor-not-allowed text-gray-500"
                            value={user.identity_number}
                            disabled
                        />
                        <p className="mt-1 text-xs text-gray-500">Hanya dapat diubah oleh Admin.</p>
                    </div>

                    <div>
                        <InputLabel value="Role / Jabatan" className="ds-label" />
                        <input
                            className="ds-text-input bg-gray-100 cursor-not-allowed text-gray-500 capitalize"
                            value={user.role}
                            disabled
                        />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="ds-label" />

                    <input
                        id="name"
                        className="ds-text-input"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="ds-label" />

                    <input
                        id="email"
                        type="email"
                        className="ds-text-input"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone" value="Nomor Telepon / WhatsApp" className="ds-label" />

                    <input
                        id="phone"
                        type="text"
                        className="ds-text-input"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="Contoh: 08123456789"
                    />

                    <InputError className="mt-2" message={errors.phone} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Alamat email Anda belum terverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                {user.last_login_at && (
                    <div className="pt-2 text-sm text-gray-500">
                        Waktu Login Terakhir: {new Date(user.last_login_at).toLocaleString('id-ID')}
                    </div>
                )}

                    </div>

                    <div className="flex items-center justify-end gap-4 px-4 py-4 bg-gray-50 text-right sm:px-6 shadow sm:rounded-b-xl border border-gray-200">
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm font-medium text-green-600">
                                Berhasil disimpan.
                            </p>
                        </Transition>
                        
                        <ButtonPrimary disabled={processing}>Simpan Perubahan</ButtonPrimary>
                    </div>
                </form>
            </div>
        </section>
    );
}
