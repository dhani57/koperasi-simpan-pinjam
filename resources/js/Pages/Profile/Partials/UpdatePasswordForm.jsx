import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import ButtonPrimary from '@/Components/DesignSystem/ButtonPrimary';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`md:grid md:grid-cols-3 md:gap-6 ${className}`}>
            <header className="md:col-span-1">
                <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 ds-typography-title-lg">
                        Ubah Password
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Pastikan akun Anda menggunakan password yang panjang dan acak untuk tetap aman.
                    </p>
                </div>
            </header>

            <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={updatePassword}>
                    <div className="px-4 py-5 bg-white sm:p-6 shadow sm:rounded-t-xl space-y-6 border border-gray-200 border-b-0">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Password Saat Ini"
                        className="ds-label"
                    />

                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="ds-text-input"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password Baru" className="ds-label" />

                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="ds-text-input"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password Baru"
                        className="ds-label"
                    />

                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="ds-text-input"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

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
