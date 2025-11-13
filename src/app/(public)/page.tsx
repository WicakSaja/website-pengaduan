"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = 'http://localhost:5000';

// Style reusable baru
const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]";
const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";
const selectStyle = `${inputStyle} appearance-none bg-white`;
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

// Interface/Tipe Data
interface Kategori { id: number; nama: string; }
interface Dusun { id: string; nama: string; }
interface RT { id: string; nomor: string; }
interface RW { id: string; nomor: string; }

export default function Home() {
    const { user, token, isLoading: authLoading } = useAuth();

    // State Form Pengaduan
    const [judul, setJudul] = useState(''); // Tetap ada, mungkin diisi dari nama kategori
    const [kategoriId, setKategoriId] = useState<number | ''>('');
    const [deskripsi, setDeskripsi] = useState('');
    const [lokasiDusun, setLokasiDusun] = useState('');
    const [lokasiRt, setLokasiRt] = useState('');
    const [lokasiRw, setLokasiRw] = useState('');
    const [lokasiDetail, setLokasiDetail] = useState('');
    const [gambar, setGambar] = useState<File | null>(null);
    const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
    // Sesuaikan data dummy jika nama Dusun berbeda (misal: Krajan)
    const [dusunList, setDusunList] = useState<Dusun[]>([{ id: '1', nama: 'Junrejo' }, { id: '2', nama: 'Tlekung' }, { id: '3', nama: 'Krajan' }]);
    const [rtList, setRtList] = useState<RT[]>([{ id: '1', nomor: '01' }, { id: '2', nomor: '02' }, { id: '3', nomor: '03' }]);
    const [rwList, setRwList] = useState<RW[]>([{ id: '1', nomor: '01' }, { id: '2', nomor: '02' }, { id: '5', nomor: '05' }]);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);

    // Fetch Kategori
    useEffect(() => {
        const fetchKategori = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/kategori`);
                const result = await response.json();
                if (result.success && result.data?.kategori) {
                    setKategoriList(result.data.kategori);
                } else { console.error("Gagal ambil kategori:", result.message); }
            } catch (err) { console.error("Error fetch kategori:", err); }
        };
        fetchKategori();
    }, []);

    // Handler File Change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setGambar(e.target.files[0]);
        } else {
            setGambar(null);
        }
    };

    // Handle Submit Pengaduan
    const handlePengaduanSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); if (!token) { setFormError('Anda harus login.'); return; }
        setFormLoading(true); setFormError(null); setFormSuccess(null);

        const lokasiGabungan = `Dusun ${lokasiDusun || '-'}, RT ${lokasiRt || '-'}, RW ${lokasiRw || '-'} (${lokasiDetail || 'Tidak ada detail'})`;
        const selectedKategoriNama = kategoriList.find(k => k.id === kategoriId)?.nama || 'Pengaduan Umum'; // Judul default

        const formData = new FormData();
        formData.append('judul', selectedKategoriNama); // Menggunakan nama kategori sebagai judul sementara
        formData.append('kategori_id', String(kategoriId));
        formData.append('isi_laporan', deskripsi);
        formData.append('lokasi', lokasiGabungan);
        if (gambar) { formData.append('gambar', gambar); }

        try {
            const response = await fetch(`${API_BASE_URL}/api/pengaduan`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            const result = await response.json();
            if (result.success) {
                setFormSuccess('Pengaduan berhasil dikirim!');
                // Reset form
                setKategoriId(''); setDeskripsi(''); setLokasiDusun(''); setLokasiRt(''); setLokasiRw(''); setLokasiDetail(''); setGambar(null);
                const fileInput = document.getElementById('bukti') as HTMLInputElement; if (fileInput) { fileInput.value = ''; }
            } else { setFormError(result.message || 'Gagal mengirim pengaduan.'); }
        } catch (err) { setFormError('Tidak dapat terhubung ke server.'); console.error(err); }
        finally { setFormLoading(false); }
    };

    if (authLoading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

    return (
        <>
            <HeroSection />

            {/* === PANDUAN SECTION === */}
            <section id="panduan-section" className="bg-white py-16 lg:py-20 relative overflow-hidden">
                {/* Placeholder Pola Dekoratif */}
                {/* <div className="absolute top-0 right-0 ..."></div> */}
                {/* <div className="absolute bottom-0 left-0 ..."></div> */}

                <div className="container mx-auto max-w-4xl px-6 relative z-10 text-center">
                    <h2 className="mb-6 text-3xl font-bold text-[#004A80] md:text-4xl">PANDUAN</h2>
                    <p className="mb-4 text-gray-600">Halo Warga Kecamatan Junrejo</p>
                    <p className="mb-8 text-gray-600 max-w-3xl mx-auto">
                        Terima kasih telah berpartisipasi dalam layanan pengaduan masyarakat.
                        Silakan isi form berikut dengan data yang benar dan lengkap agar laporan Anda dapat segera diproses oleh petugas.
                    </p>

                    <div className="space-y-6 text-sm text-gray-700 text-left max-w-2xl mx-auto">
                        <div>
                            <h3 className="mb-2 text-base font-semibold text-[#0060A9]">Perhatikan Hal Berikut Sebelum Mengirim Laporan:</h3>
                            <ol className="list-decimal space-y-1 pl-5">
                                <li>Pastikan pengaduan Anda terkait wilayah Kecamatan Junrejo.</li>
                                <li>Gunakan bahasa yang sopan, jelas, dan ringkas dalam menjelaskan permasalahan.</li>
                                <li>Semua kolom bertanda (*) wajib diisi.</li>
                                <li>Pilih Kategori Masalah, Dusun, RT, dan RW dari daftar pilihan yang tersedia.</li>
                                <li>Tuliskan alamat lengkap atau penjelasan tambahan lokasi agar petugas dapat menindaklanjuti laporan dengan tepat.</li>
                                <li>Lampirkan bukti pendukung seperti foto atau dokumen yang menunjukkan kondisi di lapangan.</li>
                                <li>Hindari mengirim laporan ganda untuk masalah yang sama.</li>
                                <li>Setelah laporan dikirim, Anda akan menerima nomor laporan yang dapat digunakan untuk melacak status pengaduan melalui fitur Lacak Pengaduan.</li>
                            </ol>
                        </div>
                        <div>
                            <h3 className="mb-2 text-base font-semibold text-[#0060A9]">Contoh Pengisian Singkat:</h3>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>Kategori Masalah: Infrastruktur dan Fasilitas Umum</li>
                                <li>Deskripsi Masalah: Jalan utama di depan SD Negeri Junrejo 2 sudah berlubang cukup dalam dan sering tergenang air saat hujan.</li>
                                <li>Lokasi: Dusun Krajan, RT 03 / RW 05, Jl. Merdeka – depan SD Negeri Junrejo 2</li>
                                <li>Bukti Pendukung: Foto jalan berlubang</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-2 text-base font-semibold text-[#0060A9]">Setelah Mengirim Laporan:</h3>
                            <ul className="list-disc space-y-1 pl-5">
                                <li>Laporan Anda akan diperiksa dan diverifikasi oleh petugas Kecamatan Junrejo.</li>
                                <li>Anda dapat melacak perkembangan laporan melalui menu Lacak Pengaduan dengan memasukkan ID laporan yang diterima.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* === FORM PENGADUAN SECTION === */}
            <section id="form-pengaduan" className="bg-white pb-16 lg:pb-24 relative overflow-hidden">
                 {/* Placeholder Pola Dekoratif */}
                {/* <div className="..."></div> */}

                <div className="container mx-auto max-w-3xl px-6 relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-[#004A80] md:text-4xl">
                            FORM PENGADUAN
                        </h2>
                        <p className="mt-2 text-gray-600">Berpartisipasi aktif dalam memajukan lingkungan sekitar Anda.</p>
                    </div>

                    {user ? (
                        <form onSubmit={handlePengaduanSubmit} className="rounded-xl border border-[#ADD8E6] bg-white p-6 shadow-lg md:p-8 space-y-5">
                            <div>
                                <label htmlFor="kategori" className={labelStyle}>Judul atau Kategori Masalah*</label>
                                <select id="kategori" className={`${selectStyle} bg-[#0060A9] text-white font-semibold`} value={kategoriId} onChange={(e) => setKategoriId(Number(e.target.value))} required > <option value="" className="bg-white text-gray-700">Pilih Kategori Masalah...</option> {kategoriList.map((kat) => ( <option key={kat.id} value={kat.id} className="bg-white text-gray-700">{kat.nama}</option> ))} </select>
                            </div>
                            <div>
                                <label htmlFor="deskripsi" className={labelStyle}>Deskripsi Masalah*</label>
                                <textarea id="deskripsi" placeholder="Contoh: Jalan utama di depan SD Negeri Junrejo 2 segera diperbaiki..." rows={4} className={inputStyle} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required ></textarea>
                            </div>
                            <div>
                                <label className={labelStyle}>Lokasi*</label>
                                <div className="grid grid-cols-3 gap-3 mb-2">
                                    <select id="lokasi_dusun" className={selectStyle} value={lokasiDusun} onChange={(e) => setLokasiDusun(e.target.value)} required > <option value="">Dusun</option> {dusunList.map((d) => (<option key={d.id} value={d.nama}>{d.nama}</option>))} </select>
                                    <select id="lokasi_rt" className={selectStyle} value={lokasiRt} onChange={(e) => setLokasiRt(e.target.value)} required > <option value="">RT</option> {rtList.map((rt) => (<option key={rt.id} value={rt.nomor}>{rt.nomor}</option>))} </select>
                                    <select id="lokasi_rw" className={selectStyle} value={lokasiRw} onChange={(e) => setLokasiRw(e.target.value)} required > <option value="">RW</option> {rwList.map((rw) => (<option key={rw.id} value={rw.nomor}>{rw.nomor}</option>))} </select>
                                </div>
                                <input type="text" id="lokasi_detail" placeholder="Contoh: Jl. Merdeka, SD Negeri Junrejo 2" className={inputStyle} value={lokasiDetail} onChange={(e) => setLokasiDetail(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="bukti" className={`${labelStyle} flex items-center gap-2 cursor-pointer`}> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0060A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /> </svg> Bukti Pendukung* </label>
                                <input type="file" id="bukti" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0060A9] hover:file:bg-blue-100 mt-1" required />
                            </div>
                            {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
                            {formSuccess && <div className="text-green-600 text-sm text-center">{formSuccess}</div>}
                            <div className="pt-4 text-right">
                                <button type="submit" disabled={formLoading} className={buttonBlueCapsule}>
                                    {formLoading ? 'Mengirim...' : 'Lapor'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="rounded-xl border border-[#ADD8E6] bg-white p-8 text-center shadow-lg">
                           <h3 className="mb-4 text-xl font-semibold text-[#004A80]">Login Dibutuhkan</h3>
                           <p className="mb-6 text-gray-600">Anda harus masuk untuk dapat mengisi form pengaduan.</p>
                           <Link href="/login">
                             <button className={buttonBlueCapsule}>
                               Pergi ke Halaman Login
                             </button>
                           </Link>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}