import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#0a0b0d] mb-3">
                    Reset your password
                </h2>
                <p className="text-[16px] text-[#475569] leading-relaxed">
                    Enter your email address below, and we'll send you a link to reset your password.
                </p>
            </div>

            {status && (
                <div className="mb-6 rounded-lg bg-[#05b169]/10 p-4 text-sm font-medium text-[#05b169]">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="block text-[14px] font-medium text-[#1e293b] mb-2">
                        Email address
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-8">
                    <PrimaryButton className="w-full" disabled={processing}>
                        Send Reset Link
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
