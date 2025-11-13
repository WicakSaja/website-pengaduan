"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:5000';

// Style reusable baru (adaptasi dari desain baru)
const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]"; // Label biru di atas
const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"; // Input rounded-lg
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"; // Tombol biru kapsul

export default function TambahAdminPage() {
    const router = useRouter();

    // State untuk form (Nama, Username/Email, Password)
    // Sesuaikan field dengan API POST /api/master/admin (nama, email, password)
    const [namaAdmin, setNamaAdmin] = useState('');
    const [emailAdmin, setEmailAdmin] = useState(''); // Ganti username jadi email? API Anda pakai 'email'
    const [passwordAdmin, setPasswordAdmin] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fungsi handleSubmit (POST /api/master/admin)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('adminToken');
        // Tambahkan cek role master admin jika perlu
        if (!token) { /* redirect */ setIsLoading(false); return; }

        // Data sesuai API POST /api/master/admin
        const formData = {
            nama: namaAdmin,
            email: emailAdmin, // Kirim email
            password: passwordAdmin,
            // role: 'admin' // Role mungkin otomatis di backend?
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/master/admin`, { // Endpoint master admin
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
             if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
            const result = await response.json();
            if (result.success) {
                alert('Admin baru berhasil ditambahkan!');
                router.push('/admin/kelola-admin'); // Kembali ke daftar admin
            } else { throw new Error(result.message || 'Gagal menambahkan admin'); }
        } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
        finally { setIsLoading(false); }
    };

    return (
        // Wrapper relatif untuk pola
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            {/* Kartu Form Putih (Terpusat, style baru) */}
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-10">
                {/* Judul Form */}
                <h2 className="mb-8 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Tambah Data Admin
                </h2>

                {/* Form */}
                <form className="space-y-5" onSubmit={handleSubmit}> {/* Kurangi space-y jika perlu */}
                    {/* Field Nama Lengkap */}
                    <div className="text-left"> {/* Pastikan label rata kiri */}
                        <label htmlFor="nama_lengkap" className={labelStyle}>Nama Lengkap</label>
                        <input
                            type="text"
                            id="nama_lengkap"
                            className={inputStyle} // Style rounded-lg
                            placeholder="Masukkan Nama Lengkap"
                            value={namaAdmin}
                            onChange={(e) => setNamaAdmin(e.target.value)}
                            required
                        />
                    </div>

                    {/* Field Username/Email */}
                    <div className="text-left">
                         <label htmlFor="email_admin" className={labelStyle}>Email</label> {/* Ganti jadi Email */}
                        <input
                            type="email" // Ganti type jadi email
                            id="email_admin"
                            className={inputStyle}
                            placeholder="Masukkan Email (untuk login)"
                            value={emailAdmin}
                            onChange={(e) => setEmailAdmin(e.target.value)}
                            required
                        />
                    </div>

                    {/* Field Password */}
                    <div className="text-left">
                        <label htmlFor="password_admin" className={labelStyle}>Password</label>
                        <input
                            type="password"
                            id="password_admin"
                            className={inputStyle}
                            placeholder="Masukkan Password"
                            value={passwordAdmin}
                            onChange={(e) => setPasswordAdmin(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tampilkan Error */}
                    {error && (
                        <div className="text-center text-sm text-red-600 pt-2">{error}</div>
                    )}

                    {/* Tombol Simpan (Biru Kapsul, di dalam form) */}
                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            className={buttonBlueCapsule}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tombol Kembali (di luar Card) */}
            <div className="mt-6 w-full max-w-lg text-right">
                <Link href="/admin/kelola-admin">
                    <button className={buttonBlueCapsule} disabled={isLoading}>
                        Kembali
                    </button>
                </Link>
            </div>
        </div>
    );
}