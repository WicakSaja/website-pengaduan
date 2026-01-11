"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-gray-100">
        <div className="p-6 text-center">
          {/* Ikon Plus/Tambah */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0060A9]">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">Tambah Kategori?</h3>
          <p className="text-gray-500 text-sm">
            Kategori baru akan ditambahkan ke dalam sistem dan dapat digunakan untuk pelaporan.
          </p>
        </div>
        
        <div className="flex border-t border-gray-100 bg-gray-50 px-6 py-4 gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-1/2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-1/2 rounded-lg bg-[#0060A9] px-4 py-2 text-sm font-bold text-white hover:bg-[#004a80] transition shadow-md disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              "Ya, Tambah"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TambahKategoriPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State Modal

  // Cek token sebelum render
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");
  }, [router]);

  // Handler Form (Buka Modal)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi sederhana
    if (!nama.trim() || !deskripsi.trim()) {
      setError("Nama dan Deskripsi wajib diisi.");
      return;
    }
    
    setIsModalOpen(true); // Buka popup konfirmasi
  };

  // Handler API (Eksekusi Simpan)
  const processSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Anda belum login sebagai admin.");
        setLoading(false);
        return;
      }

      // PENTING: Pastikan URL mengarah ke /api/admin/kategori
      const response = await fetch(`${API_BASE_URL}/api/admin/kategori`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nama_kategori: nama,
          deskripsi
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambah kategori");
      }

      setIsModalOpen(false); // Tutup modal
      router.push("/admin/kategori");

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Tidak dapat terhubung ke server.";
      setError(message);
      setIsModalOpen(false); // Tutup modal jika error agar user bisa perbaiki input
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-28 px-4 flex justify-center">
      
      {/* --- MODAL DIRENDER DI SINI --- */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processSubmit}
      />

      <div className="bg-white shadow-lg border rounded-xl p-8 w-[380px]">

        <h2 className="text-center text-xl font-bold text-[#004A80] mb-6">
          Tambah Data Kategori
        </h2>

        {/* Form memanggil handleFormSubmit (untuk buka modal) */}
        <form onSubmit={handleFormSubmit} className="space-y-5">

          {/* INPUT NAMA */}
          <div>
            <label className="text-sm font-semibold text-[#004A80] block mb-1">
              Nama Kategori
            </label>
            <input
              type="text"
              placeholder="Masukkan nama kategori"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 text-sm text-black bg-white
                         border border-[#8bb2cc] rounded-md
                         placeholder:text-[#6c8391] outline-none
                         focus:border-[#0060A9] focus:ring-2 focus:ring-[#0060A9]/40"
              required
            />
          </div>

          {/* INPUT DESKRIPSI */}
          <div>
            <label className="text-sm font-semibold text-[#004A80] block mb-1">
              Deskripsi
            </label>
            <textarea
              placeholder="Tuliskan deskripsi kategori"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full px-4 py-2 text-sm text-black bg-white
                         border border-[#8bb2cc] rounded-md h-28
                         placeholder:text-[#6c8391] outline-none
                         focus:border-[#0060A9] focus:ring-2 focus:ring-[#0060A9]/40"
              required
            ></textarea>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-center text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
          )}

          {/* BUTTON TAMBAH */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0060A9] text-white py-2 rounded-full text-sm 
                       hover:bg-[#004a80] transition font-semibold shadow-md disabled:opacity-70"
          >
            Tambah
          </button>
        </form>

        {/* BUTTON KEMBALI */}
        <div className="text-center mt-4">
          <Link href="/admin/kategori">
            <button className="bg-gray-100 text-gray-600 px-6 py-1.5 rounded-full text-sm hover:bg-gray-200 transition font-medium border border-gray-300">
              Kembali
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}