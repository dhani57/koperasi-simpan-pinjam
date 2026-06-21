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

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div className="space-y-10 sm:space-y-16">
                    
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />

                    {/* Pembatas opsional jika ingin lebih tegas, tapi space-y-16 sudah cukup */}
                    <div className="hidden sm:block" aria-hidden="true">
                        <div className="py-5">
                            <div className="border-t border-gray-200"></div>
                        </div>
                    </div>

                    {renderRoleSpecificProfile()}

                    <div className="hidden sm:block" aria-hidden="true">
                        <div className="py-5">
                            <div className="border-t border-gray-200"></div>
                        </div>
                    </div>

                    <UpdatePasswordForm />

                </div>
            </div>
        </Layout>
    );
}
