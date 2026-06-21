import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import MemberProfile from './Partials/RoleSpecific/MemberProfile';
import TreasurerProfile from './Partials/RoleSpecific/TreasurerProfile';
import AdminProfile from './Partials/RoleSpecific/AdminProfile';
import ChairmanProfile from './Partials/RoleSpecific/ChairmanProfile';
import AuditorProfile from './Partials/RoleSpecific/AuditorProfile';

export default function Edit({ auth, mustVerifyEmail, status, roleData }) {
    const isAdmin = ['pengurus', 'bendahara', 'ketua', 'pengawas'].includes(auth.user.role);

    // Choose layout based on role
    const Layout = isAdmin ? AdminLayout : MemberLayout;

    const renderRoleSpecificProfile = () => {
        switch (auth.user.role) {
            case 'anggota': return <MemberProfile user={auth.user} roleData={roleData} />;
            case 'bendahara': return <TreasurerProfile user={auth.user} roleData={roleData} />;
            case 'pengurus': return <AdminProfile user={auth.user} roleData={roleData} />;
            case 'ketua': return <ChairmanProfile user={auth.user} roleData={roleData} />;
            case 'pengawas': return <AuditorProfile user={auth.user} roleData={roleData} />;
            default: return null;
        }
    };

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
                        {renderRoleSpecificProfile()}
                    </div>

                    <div className="ds-product-ui-card-light" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <UpdatePasswordForm />
                    </div>

                </div>
            </div>
        </Layout>
    );
}
