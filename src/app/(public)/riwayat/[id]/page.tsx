"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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

// Komponen Timeline Step (Style Baru)
const TimelineStep = ({ title, description, date, isComplete }: { title: string; description?: string; date?: string; isComplete: boolean }) => (
    // Wrapper relatif, padding kiri untuk garis, margin bawah
    <div className={`relative mb-6 pl-8`}>
        {/* Lingkaran ikon (lebih besar, warna solid/outline) */}
        <div className={`absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-[#0060A9] ${isComplete ? 'bg-[#0060A9]' : 'bg-white'}`}></div>
        {/* Konten (padding kiri agar tidak tertimpa ikon) */}
        <div className="pl-3">
            {/* Judul Status (Biru Tua, Bold) */}
            <h4 className={`font-semibold text-[#004A80]`}>{title}</h4>
            {/* Deskripsi/Komentar (Abu-abu) */}
            {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
            {/* Tanggal (Abu-abu muda, jika ada) */}
            {date && <p className="mt-1 text-xs text-gray-400">{date ? new Date(date).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : ''}</p>}
        </div>
    </div>
);


export default function DetailLacakPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const id = params?.id;
    const { user, token, isLoading: authLoading } = useAuth();

    const [pengaduan, setPengaduan] = useState<PengaduanDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect Fetch Data (Logika tetap sama)
    useEffect(() => {
        // ... (Kode fetch GET /api/pengaduan/saya/{id} Anda yang sudah ada) ...
        const isValidId = id && /^\d+$/.test(id); if (!isValidId) { setIsLoading(false); setError("ID invalid."); return; }
        const fetchDetail = async () => { if (!token) { setError("Harus login."); setIsLoading(false); return; } setIsLoading(true); setError(null); try { const response = await fetch(`${API_BASE_URL}/api/pengaduan/saya/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }); if (!response.ok) { const errorData = await response.json().catch(() => ({ message: `Error ${response.status}` })); throw new Error(errorData.message || `Gagal (${response.status})`); } const result = await response.json(); if (result.success && result.data && result.data.pengaduan) { setPengaduan(result.data.pengaduan); } else { throw new Error(result.message || `Data ID ${id} tidak ditemukan.`); } } catch (err: any) { console.error("Fetch Error:", err); setError(err.message || 'Server error.'); if (err.message?.includes('Unauthorized')) { setError("Sesi invalid."); } } finally { setIsLoading(false); } };
        if (!authLoading && isValidId) { fetchDetail(); } else if (!authLoading && !token && isValidId) { setError("Harus login."); setIsLoading(false); } else if (!isValidId && !authLoading) { setIsLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, token, authLoading]);

    // Fungsi helper timeline (Tetap sama)
    const isStepComplete = (stepStatus: PengaduanDetail['status'], currentStatus: PengaduanDetail['status'] | undefined): boolean => { /* ... */ if (!currentStatus || currentStatus === 'ditolak') return false; const order = ['pending', 'proses', 'selesai']; return order.indexOf(currentStatus) >= order.indexOf(stepStatus); };
    const findComment = (keyword: string): { message?: string; tanggal?: string } => { /* ... */ const comment = pengaduan?.komentar?.find(k => k.message?.toLowerCase().includes(keyword.toLowerCase())); return { message: comment?.message, tanggal: comment?.tanggal }; };
    const formatTanggal = (tanggalString: string | undefined): string => { /* ... */ if (!tanggalString) return '-'; try { return new Date(tanggalString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return tanggalString; } }


    // === Render Logic ===
    if (isLoading || authLoading) return <div className="flex min-h-screen items-center justify-center pt-28">Loading detail pengaduan...</div>;
    if (error) return ( <div className="flex min-h-screen flex-col items-center justify-center pt-28 text-center"><p className="text-red-600">Error: {error}</p>{/* Tombol kembali bisa ditambahkan */}</div> );
    if (!pengaduan) return ( <div className="flex min-h-screen flex-col items-center justify-center pt-28 text-center"><p>Data pengaduan tidak ditemukan.</p>{/* Tombol kembali */}</div> );

    // Jika data ada
    return (
        // Wrapper utama (background putih, padding atas, relative untuk pattern)
        <main className="bg-white py-16 lg:py-24 pt-32 min-h-screen relative overflow-hidden">
             {/* Placeholder Pola Dekoratif */}
             {/* <div className="absolute top-0 right-0 w-60 h-96 pattern-top-right opacity-50 -z-0"></div> */}
             {/* <div className="absolute bottom-20 left-0 w-40 h-80 pattern-bottom-left opacity-50 -z-0"></div> */}

             <div className="container mx-auto max-w-3xl px-6 relative z-10"> {/* Kontainer di atas pola */}
                 {/* Judul Halaman */}
                <h2 className="mb-10 text-center text-3xl font-bold text-[#004A80] md:text-4xl">
                    DETAIL PENGADUAN
                </h2>

                {/* Kartu Putih Tunggal */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-10">

                    {/* Bagian Pengaduan Anda */}
                    <h3 className="mb-6 text-center text-lg font-semibold text-[#0060A9]">
                        PENGADUAN ANDA
                    </h3>
                    <div className="mb-8 flex flex-col items-center gap-6 md:flex-row md:items-start">
                         <div
                            className="h-24 w-24 flex-shrink-0 rounded-lg border bg-gray-200 bg-cover bg-center md:h-32 md:w-32" // Ukuran gambar lebih kecil
                            style={{ backgroundImage: `url(${pengaduan.bukti?.[0] ? API_BASE_URL + pengaduan.bukti[0] : '/placeholder-image.png'})` }}
                         ></div>
                         <div className="flex-1 text-center md:text-left">
                             {/* Ganti format: Label di kiri, value di kanan */}
                             <div className="space-y-2 text-sm">
                                 <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Judul:</span> {pengaduan.judul}</p>
                                 <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Kategori:</span> {pengaduan.kategori?.nama || '-'}</p>
                                 <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Tanggal:</span> {formatTanggal(pengaduan.tanggal_pengaduan)}</p>
                                 <p><span className="inline-block w-24 font-semibold text-[#0060A9]">Lokasi:</span> {pengaduan.lokasi}</p>
                                 <p><span className="inline-block w-24 font-semibold text-[#0060A9] align-top">Deskripsi:</span> <span className="inline-block w-[calc(100%-7rem)]">{pengaduan.isi_laporan}</span></p> {/* Layout deskripsi */}
                             </div>
                         </div>
                    </div>

                    {/* Garis Pemisah Biru */}
                    <hr className="my-8 border-t border-[#007BCC]" />

                    {/* Timeline Status */}
                    <h3 className="mb-6 text-center text-lg font-semibold text-[#0060A9]">
                        STATUS DAN TANGGAPAN
                    </h3>
                    {/* Wrapper Timeline dengan Garis Biru */}
                    <div className="relative pl-5 before:absolute before:left-[0.5rem] before:top-1 before:bottom-1 before:w-0.5 before:bg-[#0060A9] before:rounded-full">
                        {/* Timeline Steps */}
                        <TimelineStep
                            title="Diterima"
                            isComplete={isStepComplete('pending', pengaduan.status)}
                            date={pengaduan.tanggal_pengaduan}
                        />
                        <TimelineStep
                            title="Diproses" // Mengganti 'Diverifikasi' sesuai desain
                            description={findComment('proses').message || (isStepComplete('proses', pengaduan.status) ? 'Laporan sedang diproses.' : '')} // Tampilkan deskripsi default jika complete tapi tdk ada komen
                            isComplete={isStepComplete('proses', pengaduan.status)}
                            date={findComment('proses').tanggal}
                        />
                        <TimelineStep
                            title="Selesai"
                            description={findComment('selesai').message || (isStepComplete('selesai', pengaduan.status) ? 'Laporan telah diselesaikan.' : '')}
                            isComplete={isStepComplete('selesai', pengaduan.status)}
                            date={findComment('selesai').tanggal}
                        />
                        {/* Status Ditolak (jika ada) */}
                        {pengaduan.status === 'ditolak' && (
                             <TimelineStep
                                title="Ditolak"
                                description={findComment('ditolak').message || 'Laporan ditolak.'}
                                isComplete={true}
                                date={findComment('ditolak').tanggal}
                             />
                        )}
                    </div>
                 </div>

                {/* Tombol Kembali (Biru Kapsul) */}
                <div className="mt-8 text-center"> {/* Tengahkan tombol */}
                    <Link href="/riwayat"> {/* Arahkan ke Riwayat? Atau Lacak? */}
                        <button className="rounded-full bg-[#0060A9] px-8 py-3 text-sm font-semibold text-white hover:bg-[#004a80]">
                            Kembali
                        </button>
                    </Link>
                </div>
            </div>
        </main>
    );
}   