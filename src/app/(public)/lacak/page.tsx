"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = 'http://localhost:5000';

// Tipe data PengaduanDetail
interface PengaduanDetail {
    id: number;
    judul: string;
    isi_laporan: string;
    lokasi: string;
    tanggal_pengaduan: string;
    kategori?: { nama: string };
    status: 'pending' | 'proses' | 'selesai' | 'ditolak';
    komentar?: Array<{ by: string; message: string; tanggal: string }>;
    bukti?: string[];
}

// Komponen Timeline Step
const TimelineStep = ({ title, description, date, isComplete }: { title: string; description?: string; date?: string; isComplete: boolean }) => (
    <div className={`relative mb-6 pl-8`}>
        <div className={`absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-[#0060A9] ${isComplete ? 'bg-[#0060A9]' : 'bg-white'}`}></div>
        <div className="pl-3">
            <h4 className={`font-semibold text-[#004A80]`}>{title}</h4>
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
            {date && <p className="mt-1 text-xs text-gray-400">{date ? new Date(date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : ''}</p>}
        </div>
    </div>
);


export default function LacakPage() {
    const { user, token, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // State Lacak Pengaduan
    const [lacakId, setLacakId] = useState('');
    const [hasilLacak, setHasilLacak] = useState<PengaduanDetail | null>(null);
    const [lacakLoading, setLacakLoading] = useState(false);
    const [lacakError, setLacakError] = useState<string | null>(null);

    // Handle Submit Lacak
    const handleLacakSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) { setLacakError('Anda harus login untuk melacak.'); return; }
        if (!lacakId.trim()) { setLacakError('Masukkan ID Laporan atau Judul Laporan.'); return; }
        setLacakLoading(true);
        setLacakError(null);
        setHasilLacak(null);

        try {
            // NOTE: API Anda hanya mendukung GET by ID. Pencarian by judul mungkin perlu endpoint baru.
            // Untuk saat ini, kita asumsikan input adalah ID.
            const response = await fetch(`${API_BASE_URL}/api/pengaduan/saya/${lacakId}`, {
                method: 'GET', headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` }));
                throw new Error(errorData.message || `Gagal (${response.status})`);
            }

            const result = await response.json();

            if (result.success && result.data && result.data.pengaduan) {
                setHasilLacak(result.data.pengaduan);
            } else {
                setLacakError(result.message || `Pengaduan ID ${lacakId} tidak ditemukan atau bukan milik Anda.`);
            }
        } catch (err: any) {
            setLacakError(err.message || 'Tidak dapat terhubung ke server.');
            console.error("Lacak Error:", err);
            if (err.message?.includes('Unauthorized')) {
                 setLacakError("Sesi tidak valid.");
                 // Pertimbangkan redirect
            }
        } finally {
            setLacakLoading(false);
        }
    };

    // Fungsi Helper Timeline
    const isStepComplete = (stepStatus: PengaduanDetail['status'], currentStatus: PengaduanDetail['status'] | undefined): boolean => {
         if (!currentStatus || currentStatus === 'ditolak') return false;
         const order = ['pending', 'proses', 'selesai'];
         return order.indexOf(currentStatus) >= order.indexOf(stepStatus);
    };
    const findComment = (keyword: string): { message?: string; tanggal?: string } => {
        const comment = hasilLacak?.komentar?.find(k => k.message?.toLowerCase().includes(keyword.toLowerCase()));
        return { message: comment?.message, tanggal: comment?.tanggal };
    };
    const formatTanggal = (tanggalString: string | undefined): string => {
        if (!tanggalString) return '-';
        try { return new Date(tanggalString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }); }
        catch { return tanggalString; }
    }

    // Auth Guard
    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login?redirect=/lacak');
        }
    }, [authLoading, user, router]);

    if (authLoading) { return <div className="flex min-h-screen items-center justify-center pt-28">Memuat halaman...</div>; }
    if (!user && !authLoading) { return <div className="flex min-h-screen items-center justify-center pt-28">Mengalihkan ke login...</div>; }

    return (
        <main className="bg-white py-16 lg:py-24 pt-32 min-h-screen relative overflow-hidden">
            {/* ... (Pola Dekoratif jika ada) ... */}

            <div className="container mx-auto max-w-4xl px-6 relative z-10">
                <h2 className="mb-10 text-center text-3xl font-bold text-[#004A80] md:text-4xl">
                    LACAK PENGADUAN ANDA
                </h2>

                {/* === SECTION PANDUAN BARU === */}
                <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
                    <h3 className="mb-4 text-center text-lg font-semibold text-[#0060A9]">
                        Panduan Penggunaan Fitur Lacak Pengaduan
                    </h3>
                    <div className="space-y-4 text-sm text-gray-700">
                        <div>
                            <h4 className="font-semibold text-[#004A80]">Cara Menggunakan:</h4>
                            <ol className="list-decimal space-y-1 pl-5 mt-1">
                                <li>Masukkan ID Laporan atau Judul Masalah pada kolom pencarian di bagian atas halaman.</li>
                                <li>Contoh ID: `JUN-2025-0012`</li>
                                <li>Contoh Judul: `Jalan Rusak di Depan SD Junrejo 2`</li>
                                <li>Tekan ikon pencarian 🔍 atau tombol Enter untuk mulai melacak.</li>
                                <li>Sistem akan menampilkan informasi berikut: Judul Masalah, Deskripsi Masalah, Tanggal Laporan, Lokasi Kejadian.</li>
                                <li>Lihat bagian Status di bawah untuk mengetahui tahapan penanganan laporan Anda.</li>
                            </ol>
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#004A80]">Keterangan Status:</h4>
                            <ul className="list-disc space-y-1 pl-5 mt-1">
                                <li>**Diterima** → Laporan telah masuk ke sistem dan menunggu verifikasi dari petugas.</li>
                                <li>**Diverifikasi** → Petugas sudah meninjau dan memvalidasi kebenaran laporan.</li>
                                <li>**Dalam Proses** → Laporan sedang ditangani oleh instansi atau petugas terkait.</li>
                                <li>**Selesai** → Masalah telah diselesaikan dan laporan dinyatakan tuntas.</li>
                                <li>**Ditolak** → Laporan tidak dapat diproses karena data tidak valid, tidak lengkap, atau di luar kewenangan kecamatan.</li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-[#004A80]">Catatan:</h4>
                            <ul className="list-disc space-y-1 pl-5 mt-1">
                                <li>Jika laporan tidak muncul, pastikan ID atau judul laporan benar dan telah dikirim sebelumnya.</li>
                                <li>Laporan baru mungkin membutuhkan waktu beberapa jam untuk tampil dalam sistem pelacakan.</li>
                                <li>Jika laporan Anda ditolak, Anda dapat membuat laporan baru dengan data yang lebih lengkap, atau menghubungi petugas Kecamatan Junrejo untuk klarifikasi.</li>
                            </ul>
                        </div>
                    </div>
                </section>
                {/* === AKHIR SECTION PANDUAN === */}

                {/* Search Bar */}
                <form onSubmit={handleLacakSubmit} className="relative mb-8">
                    <input
    type="text"
    placeholder="Lacak Berdasarkan ID Laporan atau Judul Laporan"
    value={lacakId}
    onChange={(e) => setLacakId(e.target.value)}
    className="w-full rounded-full border border-gray-300 p-4 pr-28 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0060A9] focus:border-transparent text-gray-900" // <-- TAMBAHKAN text-gray-900
/>
  
                    <button
                        type="submit"
                        disabled={lacakLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#0060A9] px-6 py-2 text-sm font-semibold text-white hover:bg-[#004a80] disabled:bg-gray-400"
                    >
                        {lacakLoading ? '...' : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>}
                    </button>
                </form>

                {lacakLoading && <p className="mb-6 text-center text-gray-600">Mencari...</p>}
                {lacakError && <p className="mb-6 text-center text-red-600">{lacakError}</p>}

                {/* Hasil Detail */}
                {hasilLacak && !lacakLoading && (
                    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-10">
                        <h3 className="mb-6 text-center text-lg font-semibold text-[#0060A9]">
                            PENGADUAN ANDA
                        </h3>
                        {/* Detail Info */}
                        <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
                             <div
                                className="h-24 w-24 flex-shrink-0 rounded-lg border bg-gray-200 bg-cover bg-center md:h-32 md:w-32"
                                style={{ backgroundImage: `url(${hasilLacak.bukti?.[0] ? API_BASE_URL + hasilLacak.bukti[0] : '/placeholder-image.png'})` }}
                             ></div>
                             <div className="flex-1 text-center md:text-left">
                                 <div className="space-y-2 text-sm">
                                     <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Judul:</span> {hasilLacak.judul}</p>
                                     <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Kategori:</span> {hasilLacak.kategori?.nama || '-'}</p>
                                     <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Tanggal:</span> {formatTanggal(hasilLacak.tanggal_pengaduan)}</p>
                                     <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Lokasi:</span> {hasilLacak.lokasi}</p>
                                     <p><span className="inline-block w-24 font-semibold text-[#0060A9] align-top">Deskripsi:</span> <span className="inline-block w-[calc(100%-7rem)]">{hasilLacak.isi_laporan}</span></p>
                                 </div>
                             </div>
                        </div>

                        <hr className="my-8 border-t border-[#007BCC]" />

                        {/* Timeline Status */}
                        <h3 className="mb-6 text-center text-lg font-semibold text-[#0060A9]">
                            STATUS DAN TANGGAPAN
                        </h3>
                        <div className="relative pl-5 before:absolute before:left-[0.5rem] before:top-1 before:bottom-1 before:w-0.5 before:bg-[#0060A9] before:rounded-full">
                            <TimelineStep title="Diterima" isComplete={isStepComplete('pending', hasilLacak.status)} date={hasilLacak.tanggal_pengaduan} />
                            <TimelineStep title="Diproses" description={findComment('proses').message || (isStepComplete('proses', hasilLacak.status) ? 'Laporan sedang diproses.' : '')} isComplete={isStepComplete('proses', hasilLacak.status)} date={findComment('proses').tanggal} />
                            <TimelineStep title="Selesai" description={findComment('selesai').message || (isStepComplete('selesai', hasilLacak.status) ? 'Laporan telah diselesaikan.' : '')} isComplete={isStepComplete('selesai', hasilLacak.status)} date={findComment('selesai').tanggal} />
                            {hasilLacak.status === 'ditolak' && ( <TimelineStep title="Ditolak" description={findComment('ditolak').message || 'Laporan ditolak.'} isComplete={true} date={findComment('ditolak').tanggal} /> )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}