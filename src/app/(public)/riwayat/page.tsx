"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 

const API_BASE_URL = 'http://localhost:5000'; 

// Tipe data Riwayat
interface RiwayatItem {
    id: number;
    judul: string;
    status: string;
    tanggal_pengaduan: string;
    kategori?: { nama: string } | string; 
    bukti?: string[]; // Tambahkan bukti untuk gambar
}

// Komponen Card Riwayat (Style Baru)
const RiwayatCard = ({ item }: { item: RiwayatItem }) => (
     <Link 
        href={`/lacak/${item.id}`} // Link ke halaman detail
        className="block rounded-lg border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
     >
        {/* Gambar (ambil dari bukti jika ada) */}
        <div 
            className="h-32 w-full bg-gray-200 bg-cover bg-center" 
            style={{backgroundImage: `url(${item.bukti?.[0] ? API_BASE_URL + item.bukti[0] : '/placeholder-image.png'})`}} // Tampilkan bukti pertama
        ></div>
        {/* Konten Teks */}
        <div className="p-4">
            {/* Kategori (Biru Muda) */}
            <p className="mb-1 text-xs font-medium text-[#0060A9]"> 
                {typeof item.kategori === 'object' ? item.kategori.nama : item.kategori || 'Umum'}
            </p>
            {/* Judul (Hitam/Abu Tua) */}
            <h3 className="mb-2 text-sm font-semibold text-gray-800 leading-tight"> 
                {item.judul}
            </h3>
            {/* Tanggal (Biru Muda) */}
            <p className="text-xs font-medium text-[#0060A9]">
                {new Date(item.tanggal_pengaduan).toLocaleDateString('id-ID')}
            </p>
            {/* Status (Opsional, bisa ditambahkan jika perlu) */}
             {/* <p className={`mt-1 text-xs font-semibold ${item.status === 'selesai' ? 'text-green-600' : item.status === 'ditolak' ? 'text-red-600' : 'text-yellow-600'}`}>{item.status.toUpperCase()}</p> */}
        </div>
    </Link>
);


export default function RiwayatPage() {
    const { user, token, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [riwayatList, setRiwayatList] = useState<RiwayatItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Riwayat (Logika tetap sama)
    useEffect(() => {
        const fetchRiwayat = async () => { /* ... (Kode fetch GET /api/pengaduan/saya Anda) ... */ 
            if (!token) return; setIsLoading(true); setError(null);
            try { const response = await fetch(`${API_BASE_URL}/api/pengaduan/saya`, { headers: { 'Authorization': `Bearer ${token}` } }); const result = await response.json(); if (result.success && result.data && result.data.pengaduan) { setRiwayatList(result.data.pengaduan); } else { throw new Error(result.message || 'Gagal'); } } catch (err: any) { setError(err.message || 'Error'); console.error(err); } finally { setIsLoading(false); }
        };
         if (!authLoading && token) { fetchRiwayat(); } 
         else if (!authLoading && !token){ setError("Harus login."); setIsLoading(false); /* router.replace('/login?redirect=/riwayat'); */ }
    }, [token, router, authLoading]); // Hapus router jika tidak dipakai

     if (isLoading || authLoading) return <div className="flex min-h-screen items-center justify-center pt-28">Loading riwayat pengaduan...</div>;

    // --- STRUKTUR JSX BARU ---
    return (
        // Wrapper utama (background putih, padding atas)
        <main className="bg-white py-16 lg:py-24 pt-32 min-h-screen relative overflow-hidden"> 
             {/* Tambahkan elemen untuk pola dekoratif (opsional) */}
             {/* <div className="absolute top-20 right-0 w-40 h-80 bg-red-100 opacity-50 -z-10 pattern-placeholder-tr"></div> */}
             {/* <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-100 opacity-50 -z-10 pattern-placeholder-bl"></div> */}

             <div className="container mx-auto max-w-5xl px-6 relative z-10"> {/* Kontainer di atas pola */}
                 {/* Judul Halaman */}
                 <h2 className="mb-10 text-center text-3xl font-bold text-[#004A80] md:text-4xl">
                    RIWAYAT PENGADUAN
                </h2>

                 {error && <p className="mb-6 text-center text-red-600">{error}</p>}

                 {!error && riwayatList.length === 0 && !isLoading && (
                    <p className="text-center text-gray-500">Anda belum memiliki riwayat pengaduan.</p>
                 )}

                 {/* Grid Riwayat (4 kolom) */}
                 {!error && riwayatList.length > 0 && (
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                         {riwayatList.map((item) => (
                            <RiwayatCard key={item.id} item={item} />
                         ))}
                     </div>
                 )}

                 {/* Tombol Kembali (Biru Kapsul) */}
                <div className="mt-10 text-center">
                    <Link href="/"> 
                        <button className="rounded-full bg-[#0060A9] px-8 py-3 text-sm font-semibold text-white hover:bg-[#004a80]">
                            Kembali ke Beranda
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}