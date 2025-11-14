"use client";

import { useState } from "react";
import Link from "next/link";

export default function LacakPage() {
    const [searchId, setSearchId] = useState("");

    const handleSearch = () => {
        if (searchId.trim() !== "") {
            window.location.href = `/riwayat/${searchId}`;
        }
    };

    return (
        <main className="pt-28 min-h-screen bg-white relative overflow-hidden">

            {/* Bagian PANDUAN */}
            <h1 className="text-3xl font-bold text-[#004A80] text-center mb-8">
                PANDUAN
            </h1>

            <div className="max-w-3xl mx-auto px-6 mb-12">
                <p className="text-gray-700 text-center mb-4">
                    Pada Isi Bagian Dalam Lapor, Hal ini Warga Harus Mengisi Secara Lengkap Data Informasi
                    Terkait Lokasi Masalah, Kapan Kejadian, Tipe/Kategori Masalah, dan Deskripsi Kejadian.
                </p>

                <ol className="list-decimal pl-6 text-gray-700 leading-relaxed space-y-1">
                    <li>Pilih Menu Lapor pada Navigasi</li>
                    <li>Isi Data Pengaduan Anda secara lengkap</li>
                    <li>Unggah Lampiran Foto (Opsional tapi sangat membantu)</li>
                    <li>Klik tombol Kirim</li>
                    <li>Tunggu verifikasi dari Petugas</li>
                    <li>Pantau status melalui menu Lacak</li>
                </ol>
            </div>

            {/* Garis biru */}
            <div className="w-full h-[2px] bg-[#0060A9] opacity-50 mb-12"></div>

            {/* Bagian Lacak Pengaduan */}
            <h2 className="text-2xl font-bold text-[#004A80] text-center mb-6">
                LACAK PENGADUAN ANDA
            </h2>

            <div className="max-w-xl mx-auto px-6 mb-20">
                <div className="relative">
                    <input
    type="text"
    placeholder="Masukkan ID Pengaduan Anda..."
    value={searchId}
    onChange={(e) => setSearchId(e.target.value)}
    className="
        w-full 
        border border-[#0060A9]/60 
        rounded-full 
        px-4 py-3 pr-12 
        outline-none 
        shadow 
        text-gray-900
        placeholder-gray-500
        bg-white
        focus:ring-2 focus:ring-[#0060A9] 
    "
/>
                    {/* Ikon Search */}
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0060A9]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="#0060A9">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
                        </svg>
                    </button>
                </div>
            </div>

        </main>
    );
}
