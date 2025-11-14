"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:5000";

const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]";
const inputStyle =
  "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";
const selectStyle = `${inputStyle} appearance-none bg-white`;
const buttonBlueCapsule =
  "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

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

export default function Home() {
  const { user, token, isLoading: authLoading } = useAuth();

  const [kategoriId, setKategoriId] = useState<number | "">("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasiDusun, setLokasiDusun] = useState("");
  const [lokasiRt, setLokasiRt] = useState("");
  const [lokasiRw, setLokasiRw] = useState("");
  const [lokasiDetail, setLokasiDetail] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);

  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
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

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/kategori`);
        const result = await response.json();
        if (Array.isArray(result.data)) setKategoriList(result.data);
      } catch (err) {
        console.error("Error fetch kategori:", err);
      }
    };
    fetchKategori();
  }, []);

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

    setFormLoading(true);

    const lokasiGabungan = `Dusun ${
      lokasiDusun || "-"
    }, RT ${lokasiRt || "-"}, RW ${lokasiRw || "-"} (${
      lokasiDetail || "Tidak ada detail"
    })`;

    const selectedKategoriNama =
      kategoriList.find((k) => k.id === kategoriId)?.nama_kategori ||
      "Pengaduan Umum";

    try {
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

      // Upload foto jika ada
      if (gambar && pengaduanId) {
        const formData = new FormData();
        formData.append("lampiran", gambar);

        await fetch(`${API_BASE_URL}/api/pengaduan/${pengaduanId}/lampiran`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      // === MUNCULKAN POPUP ===
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

      const fileInput = document.getElementById(
        "bukti"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error pengaduan:", err);
      toast.error("Tidak dapat terhubung ke server.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <>
      <HeroSection />

      <section
        id="form-pengaduan"
        className="bg-white pb-16 lg:pb-24 relative overflow-hidden"
      >
        <div className="container mx-auto max-w-3xl px-6 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#004A80] md:text-4xl">
              FORM PENGADUAN
            </h2>
            <p className="mt-2 text-gray-600">
              Berpartisipasi aktif dalam memajukan lingkungan sekitar Anda.
            </p>
          </div>

          {/* === JIKA LOGIN === */}
          {user ? (
            <form
              onSubmit={handlePengaduanSubmit}
              className="rounded-xl border border-[#ADD8E6] bg-white p-6 shadow-lg md:p-8 space-y-5"
            >
              <div>
                <label className={labelStyle}>
                  Judul atau Kategori Masalah*
                </label>
                <select
                  className={selectStyle}
                  value={kategoriId}
                  onChange={(e) =>
                    setKategoriId(Number(e.target.value))
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

              <div>
                <label className={labelStyle}>Deskripsi Masalah*</label>
                <textarea
                  rows={4}
                  className={inputStyle}
                  value={deskripsi}
                  onChange={(e) =>
                    setDeskripsi(e.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Lokasi*</label>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <select
                    className={selectStyle}
                    value={lokasiDusun}
                    onChange={(e) =>
                      setLokasiDusun(e.target.value)
                    }
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
                    onChange={(e) =>
                      setLokasiRt(e.target.value)
                    }
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
                    onChange={(e) =>
                      setLokasiRw(e.target.value)
                    }
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
                  placeholder="Detail Lokasi"
                  value={lokasiDetail}
                  onChange={(e) =>
                    setLokasiDetail(e.target.value)
                  }
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Bukti Pendukung*
                </label>
                <input
                  type="file"
                  id="bukti"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0060A9] hover:file:bg-blue-100 mt-1"
                  required
                />
              </div>

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
            <div className="rounded-xl border border-[#ADD8E6] bg-white p-8 text-center shadow-lg">
              <h3 className="mb-4 text-xl font-semibold text-[#004A80]">
                Login Dibutuhkan
              </h3>
              <p className="mb-6 text-gray-600">
                Anda harus masuk untuk dapat mengisi form
                pengaduan.
              </p>
              <Link href="/login">
                <button className={buttonBlueCapsule}>
                  Pergi ke Halaman Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* === POPUP ID PENGADUAN === */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center border border-[#0060A9]">
            <h3 className="text-xl font-bold text-[#0060A9] mb-2">
              Pengaduan Terkirim!
            </h3>

            <p className="text-gray-700 mb-4">
              Simpan <span className="font-semibold">ID Pengaduan</span>{" "}
              berikut untuk melakukan pelacakan:
            </p>

            <div className="bg-blue-50 border border-[#0060A9] text-[#0060A9] font-bold text-lg py-2 rounded-lg mb-4">
              #{popupId}
            </div>

            <button
              onClick={() => setPopupOpen(false)}
              className="bg-[#0060A9] text-white w-full py-2 rounded-full hover:bg-[#004a80] transition"
            >
              Tutup
            </button>

            <Link href={`/riwayat/${popupId}`}>
              <button className="mt-3 w-full py-2 rounded-full border border-[#0060A9] text-[#0060A9] hover:bg-blue-50 transition">
                Lacak Pengaduan
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
