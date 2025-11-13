// src/app/admin/(dashboard)/kelola-pengguna/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000';

interface PenggunaRow {
  id: number;
  nama: string; 
  nik?: string | null;
  telepon?: string | null; 
  alamat?: string | null; 
  email: string; 
  created_at?: string; 
}

export default function KelolaPenggunaPage() {
    const router = useRouter();
    const [penggunaList, setPenggunaList] = useState<PenggunaRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); setError(null);
            const token = localStorage.getItem('adminToken');
            const userString = localStorage.getItem('adminUser');
            let role = '';
            try { role = userString ? JSON.parse(userString).role : ''; } catch { role = ''; }

            if (!token || role !== 'master_admin') {
                setError("Akses ditolak.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/master/pengguna`, { // ASUMSI ENDPOINT
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                 if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
                const result = await response.json();
                if (result.success && Array.isArray(result.data?.users)) {
                    setPenggunaList(result.data.users);
                } else { throw new Error(result.message || 'Gagal mengambil data pengguna'); }
            } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
            finally { setIsLoading(false); }
        };
        fetchData();
    }, []); 


    const handleDelete = async (id: number) => {
        if (!confirm(`Yakin ingin menghapus pengguna ID: ${id}?`)) return;

        const token = localStorage.getItem('adminToken');
         if (!token) { /* handle error */ return; }
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/master/pengguna/${id}`, { // ASUMSI ENDPOINT
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
             if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
            const result = await response.json();
            if (result.success) {
                alert('Pengguna berhasil dihapus.');
                // Refresh data
                setPenggunaList(prev => prev.filter(p => p.id !== id)); // Hapus dari state
            } else { throw new Error(result.message || `Gagal hapus ID ${id}`); }
        } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
    };

    return (
        <div className="relative">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            {/* Kartu Tabel Putih */}
            <div className="relative z-10 rounded-xl bg-white p-6 shadow-lg md:p-8">
                <h2 className="mb-6 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Data Pengguna
                </h2>

                {isLoading && <p className="text-center text-gray-500">Loading data pengguna...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}

                {/* Tabel Pengguna */}
                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left"> {/* Min-width lebih besar */}

                            {/* Header Tabel (Biru Tua) */}
                            <thead className="bg-[#004a80] text-white">
                                <tr>
                                    <th className="rounded-tl-lg p-3 px-4 text-sm font-semibold">No</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Nama</th>
                                    <th className="p-3 px-4 text-sm font-semibold">NIK</th>
                                    <th className="p-3 px-4 text-sm font-semibold">No. HP</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Alamat</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Email</th> {/* Ganti Username jadi Email */}
                                    {/* <th className="p-3 px-4 text-sm font-semibold">Password</th> Hapus Kolom Password */}
                                    <th className="rounded-tr-lg p-3 px-4 text-sm font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>

                            {/* Body Tabel */}
                            <tbody>
                                {penggunaList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-gray-500">Tidak ada data pengguna.</td> {/* Colspan 7 */}
                                    </tr>
                                ) : (
                                    penggunaList.map((pengguna, index) => (
                                        <tr key={pengguna.id} className="border-b border-gray-100 last:border-b-0">
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{index + 1}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{pengguna.nama || '-'}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{pengguna.nik || '-'}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{pengguna.telepon || '-'}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{pengguna.alamat || '-'}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{pengguna.email || '-'}</td>
                                            {/* Hapus Kolom Password */}
                                            {/* Aksi */}
                                            <td className="p-3 px-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(pengguna.id)}
                                                    className="rounded-full bg-red-600 px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"> {/* Hapus Merah */}
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                 {/* Pagination (Bisa ditambahkan nanti) */}
            </div>
        </div>
    );
}