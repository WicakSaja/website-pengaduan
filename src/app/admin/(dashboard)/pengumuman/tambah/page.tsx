"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // 1. Import Toast

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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0060A9]">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">Simpan Pengumuman?</h3>
          <p className="text-gray-500 text-sm">
            Pastikan data yang Anda masukkan sudah benar. Pengumuman akan langsung dipublikasikan.
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
              "Ya, Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CreatePengumuman() {
  const router = useRouter();
  
  // State Form
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // State UI
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Tahap 1: Validasi & Buka Modal ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) {
        toast.error("Judul dan Isi wajib diisi!");
        return;
    }
    setIsModalOpen(true); 
  };

  // --- Tahap 2: Eksekusi API ---
  const processSubmit = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Sesi berakhir. Login kembali.");
        setLoading(false);
        router.push("/admin/login");
        return;
      }

      const form = new FormData();
      form.append("judul", judul);
      form.append("isi", isi);
      if (file) form.append("gambar", file);

      const response = await fetch(`${API_BASE_URL}/api/pengumuman`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat pengumuman.");
      }

      // ========================================================
      // PERUBAHAN: Alert dihapus, ganti dengan Toast & Redirect
      // ========================================================
      setIsModalOpen(false); 
      toast.success("Pengumuman berhasil diterbitkan!"); // Notifikasi hijau di atas
      router.push("/admin/pengumuman");

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal membuat pengumuman.";
      console.error("Error submit pengumuman:", error);
      toast.error(`Gagal: ${message}`);
      setIsModalOpen(false); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <ConfirmationModal 
        isOpen={isModalOpen}
        isLoading={loading}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processSubmit}
      />

      <h1 className="text-2xl font-bold text-[#004A80] mb-6 text-center"> 
        Tambah Pengumuman Baru
      </h1>
    
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 md:p-8">
        <form className="space-y-5" onSubmit={handleFormSubmit}>
          
          {/* --- Judul --- */}
          <div>
            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-1">
              Judul
            </label>
            <input
              id="judul"
              type="text"
              className="border border-gray-300 text-black p-2 w-full rounded-md shadow-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
              placeholder="Judul Pengumuman"
              onChange={(e) => setJudul(e.target.value)}
              required
            />
          </div>

          {/* --- Isi Pengumuman --- */}
          <div>
            <label htmlFor="isi" className="block text-sm font-medium text-gray-700 mb-1">
              Isi Pengumuman
            </label>
            <textarea
              id="isi"
              className="border border-gray-300 text-black p-2 w-full rounded-md shadow-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
              placeholder="Tulis isi pengumuman di sini..."
              rows={5}
              onChange={(e) => setIsi(e.target.value)}
              required
            />
          </div>

          {/* --- Upload Gambar --- */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Gambar (Opsional)
            </label>
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-[#0060A9]
                hover:file:bg-blue-100"
            />
          </div>

          {/* --- Tombol Submit --- */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#0060A9] text-white w-full py-2.5 rounded-lg shadow-md hover:bg-[#004a80] transition-colors font-semibold"
            >
              Simpan Pengumuman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}