"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:5000';

// Style reusable
const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]";
const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

// Tipe data Admin 
interface AdminData {
    id: number;
    nama: string;
    email: string; 
   
}

export default function EditAdminPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const id = params?.id;

    // State form
    const [namaAdmin, setNamaAdmin] = useState('');
    const [emailAdmin, setEmailAdmin] = useState(''); // State untuk email
    const [passwordAdmin, setPasswordAdmin] = useState(''); // Password baru (opsional)

    // State loading & error
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data admin yang akan diedit
    useEffect(() => {
        const fetchAdminDetail = async () => {
            if (!id) { setIsLoadingData(false); setError("ID Admin tidak ditemukan."); return; }
            setIsLoadingData(true); setError(null);
            const token = localStorage.getItem('adminToken');
            if (!token) { /* redirect */ setIsLoadingData(false); setError("Sesi tidak valid."); return; }

            try {
                const response = await fetch(`${API_BASE_URL}/api/master/admin/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
                const result = await response.json();
                if (result.success && result.data) {
                    setNamaAdmin(result.data.nama || '');
                    setEmailAdmin(result.data.email || ''); // Isi state email
                } else { throw new Error(result.message || `Gagal ambil data ID ${id}`); }
            } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
            finally { setIsLoadingData(false); }
        };
        fetchAdminDetail();

    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        setIsUpdating(true); setError(null);
        const token = localStorage.getItem('adminToken');
        if (!token) { /* redirect */ setIsUpdating(false); return; }
        const updateData: any = {
            nama: namaAdmin,
            email: emailAdmin,
        };
        if (passwordAdmin) {
            updateData.password = passwordAdmin;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/master/admin/${id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
            const result = await response.json();
            if (result.success) {
                alert('Data admin berhasil diperbarui!');
                router.push('/admin/kelola-admin'); // Kembali ke daftar
            } else { throw new Error(result.message || 'Gagal memperbarui'); }
        } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
        finally { setIsUpdating(false); }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-10">
                <h2 className="mb-8 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Ubah Data Admin
                </h2>

                {isLoadingData ? (
                    <p className="text-center text-gray-500">Memuat data admin...</p>
                ) : error && !namaAdmin ? ( // Tampilkan error fatal jika load gagal
                     <div className="text-center text-sm text-red-600 mb-4">{error}</div>
                ): (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Field Nama Lengkap */}
                        <div className="text-left">
                            <label htmlFor="nama_lengkap" className={labelStyle}>Nama Lengkap</label>
                            <input
                                type="text"
                                id="nama_lengkap"
                                className={inputStyle}
                                placeholder="Nama Lengkap Admin"
                                value={namaAdmin}
                                onChange={(e) => setNamaAdmin(e.target.value)}
                                required
                            />
                        </div>

                        {/* Field Username/Email */}
                        <div className="text-left">
                            <label htmlFor="email_admin" className={labelStyle}>Email (untuk login)</label> {/* Ganti label */}
                            <input
                                type="email" // Ganti type
                                id="email_admin"
                                className={inputStyle}
                                placeholder="Email Admin"
                                value={emailAdmin}
                                onChange={(e) => setEmailAdmin(e.target.value)}
                                required
                            />
                        </div>

                        {/* Field Password Baru */}
                        <div className="text-left">
                            <label htmlFor="password_admin" className={labelStyle}>Password Baru (Opsional)</label>
                            <input
                                type="password"
                                id="password_admin"
                                className={inputStyle}
                                placeholder="Kosongkan jika tidak ingin diubah"
                                value={passwordAdmin}
                                onChange={(e) => setPasswordAdmin(e.target.value)}
                            />
                        </div>

                        {/* Tampilkan error update jika ada */}
                        {error && !isLoadingData && (
                            <div className="text-center text-sm text-red-600 pt-2">{error}</div>
                        )}

                        {/* Tombol Ubah */}
                        <div className="pt-4 text-center">
                            <button
                                type="submit"
                                className={buttonBlueCapsule}
                                disabled={isUpdating}
                            >
                                {isUpdating ? 'Menyimpan...' : 'Ubah'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Tombol Kembali */}
            <div className="mt-6 w-full max-w-lg text-right">
                <Link href="/admin/kelola-admin">
                    <button className={buttonBlueCapsule} disabled={isUpdating}>
                        Kembali
                    </button>
                </Link>
            </div>
        </div>
    );
}