import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ProductUiCardLight from '@/Components/DesignSystem/ProductUiCardLight';

export default function Dashboard({ auth, stats }) {
    return (
        <AdminLayout auth={auth} title="Dasbor Pengurus">
            <Head title="Admin Dashboard" />

            <div className="ds-grid-3up">
                <ProductUiCardLight style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Total Anggota Aktif</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        {stats.total_members}
                    </div>
                </ProductUiCardLight>

                <ProductUiCardLight style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="ds-body-sm" style={{ color: 'var(--color-muted)' }}>Total Dana Tersimpan</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600, color: 'var(--color-semantic-up)' }}>
                        Rp {numberFormat(stats.total_savings)}
                    </div>
                </ProductUiCardLight>

                <ProductUiCardLight style={{ padding: 'var(--spacing-lg)', backgroundColor: 'var(--color-surface-dark-elevated)', color: 'var(--color-canvas)' }}>
                    <div className="ds-body-sm" style={{ color: 'var(--color-on-dark-soft)' }}>Status Periode Potongan</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600 }}>
                        <span className="ds-badge-pill" style={{ backgroundColor: 'var(--color-semantic-up)', color: 'white' }}>AKTIF</span>
                    </div>
                </ProductUiCardLight>
            </div>
        </AdminLayout>
    );
}

function numberFormat(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}
