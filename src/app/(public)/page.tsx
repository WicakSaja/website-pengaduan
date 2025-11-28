"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// Asumsi HeroSection sudah responsif dan berada di "@/components/HeroSection"
import HeroSection from "@/components/HeroSection"; 
// Asumsi useAuth sudah tersedia di "@/context/AuthContext"
import { useAuth } from "@/context/AuthContext"; 
import toast from "react-hot-toast";

// ==========================================================
// KONSTANTA & STYLE
// ==========================================================
const API_BASE_URL = "http://localhost:5000";

const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]";
const inputStyle =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";
const selectStyle = `${inputStyle} appearance-none bg-white`;
const buttonBlueCapsule =
  "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

// Interface (Data Type)
interface Kategori {
  id: number;
  nama_kategori: string;
}
interface Dusun {
  id: string;
  nama: string;
}
interface RT {
  id: string;
  nomor: string;
}
interface RW {
  id: string;
  nomor: string;
}
interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  // Perbaikan: gunakan string penuh untuk gambar, bukan hanya path relatif
  gambar: string | null; 
  dibuatPada: string;
}

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ==========================================================
// KOMPONEN UTAMA
// ==========================================================
export default function Home() {
  const { user, token, isLoading: authLoading } = useAuth();

  // State untuk Form
  const [kategoriId, setKategoriId] = useState<number | "">("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasiDusun, setLokasiDusun] = useState("");
  const [lokasiRt, setLokasiRt] = useState("");
  const [lokasiRw, setLokasiRw] = useState("");
  const [lokasiDetail, setLokasiDetail] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  // State untuk Data
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);

  // Data statis untuk Dusun, RT, RW (Bisa diganti dengan fetch API)
  const [dusunList] = useState<Dusun[]>([
    { id: "1", nama: "Junrejo" },
    { id: "2", nama: "Tlekung" },
    { id: "3", nama: "Krajan" },
  ]);
  const [rtList] = useState<RT[]>([
    { id: "1", nomor: "01" },
    { id: "2", nomor: "02" },
    { id: "3", nomor: "03" },
  ]);
  const [rwList] = useState<RW[]>([
    { id: "1", nomor: "01" },
    { id: "2", nomor: "02" },
    { id: "5", nomor: "05" },
  ]);

  const [formLoading, setFormLoading] = useState(false);

  // === POPUP ID PENGADUAN ===
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupId, setPopupId] = useState<number | null>(null);

  // ==========================================================
  // SIDE EFFECTS (Fetch Data)
  // ==========================================================
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/kategori`);
        const result = await response.json();
        if (response.ok && result.success) {
          const dataFromApi = result.data;
          // Menangani berbagai format respons API
          if (Array.isArray(dataFromApi)) {
            setKategoriList(dataFromApi);
          } else if (dataFromApi && Array.isArray(dataFromApi.kategori)) {
            setKategoriList(dataFromApi.kategori);
          } else {
            setKategoriList([]);
          }
        } else {
          setKategoriList([]);
        }
      } catch (err) {
        console.error("Error fetch kategori:", err);
        setKategoriList([]);
      }
    };

    const fetchPengumuman = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pengumuman`);
        const result = await response.json();
        if (response.ok && result.success && Array.isArray(result.data)) {
          // Hanya ambil 3 pengumuman terbaru
          setPengumumanList(result.data.slice(0, 3)); 
        }
      } catch (err) {
        console.error("Error fetch pengumuman:", err);
      }
    };

    fetchKategori();
    fetchPengumuman();
  }, []);

  // ==========================================================
  // HANDLERS
  // ==========================================================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setGambar(e.target.files[0]);
    else setGambar(null);
  };

  const handlePengaduanSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!token) {
      toast.error("Anda harus login terlebih dahulu.");
      return;
    }
    if (kategoriId === "" || kategoriId === 0) {
      toast.error("Silakan pilih kategori masalah terlebih dahulu.");
      return;
    }
    if (!deskripsi) {
        toast.error("Deskripsi masalah wajib diisi.");
        return;
    }
    if (!lokasiDusun || !lokasiRt || !lokasiRw) {
        toast.error("Lokasi Dusun, RT, dan RW wajib dipilih.");
        return;
    }
   if (!gambar) {
  toast.error("Lampiran wajib diunggah (foto atau video).");
  return;
}

    setFormLoading(true);

    const lokasiGabungan = `Dusun ${lokasiDusun || "-"}, RT ${lokasiRt || "-"}, RW ${lokasiRw || "-"} (${lokasiDetail || "Tidak ada detail"})`;
    const selectedKategoriNama =
      kategoriList.find((k) => k.id === kategoriId)?.nama_kategori ||
      "Pengaduan Umum";

    try {
      // 1. Kirim Data Pengaduan Utama
      const pengaduanResponse = await fetch(`${API_BASE_URL}/api/pengaduan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          judul: selectedKategoriNama,
          deskripsi,
          kategori_id: kategoriId,
          lokasi: lokasiGabungan,
        }),
      });

      const pengaduanResult = await pengaduanResponse.json();
      if (!pengaduanResponse.ok) {
        toast.error(pengaduanResult.message || "Gagal mengirim pengaduan.");
        return;
      }

      const pengaduanId = pengaduanResult.data?.id;

      // 2. Kirim Lampiran Gambar
      if (gambar && pengaduanId) {
        const formData = new FormData();
        formData.append("lampiran", gambar);
        
        const lampiranResponse = await fetch(`${API_BASE_URL}/api/pengaduan/${pengaduanId}/lampiran`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }, // Hanya bearer token, tidak perlu Content-Type untuk FormData
          body: formData,
        });

        if (!lampiranResponse.ok) {
            // Jika upload gambar gagal, tampilkan pesan error, tapi pengaduan sudah terbuat.
            toast.error("Pengaduan terkirim, tetapi gagal mengunggah gambar. Silakan hubungi admin.");
        }
      }

      // 3. Tampilkan Popup Sukses
      setPopupId(pengaduanId);
      setPopupOpen(true);

      // Reset form
      setKategoriId("");
      setDeskripsi("");
      setLokasiDusun("");
      setLokasiRt("");
      setLokasiRw("");
      setLokasiDetail("");
      setGambar(null);
      const fileInput = document.getElementById("bukti") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      toast.error("Tidak dapat terhubung ke server atau terjadi kesalahan.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-xl text-[#0060A9]">
        Loading...
      </div>
    );

  return (
    <>
      {/* HeroSection: Asumsi sudah responsif */}
      <HeroSection />

      {/* --- BAGIAN PENGUMUMAN (RESPONSIVE GRID) --- */}
      <section id="pengumuman" className="bg-gray-50 py-16 lg:py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004A80] md:text-4xl">
              PENGUMUMAN TERBARU
            </h2>
            <p className="mt-2 text-gray-600">
              Informasi dan berita terbaru dari kami.
            </p>
          </div>
          
          <hr className="mb-8 border-t border-gray-200" />

          {pengumumanList.length > 0 ? (
            // Grid Responsif: 1 kolom di mobile (default), 3 kolom di tablet ke atas (md:grid-cols-3)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Loop/Map data pengumuman */}
              {pengumumanList.map((item) => (
                <div
                  key={item.id}
                  // Menggunakan flex-col untuk memastikan elemen terdistribusi dengan baik
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col transition duration-300 hover:shadow-xl hover:border-[#0060A9]/50"
                >
                  <h3 className="text-xl font-semibold text-[#0060A9] mb-3">
                    {item.judul}
                  </h3>
                  
                  {/* Gambar: Tinggi tetap (h-48) dan object-cover untuk konsistensi di grid */}
                  {item.gambar && (
                    <div className="mb-4 overflow-hidden rounded-md">
                        <img
                            src={`${API_BASE_URL}${item.gambar}`}
                            alt={item.judul}
                            className="w-full h-48 object-cover rounded-md border transform transition duration-500 hover:scale-105"
                        />
                    </div>
                  )}
                  
                  {/* flex-grow agar teks mengisi ruang dan tombol tetap di bawah */}
                  <p className="text-gray-700 whitespace-pre-line grow text-sm line-clamp-3">
                    {item.isi}
                  </p>
                  
                  <p className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-100">
                    Dipublikasikan pada:{" "}
                    <span className="font-medium text-gray-500">
                        {formatDate(item.dibuatPada)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-10">
              Belum ada pengumuman saat ini.
            </p>
          )}

          <div className="text-center mt-10">
            <Link href="/pengumuman" className={buttonBlueCapsule}>
                Lihat Semua Pengumuman
            </Link>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-200" />

      {/* --- BAGIAN FORM PENGADUAN --- */}
      <section
        id="form-pengaduan"
        className="bg-transparant py-16 lg:py-24 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004A80] md:text-4xl">
              FORM PENGADUAN
            </h2>
            <p className="mt-2 text-gray-600">
              Berpartisipasi aktif dalam memajukan lingkungan sekitar Anda.
            </p>
          </div>
          
          <hr className="mb-8 border-t border-gray-200" />

          {user ? (
            <form
              onSubmit={handlePengaduanSubmit}
              className="rounded-xl border border-[#ADD8E6] bg-white p-6 shadow-2xl md:p-8 space-y-6"
            >
              {/* --- Kategori --- */}
              <div>
                <label className={labelStyle}>
                  Judul atau Kategori Masalah*
                </label>
                <select
                  className={selectStyle}
                  value={kategoriId}
                  onChange={(e) =>
                    setKategoriId(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  required
                >
                  <option value="">Pilih Kategori Masalah...</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* --- Deskripsi --- */}
              <div>
                <label className={labelStyle}>Deskripsi Masalah*</label>
                <textarea
                  rows={4}
                  className={inputStyle}
                  placeholder="Jelaskan masalah Anda secara detail..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  required
                />
              </div>

              {/* --- Lokasi --- */}
              <div>
                <label className={labelStyle}>Lokasi*</label>
                {/* Grid Responsif untuk Dusun, RT, RW: 3 kolom di mobile & desktop */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <select
                    className={selectStyle}
                    value={lokasiDusun}
                    onChange={(e) => setLokasiDusun(e.target.value)}
                    required
                  >
                    <option value="">Dusun</option>
                    {dusunList.map((d) => (
                      <option key={d.id} value={d.nama}>
                        {d.nama}
                      </option>
                    ))}
                  </select>
                  <select
                    className={selectStyle}
                    value={lokasiRt}
                    onChange={(e) => setLokasiRt(e.target.value)}
                    required
                  >
                    <option value="">RT</option>
                    {rtList.map((rt) => (
                      <option key={rt.id} value={rt.nomor}>
                        {rt.nomor}
                      </option>
                    ))}
                  </select>
                  <select
                    className={selectStyle}
                    value={lokasiRw}
                    onChange={(e) => setLokasiRw(e.target.value)}
                    required
                  >
                    <option value="">RW</option>
                    {rwList.map((rw) => (
                      <option key={rw.id} value={rw.nomor}>
                        {rw.nomor}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="Detail Lokasi (misal: di depan rumah no. 15)"
                  value={lokasiDetail}
                  onChange={(e) => setLokasiDetail(e.target.value)}
                />
              </div>

              {/* --- Bukti --- */}
              <div>
                <label className={labelStyle}>Bukti Pendukung*</label>
               <input
  type="file"
  id="bukti"
  accept="image/*,video/*"
  onChange={handleFileChange}
  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0060A9] hover:file:bg-blue-100 mt-1"
  required
/>
<p className="text-xs text-gray-500 mt-1">
  Maksimal ukuran file: 200MB. Format: JPG, PNG, MP4, MKV.
</p>

              </div>

              {/* --- Tombol Submit --- */}
              <div className="pt-4 text-right">
                <button
                  type="submit"
                  disabled={formLoading}
                  className={buttonBlueCapsule}
                >
                  {formLoading ? "Mengirim..." : "Lapor"}
                </button>
              </div>
            </form>
          ) : (
            // --- JIKA BELUM LOGIN (Responsif) ---
            <div className="rounded-xl border border-[#ADD8E6] bg-white p-6 sm:p-8 text-center shadow-lg max-w-md mx-auto">
              <h3 className="mb-4 text-xl font-semibold text-[#004A80]">
                Login Dibutuhkan
              </h3>
              <p className="mb-6 text-gray-600 text-sm sm:text-base">
                Anda harus masuk untuk dapat mengisi form pengaduan.
              </p>
              <Link href="/login">
                <button className={buttonBlueCapsule}>
                  Pergi ke Halaman Login
                </button>
              </Link>
              <Link href="/register">
                 <p className="text-sm text-[#0060A9] mt-3 hover:text-[#004a80] transition">
                    Belum punya akun? Daftar di sini.
                </p>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* --- POPUP ID PENGADUAN --- */}
      {popupOpen && (
        // Overlay responsif
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm text-center border-2 border-[#0060A9] animate-fade-in-up">
            <h3 className="text-2xl font-extrabold text-[#0060A9] mb-3">
              🎉 Pengaduan Terkirim!
            </h3>
            <p className="text-gray-700 mb-5">
              Simpan <span className="font-bold">ID Pengaduan</span>{" "}
              berikut untuk melakukan pelacakan:
            </p>
            <div className="bg-blue-50 border border-[#0060A9] text-[#0060A9] font-extrabold text-2xl py-3 rounded-xl mb-5 break-words">
              #{popupId}
            </div>
            <button
              onClick={() => setPopupOpen(false)}
              className="bg-[#0060A9] text-white w-full py-3 rounded-full font-semibold hover:bg-[#004a80] transition mb-3"
            >
              Tutup
            </button>
            <Link href={`/riwayat/${popupId}`}>
              <button 
                className="w-full py-3 rounded-full border-2 border-[#0060A9] text-[#0060A9] font-semibold hover:bg-blue-50 transition"
                onClick={() => setPopupOpen(false)} // Tutup popup saat navigasi
              >
                Lacak Pengaduan
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}