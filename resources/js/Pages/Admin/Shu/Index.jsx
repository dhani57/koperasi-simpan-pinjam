import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth, year, shuData }) {
    const { post, processing } = useForm();

    const handleYearChange = (e) => {
        router.get(route('admin.shu.index'), { year: e.target.value }, { preserveState: true });
    };

    const submit = (e) => {
        e.preventDefault();
        if (confirm('Anda yakin ingin mengirim draf perhitungan SHU tahun ini?\n\nPERINGATAN: Tindakan ini akan meneruskan draf ke Ketua untuk persetujuan final.')) {
            post(route('admin.shu.store'));
        }
    };

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const isKetua = auth.user.role === 'ketua';
    const isBendahara = auth.user.role === 'bendahara';
    const isPengawas = auth.user.role === 'pengawas';

    return (
        <AdminLayout auth={auth} title={`Laporan SHU & Tutup Buku (${year})`}>
            <Head title="Laporan SHU" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Year Selection Card */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 className="ds-title-md">Laporan Sisa Hasil Usaha (SHU)</h2>
                            <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>
                                Tinjau perhitungan pembagian SHU berdasarkan aktivitas transaksi anggota.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label htmlFor="year" style={{ fontSize: '14px', fontWeight: 600 }}>Pilih Tahun:</label>
                            <select 
                                id="year" 
                                value={year} 
                                onChange={handleYearChange}
                                className="ds-input"
                                style={{ width: '120px' }}
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Total Skor Aktivitas (Mutasi)</div>
                        <div className="number-display" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {formatRp(shuData.total_score)}
                        </div>
                    </div>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)' }}>
                        <div style={{ fontSize: '13px', color: 'var(--color-muted)', fontWeight: 600, marginBottom: '8px' }}>Basis Formula</div>
                        <div style={{ fontSize: '18px', fontWeight: 600, textTransform: 'capitalize' }}>
                            {shuData.formula_base.replace(/_/g, ' ')}
                        </div>
                    </div>
                </div>

                {/* Details Table */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', overflowX: 'auto' }}>
                    <h3 className="ds-title-md" style={{ marginBottom: '16px' }}>Rincian Pembagian per Anggota</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', width: '40px' }}>No.</th>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Nama Anggota</th>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Skor Aktivitas</th>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Persentase Bagian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shuData.member_proportions.map((item, index) => (
                                <tr key={item.user.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{index + 1}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{item.user.name}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>{formatRp(item.score)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{item.proportion_percentage.toFixed(2)}%</td>
                                </tr>
                            ))}
                            {shuData.member_proportions.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>
                                        Belum ada data aktivitas anggota di tahun ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Actions */}
                {!isPengawas && (
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 className="ds-title-md">{isKetua ? 'Persetujuan Final' : 'Kirim Draf SHU'}</h3>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                            {isKetua 
                                ? 'Tinjau draf perhitungan Sisa Hasil Usaha (SHU) di atas sebelum didistribusikan ke masing-masing anggota. Persetujuan Anda diperlukan untuk mengesahkan proses ini.'
                                : 'Pastikan rincian pembagian di atas sudah sesuai sebelum mengirimkannya ke Ketua untuk persetujuan akhir.'
                            }
                        </p>
                        
                        {isKetua ? (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (confirm('Anda yakin ingin menyetujui distribusi SHU ini? Tindakan ini tidak dapat dibatalkan.')) {
                                    post(route('admin.shu.approve'));
                                }
                            }}>
                                <button 
                                    type="submit" 
                                    disabled={processing || shuData.member_proportions.length === 0}
                                    className="ds-button-primary"
                                    style={{ padding: '12px 24px', fontSize: '14px', backgroundColor: '#10b981', border: 'none', cursor: (processing || shuData.member_proportions.length === 0) ? 'not-allowed' : 'pointer' }}
                                >
                                    {processing ? 'Memproses...' : 'Setujui & Distribusikan SHU'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={submit}>
                                <button 
                                    type="submit" 
                                    disabled={processing || shuData.member_proportions.length === 0}
                                    className="ds-button-primary"
                                    style={{ padding: '12px 24px', fontSize: '14px', backgroundColor: 'var(--color-primary)', border: 'none', cursor: (processing || shuData.member_proportions.length === 0) ? 'not-allowed' : 'pointer' }}
                                >
                                    {processing ? 'Memproses...' : 'Kirim Draf SHU ke Ketua'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
