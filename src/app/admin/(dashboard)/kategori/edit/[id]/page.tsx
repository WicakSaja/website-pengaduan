"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Style
const inputStyle =
  "w-full px-5 py-3 border border-gray-300 rounded-full text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";
const buttonBlueCapsule =
  "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";


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
            Apakah Anda yakin ingin memperbarui data kategori ini?
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

export default function EditKategoriPage() {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  const [namaKategori, setNamaKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State Modal

  const safeJSON = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Server tidak mengembalikan JSON. Cek route backend.");
    }
  };

  useEffect(() => {
    const fetchKategori = async () => {
      if (!id) return;

      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/kategori/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await safeJSON(res);

        if (!res.ok) throw new Error(result.message);
        const data = result.data.kategori || result.data;
        setNamaKategori(data.nama_kategori);
        setDeskripsi(data.deskripsi || "");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat data.";
        setError(message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchKategori();
  }, [id, router]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsModalOpen(true); 
  };

  const processUpdate = async () => {
    setIsUpdating(true);
    setError(null);

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      
      const res = await fetch(`${API_BASE_URL}/api/admin/kategori/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama_kategori: namaKategori,
          deskripsi,
        }),
      });

      const result = await safeJSON(res);

      if (!res.ok) throw new Error(result.message);

      setIsModalOpen(false); 
      toast.success("Kategori berhasil diperbarui!"); 

      setTimeout(() => router.push("/admin/kategori"), 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui kategori.";
      setError(message);
      setIsModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen pt-28 px-4">
      <Toaster position="top-center" />

      {/* --- MODAL KONFIRMASI --- */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        isLoading={isUpdating}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processUpdate}
      />

      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-xl font-bold text-[#004A80]">
          Ubah Data Kategori
        </h2>

        {isLoadingData ? (
          <div className="flex justify-center py-8 text-gray-500">
             <svg className="animate-spin h-6 w-6 mr-2 text-[#004A80]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             Memuat data...
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Nama */}
            <div>
              <label className="text-sm font-semibold text-[#004A80] mb-1 block">
                Nama Kategori
              </label>
              <input
                type="text"
                className={inputStyle}
                value={namaKategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label className="text-sm font-semibold text-[#004A80] mb-1 block">
                Deskripsi
              </label>
              <textarea
                className="w-full px-5 py-3 border border-gray-300 rounded-xl text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9] h-28"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && <p className="text-center text-red-600 bg-red-50 p-2 rounded">{error}</p>}

            {/* Tombol Update */}
            <div className="text-center">
              <button
                type="submit"
                className={buttonBlueCapsule}
                disabled={isUpdating}
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tombol kembali */}
      <div className="mt-4 w-full max-w-lg text-right">
        <Link href="/admin/kategori">
          <button className={buttonBlueCapsule} disabled={isUpdating}>
            Kembali
          </button>
        </Link>
      </div>
    </div>
  );
}