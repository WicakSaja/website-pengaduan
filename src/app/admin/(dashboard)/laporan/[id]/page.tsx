"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'; // Untuk tombol Kembali

const API_BASE_URL = 'http://localhost:5000';

// Tipe data PengaduanDetail (sesuaikan jika perlu)
interface PengaduanDetail {
    nik: string | undefined;
    id: number;
    judul: string;
    isi_laporan: string;
    lokasi: string;
    tanggal_pengaduan: string;
    kategori?: { nama: string };
    status: 'pending' | 'proses' | 'selesai' | 'ditolak';
    user?: { nama?: string; nik?: string }; // NIK pelapor ada di desain
    bukti?: string[];
    komentar?: Array<{ by: string; message: string; tanggal: string }>;
}

// Komponen helper untuk baris detail (Style Baru)
const DetailItem = ({ label, value }: { label: string, value: React.ReactNode | string | undefined }) => (
    // Flex container, padding, border bawah
    <div className="flex flex-col border-b border-gray-100 py-3 sm:flex-row sm:items-start">
        {/* Label (Biru, lebar tetap) */}
        <span className="w-full flex-shrink-0 font-semibold text-[#0060A9] sm:w-40 md:w-48">
            {label}
        </span>
        {/* Value (Hitam/Abu, bisa meluas) */}
        <span className="mt-1 text-gray-700 sm:mt-0 sm:flex-1">
            {value || '-'}
        </span>
    </div>
);


export default function DetailPengaduanAdminPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const id = params?.id;

    const [pengaduan, setPengaduan] = useState<PengaduanDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const [catatanUpdate, setCatatanUpdate] = useState(''); // Catatan opsional

    // Fetch data detail (Logika fetch tetap sama)
    useEffect(() => {
        // ... (Kode fetch GET /api/admin/pengaduan/{id} Anda yang sudah ada) ...
         const fetchDetail = async () => { if (!id) return; setIsLoading(true); setError(null); setUpdateSuccess(null); const token = localStorage.getItem('adminToken'); if (!token) { /* redirect */ setIsLoading(false); return; } try { const response = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }); if (!response.ok){ const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); } const result = await response.json(); if (result.success && result.data?.pengaduan) { setPengaduan(result.data.pengaduan); } else { throw new Error(result.message || `Gagal ambil ID ${id}`); } } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } } finally { setIsLoading(false); } }; fetchDetail();
    }, [id, router]); // Dependency array disederhanakan

    // Handle Update Status (PATCH ke .../validasi)
    const handleUpdateStatus = async (newStatus: 'proses' | 'ditolak') => {
        if (!pengaduan || pengaduan.status !== 'pending') {
            setError('Hanya laporan dengan status "pending" yang bisa divalidasi.');
            return;
        }
        setIsUpdating(true); setError(null); setUpdateSuccess(null);
        const token = localStorage.getItem('adminToken');
        if (!token) { /* redirect */ setIsUpdating(false); return; }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}/validasi`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, catatan: catatanUpdate || undefined })
            });
            const result = await response.json();
            if (result.success) {
                setUpdateSuccess(`Status berhasil diubah menjadi ${newStatus}`);
                // Update state lokal
                setPengaduan(prev => prev ? { ...prev, status: newStatus } : null);
                setCatatanUpdate(''); // Reset catatan
            } else { throw new Error(result.message || `Gagal update status`); }
        } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); }
        finally { setIsUpdating(false); }
    };

     // Format tanggal helper
    const formatTanggal = (tanggalString: string | undefined): string => { /* ... */ if (!tanggalString) return '-'; try { return new Date(tanggalString).toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit', year:'numeric'}); } catch { return tanggalString; } }


    // === Render Logic ===
    if (isLoading) return <div>Loading detail pengaduan...</div>;
    if (error && !pengaduan) return <div className="text-red-600">Error: {error}</div>;
    if (!pengaduan) return <div>Data pengaduan tidak ditemukan.</div>;

    return (
        // Wrapper relatif untuk pola dekoratif
        <div className="relative">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            {/* Kartu Detail Putih (sesuai .detail-card) */}
            <div className="relative z-10 rounded-xl border-2 border-[#007BCC] bg-white p-6 shadow-lg md:p-10"> {/* Border biru */}
                {/* Judul */}
                <h2 className="mb-8 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Detail Data Pengaduan
                </h2>

                {/* Tampilkan error/sukses update */}
                {error && <p className="mb-4 text-center text-red-600">{error}</p>}
                {updateSuccess && <p className="mb-4 text-center text-green-600">{updateSuccess}</p>}

                {/* Daftar Detail Item */}
                <div className="mb-8">
                    <DetailItem label="ID" value={String(pengaduan.id)} />
                    <DetailItem label="Tanggal Lapor" value={formatTanggal(pengaduan.tanggal_pengaduan)} />
                    <DetailItem label="NIK Pelapor" value={pengaduan.user?.nik || pengaduan.nik || 'N/A'} /> {/* Ambil NIK */}
                    <DetailItem label="Nama Pelapor" value={pengaduan.user?.nama || 'N/A'} /> {/* Tambahkan Nama Pelapor jika perlu */}
                    <DetailItem label="Kategori" value={pengaduan.kategori?.nama || 'N/A'} />
                    <DetailItem label="Status Saat Ini" value={pengaduan.status.toUpperCase()} />
                    <DetailItem label="Judul Pengaduan" value={pengaduan.judul} />
                    <DetailItem label="Lokasi" value={pengaduan.lokasi} />
                    <DetailItem label="Deskripsi" value={pengaduan.isi_laporan} />
                    {/* Tampilkan Bukti */}
                    <DetailItem label="Bukti" value={
                        pengaduan.bukti && pengaduan.bukti.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {pengaduan.bukti.map((url, index) => (
                                    <a key={index} href={API_BASE_URL + url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                                        Lihat Bukti {index + 1}
                                    </a>
                                ))}
                            </div>
                        ) : 'Tidak ada'
                    } />
                </div>

                {/* Update Status Section (Hanya tampil jika status 'pending') */}
                {pengaduan.status === 'pending' && (
                    <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                        <h3 className="mb-4 text-lg font-semibold text-[#004A80]">
                            Update Status
                        </h3>
                         {/* Input Catatan (Opsional) */}
                         <div className="mb-4 text-left">
                            <label htmlFor="catatanUpdate" className="block text-sm font-medium text-gray-500 mb-1">
                                Catatan Validasi (Opsional)
                            </label>
                            <textarea
                                id="catatanUpdate"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
                                placeholder="Tambahkan catatan untuk validasi atau penolakan..."
                                value={catatanUpdate}
                                onChange={(e) => setCatatanUpdate(e.target.value)}
                            />
                        </div>
                        {/* Tombol Aksi */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleUpdateStatus('proses')} // Panggil API PATCH dengan status 'proses'
                                disabled={isUpdating}
                                className="rounded-full bg-[#007BCC] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#0060A9] disabled:opacity-50" // Tombol Diterima (Proses)
                            >
                                {isUpdating ? 'Loading...' : 'Terima (Proses)'}
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('ditolak')} // Panggil API PATCH dengan status 'ditolak'
                                disabled={isUpdating}
                                className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50" // Tombol Ditolak
                            >
                                {isUpdating ? 'Loading...' : 'Tolak'}
                            </button>
                        </div>
                    </div>
                )}

                 {/* Tampilkan Komentar/Riwayat jika ada */}
                 {pengaduan.komentar && pengaduan.komentar.length > 0 && (
                     <div className="mt-8 border-t border-gray-200 pt-6">
                         <h3 className="mb-4 text-lg font-semibold text-[#004A80]">Riwayat Tanggapan</h3>
                         <div className="space-y-4 text-sm">
                             {pengaduan.komentar.map((komen, index) => (
                                 <div key={index} className="rounded bg-gray-50 p-3">
                                     <p className="font-semibold">{komen.by}:</p>
                                     <p className="text-gray-700">{komen.message}</p>
                                     <p className="text-xs text-gray-400 mt-1">{komen.tanggal ? new Date(komen.tanggal).toLocaleString('id-ID') : ''}</p>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}
            </div>

            {/* Tombol Kembali (di luar Card) */}
            <div className="mt-6 text-right">
                 <Link href="/admin/laporan">
                    <button className="rounded-full bg-[#0060A9] px-6 py-2 text-sm font-semibold text-white hover:bg-[#004a80]">
                        Kembali
                    </button>
                 </Link>
            </div>

        </div>
    );
}