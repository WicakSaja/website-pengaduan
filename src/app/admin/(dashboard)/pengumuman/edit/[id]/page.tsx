"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast"; // Gunakan Toast untuk notifikasi

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
          {/* Ikon Edit/Save */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0060A9]">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">Simpan Perubahan?</h3>
          <p className="text-gray-500 text-sm">
            Apakah Anda yakin ingin memperbarui data pengumuman ini?
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
              "Ya, Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditPengumumanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true); 
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Ambil data pengumuman
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Sesi berakhir. Silakan login kembali.");
        router.push("/admin/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Gagal memuat data pengumuman");

        const result = await response.json();
        
        setJudul(result.data.judul);
        setIsi(result.data.isi);
        setExistingImageUrl(result.data.gambar);

      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal memuat data pengumuman";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  // 2. Handler Form (Hanya Validasi & Buka Modal)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!judul.trim() || !isi.trim()) {
      toast.error("Judul dan Isi wajib diisi!");
      return;
    }
    
    setIsModalOpen(true); // Buka Modal Konfirmasi
  };

  // 3. Eksekusi Update (Dipanggil dari Modal)
  const processUpdate = async () => {
    setSubmitting(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Sesi berakhir. Silakan login kembali.");
        router.push("/admin/login");
        return;
      }

      const form = new FormData();
      form.append("judul", judul);
      form.append("isi", isi);
      if (file) {
        form.append("gambar", file);
      }

      const response = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan perubahan.");
      }

      setIsModalOpen(false); // Tutup modal
      toast.success("Perubahan berhasil disimpan!");
      router.push("/admin/pengumuman");

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan perubahan.";
      console.error(error);
      toast.error(`Gagal: ${message}`);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat data pengumuman...</div>;
  }

  return (
    <div className="p-6 md:p-8">
      {/* --- Render Modal --- */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        isLoading={submitting}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processUpdate}
      />

      <h1 className="text-2xl font-bold text-[#004A80] mb-6 text-center">
        Edit Pengumuman
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
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
              placeholder="Judul Pengumuman"
              value={judul}
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
              className="border border-gray-300 p-2 w-full rounded-md shadow-sm focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"
              placeholder="Tulis isi pengumuman di sini..."
              rows={5}
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              required
            />
          </div>

          {/* --- Gambar Saat Ini (Preview) --- */}
          {existingImageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gambar Saat Ini
              </label>
              <div className="relative w-full max-w-xs h-48 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                <Image
                  src={`${API_BASE_URL}${existingImageUrl.replace(/\\/g, "/")}`}
                  alt="Gambar Pengumuman"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* --- Upload Gambar Baru --- */}
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Ganti Gambar (Opsional)
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
            <p className="text-xs text-gray-500 mt-1">
              Biarkan kosong jika tidak ingin mengubah gambar.
            </p>
          </div>

          {/* --- Tombol Aksi --- */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 w-1/2 py-2.5 rounded-lg shadow-md hover:bg-gray-300 transition-colors disabled:bg-gray-100"
              disabled={submitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#0060A9] text-white w-1/2 py-2.5 rounded-lg shadow-md hover:bg-[#004a80] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}