"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000';

// Tipe data Kategori
interface Kategori {
  id: number;
  nama: string;
  deskripsi?: string;
}

// Hapus Komponen KategoriCard (tidak dipakai lagi)

export default function DataKategoriPage() {
    const router = useRouter();
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fungsi Fetch data (logika tetap sama)
    const fetchKategori = async () => { /* ... (kode fetch GET /api/kategori Anda) ... */ setIsLoading(true); setError(null); const token = localStorage.getItem('adminToken'); try { const response = await fetch(`${API_BASE_URL}/api/kategori`); const result = await response.json(); if (result.success && result.data?.kategori) { setKategoriList(result.data.kategori); } else { throw new Error(result.message || 'Gagal ambil data'); } } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); } finally { setIsLoading(false); } };

    // useEffect (logika tetap sama)
    useEffect(() => { /* ... (kode useEffect Anda untuk cek token & fetchKategori) ... */ const token = localStorage.getItem('adminToken'); if (!token) { /* redirect */ setIsLoading(false); return; } fetchKategori(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fungsi Hapus Kategori (logika tetap sama)
    const handleDelete = async (id: number) => { /* ... (kode fetch DELETE /api/admin/kategori/{id} Anda) ... */ if (!confirm(`Yakin hapus ID: ${id}?`)) return; const token = localStorage.getItem('adminToken'); if (!token) { /* redirect */ return; } setError(null); try { const response = await fetch(`${API_BASE_URL}/api/admin/kategori/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); const result = await response.json(); if (result.success) { alert('Berhasil dihapus.'); fetchKategori(); } else { throw new Error(result.message || `Gagal hapus ID ${id}`); } } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /* handle logout */ } } };

    return (
        // Wrapper relatif untuk pola
        <div className="relative">
            {/* ... (Placeholder Pola Dekoratif) ... */}

            {/* Kartu Tabel Putih (Style dari data-kategori.html) */}
            <div className="relative z-10 rounded-xl bg-white p-6 shadow-lg md:p-8"> {/* Padding disesuaikan */}
                {/* Judul Halaman */}
                <h2 className="mb-6 text-center text-xl font-bold text-[#004A80] md:text-2xl">
                    Data Kategori
                </h2>

                {isLoading && <p className="text-center text-gray-500">Loading data kategori...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}

                {/* Tabel Kategori */}
                {!isLoading && !error && (
                    <div className="mb-6 overflow-x-auto"> {/* Margin bawah sebelum tombol tambah */}
                        <table className="w-full min-w-[500px] text-left"> {/* Min-width */}

                            {/* Header Tabel (Biru Tua, Rounded Top) */}
                            <thead className="bg-[#004a80] text-white">
                                <tr>
                                    <th className="rounded-tl-lg p-3 px-4 text-sm font-semibold">No</th>
                                    <th className="p-3 px-4 text-sm font-semibold">Kategori</th>
                                    <th className="rounded-tr-lg p-3 px-4 text-sm font-semibold text-right">Aksi</th> {/* Rata kanan */}
                                </tr>
                            </thead>

                            {/* Body Tabel */}
                            <tbody>
                                {kategoriList.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-4 text-center text-gray-500">Belum ada data kategori.</td>
                                    </tr>
                                ) : (
                                    kategoriList.map((kategori, index) => (
                                        <tr key={kategori.id} className="border-b border-gray-100 last:border-b-0">
                                            {/* Data (Teks Biru Muda) */}
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{index + 1}</td>
                                            <td className="p-3 px-4 text-sm font-medium text-[#0060A9]">{kategori.nama}</td>
                                            {/* Kolom Aksi (Tombol Edit Biru, Hapus Merah) */}
                                            <td className="p-3 px-4 text-right whitespace-nowrap"> {/* Rata kanan */}
                                                <Link href={`/admin/kategori/edit/${kategori.id}`}>
                                                    <button className="mr-2 rounded-full bg-[#0060A9] px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#004a80]"> {/* Edit Biru */}
                                                        Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(kategori.id)}
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

                {/* Tombol Tambah Kategori (Biru Kapsul, Rata Kanan) */}
                {!isLoading && ( // Sembunyikan tombol jika loading
                     <div className="text-right">
                        <Link href="/admin/kategori/baru">
                            <button className="rounded-full bg-[#0060A9] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004a80]">
                                Tambah Kategori
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}