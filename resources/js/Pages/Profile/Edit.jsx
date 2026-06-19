import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const isAdmin = ['pengurus', 'ketua'].includes(auth.user.role);

    // Choose layout based on role
    const Layout = isAdmin ? AdminLayout : MemberLayout;

    return (
        <Layout
            auth={auth}
            title="Profil"
        >
            <Head title="Profil" />

            <div className={isAdmin ? '' : 'py-8'}>
                <div className={isAdmin ? 'space-y-8' : 'mx-auto max-w-4xl space-y-6'}>
                    
                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <UpdatePasswordForm />
                    </div>

                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #fee2e2' }}>
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
