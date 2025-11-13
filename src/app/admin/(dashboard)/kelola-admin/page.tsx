"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000';

// Tipe data Admin (sesuaikan dengan response GET /api/master/admin)
interface AdminRow {
  id: number;
  nama: string;      
  email?: string;   
  username?: string;  
  created_at?: string; 
}

export default function KelolaAdminPage() {
    const router = useRouter();
    const [adminList, setAdminList] = useState<AdminRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data admin (GET /api/master/admin)
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
                // Redirect jika perlu: router.replace('/admin/login');
                return;
            }

            try {
                // Panggil API GET /api/master/admin
                const response = await fetch(`${API_BASE_URL}/api/master/admin`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                 if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
                const result = await response.json();
                // Sesuaikan path data ('admins'?)
                if (result.success && Array.isArray(result.data?.admins)) {
                    setAdminList(result.data.admins);
                } else { throw new Error(result.message || 'Gagal mengambil data admin'); }
            } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
            finally { setIsLoading(false); }
        };
        fetchData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle Hapus Admin (DELETE /api/master/admin/{id})
    const handleDelete = async (id: number) => {
        if (!confirm(`Yakin ingin menghapus admin ID: ${id}?`)) return;

        const token = localStorage.getItem('adminToken');
         if (!token) { /* handle error */ return; }
        setError(null);

        try {
            // Panggil API DELETE /api/master/admin/{id}
            const response = await fetch(`${API_BASE_URL}/api/master/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
             if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
            const result = await response.json();
            if (result.success) {
                alert('Admin berhasil dihapus.');
                setAdminList(prev => prev.filter(a => a.id !== id)); // Hapus dari state
            } else { throw new Error(result.message || `Gagal hapus ID ${id}`); }
        } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
    };

    return (
        <div className="relative">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            {/* Kartu Tabel Putih */}
            <div className="relative z-10 rounded-xl bg-white p-6 shadow-lg md:p-8">
                <h2 className="mb-6 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Data Admin
                </h2>

                {isLoading && <p className="text-center text-gray-500">Loading data admin...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}

                {/* Tabel Admin */}
                {!isLoading && !error && (
                    <div className="mb-6 overflow-x-auto"> {/* Margin bawah sebelum tombol */}
                        <table className="w-full min-w-[700px] text-left">

                            {/* Header Tabel (Biru Tua) */}
                            <thead className="bg-[#004a80] text-white">
                                <tr>
                                    <th className="rounded-tl-lg p-3 px-4 text-sm font-semibold">No</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Nama Lengkap</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Username/Email</th> {/* Ganti jadi Username/Email */}
                                    <th className="p-3 px-4 text-sm font-semibold">Password</th> {/* Tetap ada, tapi isi ***** */}
                                    <th className="rounded-tr-lg p-3 px-4 text-sm font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>

                            {/* Body Tabel */}
                            <tbody>
                                {adminList.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-500">Tidak ada data admin.</td>
                                    </tr>
                                ) : (
                                    adminList.map((admin, index) => (
                                        <tr key={admin.id} className="border-b border-gray-100 last:border-b-0">
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{index + 1}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{admin.nama || '-'}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{admin.username || admin.email || '-'}</td> {/* Tampilkan username atau email */}
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">********</td> {/* Password disamarkan */}
                                            <td className="p-3 px-4 text-right whitespace-nowrap">
                                                <Link href={`/admin/kelola-admin/edit/${admin.id}`}> {/* Link ke Edit Admin */}
                                                    <button className="mr-2 rounded-full bg-[#0060A9] px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#004a80]">
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="rounded-full bg-red-600 px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700">
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

                {/* Tombol Tambah Admin (Biru Kapsul, Rata Kanan) */}
                {!isLoading && (
                     <div className="text-right">
                        <Link href="/admin/kelola-admin/baru">
                            <button className="rounded-full bg-[#0060A9] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004a80]">
                                Tambah Admin
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}