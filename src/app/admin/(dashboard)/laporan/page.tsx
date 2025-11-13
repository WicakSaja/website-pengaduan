"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000';

// Tipe data PengaduanRow (sesuaikan jika perlu)
interface PengaduanRow {
  id: number;
  tanggal_pengaduan: string;
  user?: { nama: string; nik?: string }; // Tambahkan NIK jika API mengirim
  kategori?: { nama: string } | string;
  status: 'pending' | 'proses' | 'selesai' | 'ditolak';
  judul?: string; // Judul tidak ada di tabel desain baru, tapi mungkin perlu
  nik?: string; // NIK ada di tabel desain baru
}

export default function DataPengaduanPage() {
    const router = useRouter();
    const [pengaduanList, setPengaduanList] = useState<PengaduanRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data (logika tetap sama)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); setError(null);
            const token = localStorage.getItem('adminToken');
            if (!token) { /*... redirect ...*/ setIsLoading(false); return; }
            try {
                // Fetch dari GET /api/admin/pengaduan
                const response = await fetch(`${API_BASE_URL}/api/admin/pengaduan`, { // Endpoint admin
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                 if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
                const result = await response.json();
                if (result.success && result.data?.pengaduan) {
                    setPengaduanList(result.data.pengaduan);
                } else { throw new Error(result.message || 'Gagal ambil data'); }
            } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /*... handle logout ...*/ } }
            finally { setIsLoading(false); }
        };
        fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Hanya fetch sekali saat mount

    // Handler Hapus (opsional, jika diperlukan)
    const handleDelete = (id: number) => { /* ... (fungsi delete Anda jika perlu) ... */ };

    // Format tanggal helper
    const formatTanggal = (tanggalString: string | undefined): string => { /* ... */ if (!tanggalString) return '-'; try { return new Date(tanggalString).toLocaleDateString('id-ID', {day:'2-digit', month:'2-digit', year:'numeric'}); } catch { return tanggalString; } }

    return (
        // Wrapper relatif untuk pola dekoratif
        <div className="relative">
            {/* Placeholder Pola Dekoratif */}
            {/* <div className="absolute top-0 right-0 ..."></div> */}
            {/* <div className="absolute bottom-0 left-0 ..."></div> */}

            {/* Kartu Tabel Putih (sesuai .table-card) */}
            <div className="relative z-10 rounded-xl bg-white p-6 shadow-lg md:p-8"> {/* Padding disesuaikan */}
                {/* Judul Halaman */}
                <h2 className="mb-6 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Data Pengaduan
                </h2>

                {/* Tampilkan Loading atau Error */}
                {isLoading && <p className="text-center text-gray-500">Loading data pengaduan...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}

                {/* Tabel Pengaduan (Hanya tampil jika tidak loading/error) */}
                {!isLoading && !error && (
                    <div className="overflow-x-auto"> {/* Scroll horizontal jika perlu */}
                        <table className="w-full min-w-[700px] text-left"> {/* Min-width agar tidak terlalu sempit */}

                            {/* Header Tabel (Biru Tua, Rounded Top) */}
                            <thead className="bg-[#004a80] text-white">
                                <tr>
                                    {/* Sesuaikan kolom dengan desain baru */}
                                    <th className="rounded-tl-lg p-3 px-4 text-sm font-semibold">No</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Tanggal</th>
                                    <th className="p-3 px-4 text-sm font-semibold">NIK</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Kategori</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Status</th>
                                    {/* Kolom Status kedua? Desain sepertinya salah, kita pakai satu saja */}
                                    <th className="rounded-tr-lg p-3 px-4 text-sm font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>

                            {/* Body Tabel */}
                            <tbody>
                                {pengaduanList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center text-gray-500">Tidak ada data pengaduan.</td>
                                    </tr>
                                ) : (
                                    pengaduanList.map((laporan, index) => (
                                        <tr key={laporan.id} className="border-b border-gray-100 last:border-b-0">
                                            {/* Data (Teks Biru Muda) */}
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{index + 1}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9] whitespace-nowrap">{formatTanggal(laporan.tanggal_pengaduan)}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{laporan.nik || laporan.user?.nik || '-'}</td> {/* Tampilkan NIK */}
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{typeof laporan.kategori === 'object' ? laporan.kategori.nama : laporan.kategori || '-'}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9] capitalize">{laporan.status}</td>
                                            {/* Kolom Aksi */}
                                            <td className="p-3 px-4 text-center">
                                                <Link href={`/admin/laporan/${laporan.id}`}>
                                                    <button className="rounded-full bg-[#0060A9] px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#004a80]"> {/* Tombol Detail Biru */}
                                                        Detail
                                                    </button>
                                                </Link>
                                                {/* Tombol Hapus bisa ditambahkan di sini jika perlu */}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                 {/* Pagination (Bisa ditambahkan nanti) */}
                 {/* <div className="mt-6 flex justify-center"> ... </div> */}
            </div>
        </div>
    );
}