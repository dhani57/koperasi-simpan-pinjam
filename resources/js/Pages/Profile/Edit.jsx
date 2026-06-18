import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const isAdmin = ['pengurus', 'ketua'].includes(auth.user.role);

    // Choose layout based on role
    const Layout = isAdmin ? AdminLayout : AuthenticatedLayout;

    return (
        <Layout
            auth={auth}
            title="Profil Pengurus"
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profil" />

            <div className={isAdmin ? '' : 'py-12'}>
                <div className={isAdmin ? 'space-y-8' : 'mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8'}>
                    
                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px' }}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px' }}>
                        <UpdatePasswordForm />
                    </div>

                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px', border: '1px solid #fee2e2' }}>
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
