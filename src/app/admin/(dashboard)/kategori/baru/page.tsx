"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:5000';

// Style reusable baru (adaptasi)
const inputStyle = "w-full px-5 py-3 border border-gray-300 rounded-full text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"; // Input Kapsul
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"; // Tombol biru kapsul

export default function TambahKategoriPage() {
    const router = useRouter();
    const [namaKategori, setNamaKategori] = useState('');
    // Hapus state deskripsi
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fungsi handleSubmit (Hanya kirim 'nama')
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError("Sesi tidak valid."); // Tambahkan pesan error
            setIsLoading(false);
            // Pertimbangkan redirect: router.replace('/admin/login');
            return;
        }

        // Data hanya 'nama' sesuai API
        const formData = {
            nama: namaKategori,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/kategori`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert('Kategori baru berhasil ditambahkan!');
                router.push('/admin/kategori'); // Kembali ke daftar
            } else {
                // Tampilkan pesan error dari API
                throw new Error(result.message || 'Gagal menambahkan kategori');
            }
        } catch (err: any) {
            setError(err.message || 'Tidak dapat terhubung ke server.');
            console.error(err);
            if (err.message?.includes('Unauthorized') || err.message?.includes('Forbidden')) {
                // Handle token invalid
                 setError("Sesi tidak valid atau hak akses ditolak.");
                 // Pertimbangkan redirect otomatis ke login
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Wrapper relatif untuk pola
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]"> {/* Center content */}
            {/* ... (Placeholder Pola Dekoratif) ... */}

            {/* Kartu Form Putih (Terpusat) */}
            <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-10"> {/* max-w-lg */}
                {/* Judul Form */}
                <h2 className="mb-8 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Tambah Data Kategori
                </h2>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Field Nama Kategori */}
                    <div>
                        {/* Label tidak ada di desain, pakai placeholder */}
                        <input
                            type="text"
                            id="nama_kategori"
                            className={inputStyle} // Style Kapsul
                            placeholder="Nama Kategori"
                            value={namaKategori}
                            onChange={(e) => setNamaKategori(e.target.value)}
                            required
                        />
                    </div>

                    {/* Hapus Field Deskripsi */}

                    {/* Tampilkan Error */}
                    {error && (
                        <div className="text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Tombol Tambah (Biru Kapsul, di dalam form) */}
                    <div className="pt-2 text-center">
                        <button
                            type="submit"
                            className={buttonBlueCapsule}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menyimpan...' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Tombol Kembali (di luar Card) */}
            <div className="mt-6 w-full max-w-lg text-right"> {/* Samakan lebar & rata kanan */}
                <Link href="/admin/kategori">
                    <button className={buttonBlueCapsule}>
                        Kembali
                    </button>
                </Link>
            </div>
        </div>
    );
}