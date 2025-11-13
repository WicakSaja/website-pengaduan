"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = 'http://localhost:5000';

// Style reusable
const inputStyle = "w-full px-5 py-3 border border-gray-300 rounded-full text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"; // Input Kapsul
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"; // Tombol biru kapsul

// Tipe data Kategori
interface Kategori {
  id: number;
  nama: string; // API Anda 'nama'
  deskripsi?: string; // API PUT Anda mungkin butuh deskripsi?
}

export default function EditKategoriPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>(); // Ambil ID dari URL
    const id = params?.id;

    // State untuk form, loading, error
    const [namaKategori, setNamaKategori] = useState('');
    // const [deskripsi, setDeskripsi] = useState(''); // Tambahkan jika API PUT perlu deskripsi
    const [isLoadingData, setIsLoadingData] = useState(true); // Loading untuk fetch data awal
    const [isUpdating, setIsUpdating] = useState(false); // Loading untuk tombol Ubah
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch data kategori yang akan diedit
    useEffect(() => {
        const fetchKategoriDetail = async () => {
            if (!id) {
                setError("ID Kategori tidak ditemukan.");
                setIsLoadingData(false);
                return;
            }
            setIsLoadingData(true);
            setError(null);
            const token = localStorage.getItem('adminToken');
            if (!token) { /* redirect */ setIsLoadingData(false); setError("Sesi tidak valid."); return; }

            try {
                // Panggil GET /api/admin/kategori/{id}
                const response = await fetch(`${API_BASE_URL}/api/admin/kategori/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                 if (!response.ok) { const errData = await response.json().catch(()=>({})); throw new Error(errData.message || `Error ${response.status}`); }
                const result = await response.json();
                if (result.success && result.data) {
                    setNamaKategori(result.data.nama); // Isi form dengan data yang ada
                    // setDeskripsi(result.data.deskripsi || ''); // Isi deskripsi jika ada
                } else {
                    throw new Error(result.message || `Gagal mengambil data kategori ID ${id}`);
                }
            } catch (err: any) {
                setError(err.message || 'Server error.');
                console.error(err);
                 if (err.message.includes('Unauthorized')) { /* handle logout */ }
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchKategoriDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Hanya fetch ulang jika ID berubah

    // 2. Fungsi handleSubmit untuk UPDATE (PUT)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return; // Pastikan ID ada
        setIsUpdating(true);
        setError(null);

        const token = localStorage.getItem('adminToken');
        if (!token) { /* redirect */ setIsUpdating(false); return; }

        // Data yang akan dikirim (sesuaikan dengan API PUT Anda)
        const formData = {
            nama: namaKategori,
            // deskripsi: deskripsi || undefined, // Kirim deskripsi jika ada
        };

        try {
            // Panggil PUT /api/admin/kategori/{id}
            const response = await fetch(`${API_BASE_URL}/api/admin/kategori/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.success) {
                alert('Kategori berhasil diperbarui!');
                router.push('/admin/kategori'); // Kembali ke daftar
            } else { throw new Error(result.message || 'Gagal memperbarui'); }
        } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } }
        finally { setIsUpdating(false); }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            <div className="relative z-10 w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-10">
                <h2 className="mb-8 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Ubah Data Kategori
                </h2>

                {isLoadingData ? (
                    <p className="text-center text-gray-500">Memuat data kategori...</p>
                ) : error ? (
                     <div className="text-center text-sm text-red-600 mb-4">{error}</div>
                     // Tetap tampilkan form meskipun error load? Atau sembunyikan?
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                id="nama_kategori"
                                className={inputStyle}
                                placeholder="Nama Kategori"
                                value={namaKategori} // Terisi data dari state
                                onChange={(e) => setNamaKategori(e.target.value)}
                                required
                            />
                        </div>

                        {/* Tampilkan error update jika ada */}
                        {error && !isLoadingData && (
                            <div className="text-center text-sm text-red-600">{error}</div>
                        )}


                        <div className="pt-2 text-center">
                            <button
                                type="submit"
                                className={buttonBlueCapsule}
                                disabled={isUpdating} // Disable saat proses update
                            >
                                {isUpdating ? 'Menyimpan...' : 'Ubah'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="mt-6 w-full max-w-lg text-right">
                <Link href="/admin/kategori">
                    <button className={buttonBlueCapsule} disabled={isUpdating}> {/* Disable juga saat update */}
                        Kembali
                    </button>
                </Link>
            </div>
        </div>
    );
}   