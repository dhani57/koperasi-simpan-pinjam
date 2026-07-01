import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ConfirmModal';

export default function Index({ auth, year, shuData, filters, isDistributed, hasDraft }) {
    const { data, setData, post, processing, errors } = useForm({
        total_jasa_income: shuData.global_profit || 0,
        persen_dana_sosial: shuData.persen_dana_sosial || 5,
        persen_thr_pengurus: shuData.persen_thr_pengurus || 5,
        persen_shu_simpanan: shuData.persen_shu_simpanan || 40,
        persen_shu_jasa: shuData.persen_shu_jasa || 40,
        persen_modal: shuData.persen_modal || 10,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [search, setSearch] = useState(filters?.search || '');
    const [yearFilter, setYearFilter] = useState(year);
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const debounceTimer = setTimeout(() => {
            router.get(
                route('admin.shu.index'),
                { year: yearFilter, search },
                { preserveState: true, preserveScroll: true, replace: true }
            );
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [search, yearFilter]);

    useEffect(() => {
        if (!initialRender.current) {
            setData({
                total_jasa_income: shuData.global_profit || 0,
                persen_dana_sosial: shuData.persen_dana_sosial || 5,
                persen_thr_pengurus: shuData.persen_thr_pengurus || 5,
                persen_shu_simpanan: shuData.persen_shu_simpanan || 40,
                persen_shu_jasa: shuData.persen_shu_jasa || 40,
                persen_modal: shuData.persen_modal || 10,
            });
        }
    }, [shuData]);

    const handleYearChange = (e) => {
        setCurrentPage(1);
        setYearFilter(e.target.value);
    };

    const [confirmConfig, setConfirmConfig] = useState({
        show: false,
        title: '',
        message: '',
        type: 'primary',
        confirmText: 'Setujui',
        actionCallback: null,
    });

    const openConfirm = (title, message, type, confirmText, actionCallback) => {
        setConfirmConfig({
            show: true,
            title,
            message,
            type,
            confirmText,
            actionCallback
        });
    };

    const handleConfirm = () => {
        if (confirmConfig.actionCallback) {
            confirmConfig.actionCallback();
        }
        setConfirmConfig({ ...confirmConfig, show: false });
    };

    const submit = (e) => {
        e.preventDefault();
        openConfirm(
            'Kirim Draf SHU',
            'Anda yakin ingin mengirim draf perhitungan SHU tahun ini?\n\nPERINGATAN: Tindakan ini akan meneruskan draf ke Ketua untuk persetujuan final.',
            'primary',
            'Kirim Draf',
            () => post(route('admin.shu.store', { year: yearFilter }))
        );
    };

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const isKetua = auth.user.role === 'ketua';
    const isBendahara = auth.user.role === 'bendahara';
    const isPengawas = auth.user.role === 'pengawas';

    const totalItems = shuData.member_proportions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = shuData.member_proportions.slice(startIndex, startIndex + itemsPerPage);

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label htmlFor="year" style={{ fontSize: '14px', fontWeight: 600 }}>Tahun:</label>
                                <select 
                                    id="year" 
                                    value={yearFilter} 
                                    onChange={handleYearChange}
                                    className="ds-input"
                                    style={{ width: '100px', minHeight: '40px' }}
                                >
                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calculator Card */}
                {isBendahara && !isDistributed && (
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)' }}>
                        <h3 className="ds-title-md mb-4">Pengaturan Persentase SHU</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Total Keuntungan Bersih (Rp)</label>
                                <input 
                                    type="number" 
                                    className="ds-input w-full" 
                                    value={data.total_jasa_income} 
                                    onChange={e => setData('total_jasa_income', parseFloat(e.target.value) || 0)} 
                                />
                            </div>
                            <div className="flex items-end">
                                <div className={`text-sm font-bold ${data.persen_dana_sosial + data.persen_thr_pengurus + data.persen_shu_simpanan + data.persen_shu_jasa + data.persen_modal !== 100 ? 'text-red-500' : 'text-green-600'}`}>
                                    Total: {data.persen_dana_sosial + data.persen_thr_pengurus + data.persen_shu_simpanan + data.persen_shu_jasa + data.persen_modal}%
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Dana Sosial (%) - {formatRp(data.total_jasa_income * data.persen_dana_sosial / 100)}</label>
                                <input type="number" className="ds-input w-full" value={data.persen_dana_sosial} onChange={e => setData('persen_dana_sosial', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">THR Pengurus (%) - {formatRp(data.total_jasa_income * data.persen_thr_pengurus / 100)}</label>
                                <input type="number" className="ds-input w-full" value={data.persen_thr_pengurus} onChange={e => setData('persen_thr_pengurus', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">SHU Simpanan (%) - {formatRp(data.total_jasa_income * data.persen_shu_simpanan / 100)}</label>
                                <input type="number" className="ds-input w-full" value={data.persen_shu_simpanan} onChange={e => setData('persen_shu_simpanan', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">SHU Jasa (%) - {formatRp(data.total_jasa_income * data.persen_shu_jasa / 100)}</label>
                                <input type="number" className="ds-input w-full" value={data.persen_shu_jasa} onChange={e => setData('persen_shu_jasa', parseFloat(e.target.value) || 0)} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Modal Koperasi (%) - {formatRp(data.total_jasa_income * data.persen_modal / 100)}</label>
                                <input type="number" className="ds-input w-full" value={data.persen_modal} onChange={e => setData('persen_modal', parseFloat(e.target.value) || 0)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Table */}
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        <h3 className="ds-title-md" style={{ margin: 0 }}>Rincian Pembagian per Anggota</h3>
                        <input
                            type="text"
                            placeholder="Cari anggota..."
                            className="ds-text-input text-sm"
                            style={{ minHeight: '40px', width: '100%', maxWidth: '300px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', width: '40px' }}>No.</th>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px' }}>Nama Anggota</th>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Total Jasa Dibayar</th>
                                <th style={{ padding: '12px', color: 'var(--color-muted)', fontWeight: 600, fontSize: '13px', textAlign: 'right' }}>Persentase Bagian</th>
                                <th style={{ padding: '12px', color: 'var(--color-ink)', fontWeight: 700, fontSize: '13px', textAlign: 'right' }}>Estimasi SHU (Rp)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, index) => (
                                <tr key={item.user.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--color-muted)' }}>{startIndex + index + 1}</td>
                                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: 500 }}>{item.user.name}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right' }}>{formatRp(item.score)}</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{item.proportion_percentage.toFixed(2)}%</td>
                                    <td className="number-display" style={{ padding: '12px', textAlign: 'right', fontWeight: '700', color: 'var(--color-semantic-up)' }}>Rp {formatRp(item.nominal_shu)}</td>
                                </tr>
                            ))}
                            {shuData.member_proportions.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-muted)' }}>
                                        Belum ada data aktivitas anggota di tahun ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ fontSize: '13px', color: 'var(--color-muted)' }}>
                                Menampilkan {startIndex + 1} hingga {Math.min(startIndex + itemsPerPage, totalItems)} dari total {totalItems} anggota
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="ds-button"
                                    style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid var(--color-hairline)', backgroundColor: currentPage === 1 ? 'var(--color-canvas)' : 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? 'var(--color-muted)' : 'var(--color-ink)' }}
                                >
                                    Sebelumnya
                                </button>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="ds-button"
                                    style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid var(--color-hairline)', backgroundColor: currentPage === totalPages ? 'var(--color-canvas)' : 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? 'var(--color-muted)' : 'var(--color-ink)' }}
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                {!isPengawas && (
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--rounded-xl)', padding: '24px', border: '1px solid var(--color-hairline)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {isDistributed ? (
                            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-surface-soft)', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-ink)' }}>Telah Dibagikan</h3>
                                <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginTop: '4px' }}>SHU untuk tahun {year} telah sukses didistribusikan ke seluruh anggota dan dicatat di buku besar.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="ds-title-md">{isKetua ? 'Persetujuan Final' : 'Kirim Draf SHU'}</h3>
                                <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>
                                    {isKetua 
                                        ? (hasDraft ? 'Tinjau draf perhitungan Sisa Hasil Usaha (SHU) di atas sebelum didistribusikan ke masing-masing anggota. Persetujuan Anda diperlukan untuk mengesahkan proses ini.' : 'Belum ada draf SHU yang dikirim oleh Bendahara untuk tahun ini.')
                                        : (hasDraft ? 'Draf SHU telah dikirim ke Ketua dan sedang menunggu persetujuan.' : 'Pastikan rincian pembagian di atas sudah sesuai sebelum mengirimkannya ke Ketua untuk persetujuan akhir.')
                                    }
                                </p>
                                
                                {isKetua ? (
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        openConfirm(
                                            'Persetujuan Distribusi SHU',
                                            'Anda yakin ingin menyetujui distribusi SHU ini? Tindakan ini tidak dapat dibatalkan.',
                                            'primary',
                                            'Setujui & Distribusikan',
                                            () => post(route('admin.shu.approve', { year: yearFilter }))
                                        );
                                    }}>
                                        <button 
                                            type="submit" 
                                            disabled={processing || shuData.member_proportions.length === 0 || !hasDraft}
                                            className="ds-button-primary"
                                            style={{ padding: '12px 24px', fontSize: '14px', backgroundColor: '#10b981', border: 'none', cursor: (processing || shuData.member_proportions.length === 0 || !hasDraft) ? 'not-allowed' : 'pointer' }}
                                        >
                                            {processing ? 'Memproses...' : 'Setujui & Distribusikan SHU'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={submit}>
                                        <button 
                                            type="submit" 
                                            disabled={processing || shuData.member_proportions.length === 0 || hasDraft || (data.persen_dana_sosial + data.persen_thr_pengurus + data.persen_shu_simpanan + data.persen_shu_jasa + data.persen_modal !== 100)}
                                            className="ds-button-primary"
                                            style={{ padding: '12px 24px', fontSize: '14px', backgroundColor: 'var(--color-primary)', border: 'none', cursor: (processing || shuData.member_proportions.length === 0 || hasDraft || (data.persen_dana_sosial + data.persen_thr_pengurus + data.persen_shu_simpanan + data.persen_shu_jasa + data.persen_modal !== 100)) ? 'not-allowed' : 'pointer' }}
                                        >
                                            {processing ? 'Memproses...' : (hasDraft ? 'Draf Telah Dikirim' : 'Simpan & Kirim Draf SHU')}
                                        </button>
                                        {errors && Object.values(errors).map(err => <p className="text-red-500 mt-2 text-sm" key={err}>{err}</p>)}
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal 
                show={confirmConfig.show}
                onClose={() => setConfirmConfig({ ...confirmConfig, show: false })}
                onConfirm={handleConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
            />
        </AdminLayout>
    );
}
