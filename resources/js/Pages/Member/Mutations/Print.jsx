import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Print({ auth, mutations }) {
    useEffect(() => {
        // Trigger browser print dialog after render
        window.print();
    }, []);

    const formatRp = (num) => new Intl.NumberFormat('id-ID').format(num);

    const isPositive = (mut) => mut.amount > 0 || mut.type === 'pencairan_pinjaman';

    return (
        <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '40px', color: 'black', fontFamily: 'sans-serif' }}>
            <Head title="Cetak E-Slip" />

            <style>
                {`
                    @media print {
                        body {
                            background-color: white !important;
                            margin: 0;
                            padding: 0;
                        }
                        @page {
                            margin: 20mm;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>

            {/* Header / Kop Slip */}
            <div style={{ borderBottom: '2px solid black', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>KOPERASI KARYAWAN EKSEKUTIF</h1>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>E-SLIP MUTASI ANGGOTA</p>
            </div>

            {/* Informasi Anggota */}
            <div style={{ marginBottom: '30px' }}>
                <table style={{ width: '100%', fontSize: '14px' }}>
                    <tbody>
                        <tr>
                            <td style={{ width: '150px', fontWeight: 'bold' }}>Nama Anggota</td>
                            <td style={{ width: '10px' }}>:</td>
                            <td>{auth.user.name}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>NIP / NIM</td>
                            <td>:</td>
                            <td>{auth.user.identity_number || '-'}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold' }}>Tanggal Cetak</td>
                            <td>:</td>
                            <td>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Detail Mutasi */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '16px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>Rincian Mutasi</h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Tanggal</th>
                            <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Keterangan</th>
                            <th style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>Debit (Keluar)</th>
                            <th style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>Kredit (Masuk)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mutations && mutations.length > 0 ? (
                            mutations.map((mut, idx) => {
                                const positive = isPositive(mut);
                                const absAmount = Math.abs(mut.amount);
                                return (
                                    <tr key={idx}>
                                        <td style={{ border: '1px solid black', padding: '10px' }}>
                                            {new Date(mut.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px' }}>
                                            {mut.description || mut.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                            {!positive ? \`Rp \${formatRp(absAmount)}\` : '-'}
                                        </td>
                                        <td style={{ border: '1px solid black', padding: '10px', textAlign: 'right' }}>
                                            {positive ? \`Rp \${formatRp(absAmount)}\` : '-'}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>
                                    Belum ada catatan mutasi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '50px' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                    <p style={{ marginBottom: '60px', fontSize: '14px' }}>Ttd. Anggota</p>
                    <p style={{ textDecoration: 'underline', fontWeight: 'bold', margin: 0, fontSize: '14px' }}>{auth.user.name}</p>
                </div>
            </div>

            <div className="no-print" style={{ textAlign: 'center', marginTop: '40px' }}>
                <button 
                    onClick={() => window.close()} 
                    style={{ padding: '10px 20px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                >
                    Tutup Halaman
                </button>
            </div>
        </div>
    );
}
