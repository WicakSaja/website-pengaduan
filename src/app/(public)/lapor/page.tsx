"use client"; 

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useAuth } from '@/context/AuthContext'; 

const API_BASE_URL = 'http://localhost:5000'; 

// Style reusable (adaptasi)
const inputStyle = "w-full px-4 py-3 border border-[#007BCC] rounded-lg text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"; 
const labelStyle = "block mb-2 text-sm font-medium text-[#0060A9]"; 
const buttonStyle = "w-full rounded-full bg-[#0060A9] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"; 

interface Kategori { id: number; nama: string; }

export default function LaporPage() {
  const { user, token, isLoading: authLoading } = useAuth(); 
  const router = useRouter(); // Gunakan router

  // State Form Pengaduan
  const [judul, setJudul] = useState('');
  const [isiLaporan, setIsiLaporan] = useState('');
  const [kategoriId, setKategoriId] = useState<number | ''>('');
  const [lokasi, setLokasi] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]); 
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Fetch Kategori
  useEffect(() => {
    const fetchKategori = async () => { /* ... (kode fetchKategori Anda) ... */ 
         try {
            const response = await fetch(`${API_BASE_URL}/api/kategori`);
            const result = await response.json();
            if (result.success && result.data && result.data.kategori) {
            setKategoriList(result.data.kategori);
            } else { console.error("Gagal ambil kategori:", result.message); }
        } catch (err) { console.error("Error fetch kategori:", err); }
    };
    fetchKategori();
  }, []);

  // Handler File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ if (e.target.files && e.target.files[0]) setGambar(e.target.files[0]); else setGambar(null); };

  // Handle Submit Pengaduan
  const handlePengaduanSubmit = async (e: React.FormEvent<HTMLFormElement>) => { /* ... (kode fetch POST /api/pengaduan Anda) ... */ 
        e.preventDefault(); if (!token) { setFormError('Harus login'); return; } setFormLoading(true); setFormError(null); setFormSuccess(null);
        const formData = new FormData(); formData.append('judul', judul); formData.append('isi_laporan', isiLaporan); formData.append('kategori_id', String(kategoriId)); formData.append('lokasi', lokasi); if (gambar) formData.append('gambar', gambar);
        try { const response = await fetch(`${API_BASE_URL}/api/pengaduan`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData }); const result = await response.json(); if (result.success) { setFormSuccess('Pengaduan berhasil dikirim!'); setJudul(''); setIsiLaporan(''); setKategoriId(''); setLokasi(''); setGambar(null); const fileInput = document.getElementById('bukti') as HTMLInputElement; if (fileInput) fileInput.value = ''; } else { setFormError(result.message || 'Gagal.'); } } catch (err) { setFormError('Server error.'); console.error(err); } finally { setFormLoading(false); }
    };

  // Auth Guard Sederhana di Awal Render
  useEffect(() => {
    // Jika loading auth selesai DAN user tidak ada, redirect ke login
    if (!authLoading && !user) {
      router.replace('/login?redirect=/lapor'); // Redirect ke login, simpan tujuan
    }
  }, [authLoading, user, router]);

  // Tampilkan loading jika status auth belum jelas atau user belum ada (setelah loading selesai)
  if (authLoading || !user) {
    return <div className="flex min-h-screen items-center justify-center pt-28">Loading atau mengalihkan...</div>; 
  }

  // Jika sudah login, tampilkan form
  return (
    // Tambahkan padding atas agar tidak tertutup Navbar
    <main className="bg-white py-16 lg:py-24 pt-32"> {/* Tambah pt-32 */}
        <div className="container mx-auto max-w-2xl px-6">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#004A80]">
            FORM PENGADUAN
          </h2>
            {/* Kartu Form (Putih, shadow, border biru) */}
            <form onSubmit={handlePengaduanSubmit} className="rounded-lg border-2 border-[#007BCC] bg-white p-8 shadow-xl space-y-6">
              {/* Field Judul */}
              <div>
                <label htmlFor="judul" className={labelStyle}>Judul Pengaduan*</label>
                <input type="text" id="judul" placeholder="Judul Pengaduan" className={inputStyle} value={judul} onChange={(e) => setJudul(e.target.value)} required />
              </div>
              {/* Field Isi Laporan */}
              <div>
                 <label htmlFor="deskripsi" className={labelStyle}>Isi Laporan*</label>
                 <textarea id="deskripsi" placeholder="Deskripsi Pengaduan" rows={5} className={inputStyle} value={isiLaporan} onChange={(e) => setIsiLaporan(e.target.value)} required></textarea>
              </div>
              {/* Field Kategori */}
              <div>
                <label htmlFor="kategori" className={labelStyle}>Kategori Pengaduan*</label>
                <select id="kategori" className={inputStyle} value={kategoriId} onChange={(e) => setKategoriId(Number(e.target.value))} required>
                  <option value="">Pilih Kategori...</option>
                  {kategoriList.map((kat) => ( <option key={kat.id} value={kat.id}>{kat.nama}</option> ))}
                </select>
              </div>
               {/* Field Lokasi */}
               <div>
                <label htmlFor="lokasi" className={labelStyle}>Lokasi*</label>
                <input type="text" id="lokasi" placeholder="Alamat / Lokasi Kejadian" className={inputStyle} value={lokasi} onChange={(e) => setLokasi(e.target.value)} required />
               </div>
              {/* Field Bukti */}
              <div>
                <label htmlFor="bukti" className={labelStyle}>Bukti Pendukung (Gambar)</label>
                <input type="file" id="bukti" accept="image/*" onChange={handleFileChange} className={`${inputStyle} file:rounded-full file:border-0 file:bg-[#007BCC] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0060A9]`}/>
              </div>
              {/* Error/Success */}
              {formError && <div className="text-red-600 text-sm text-center">{formError}</div>}
              {formSuccess && <div className="text-green-600 text-sm text-center">{formSuccess}</div>}
              {/* Tombol Lapor */}
              <div className="pt-4 text-center">
                <button type="submit" disabled={formLoading} className={buttonStyle}>
                  {formLoading ? 'Mengirim...' : 'Lapor'}
                </button>
              </div>
            </form>
        </div>
      </main>
  );
}