"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface Kategori {
  id: number;
  nama_kategori: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteModal = ({ isOpen, categoryName, onClose, onConfirm, isLoading }: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 border border-gray-100">
        <div className="p-6 text-center">
          {/* Ikon Sampah Merah */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">Hapus Kategori?</h3>
          <p className="text-gray-500 text-sm">
            Kategori <span className="font-bold text-gray-800">&quot;{categoryName}&quot;</span> akan dihapus permanen.
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
            className="w-1/2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition shadow-md disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DataKategoriPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State Modal Hapus
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: 0,
    name: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // FETCH DATA
  const fetchKategori = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("adminToken"); // Ambil token untuk auth (opsional jika endpoint public)
      
      const response = await fetch(`${API_BASE_URL}/api/kategori`, {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Handle struktur data yang mungkin berbeda {data: [...]} atau {data: {kategori: [...]}}
        const data = result.data.kategori || result.data;
        setKategoriList(Array.isArray(data) ? data : []);
      } else {
        setError(result.message || "Gagal mengambil data kategori.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  // BUKA MODAL
  const confirmDelete = (id: number, name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  // PROSES HAPUS (API)
  const handleDelete = async () => {
    setIsDeleting(true);
    const { id } = deleteModal;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Sesi habis. Silakan login ulang.");
      setIsDeleting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/kategori/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menghapus kategori.");
      }

      toast.success("Kategori berhasil dihapus.");
      
      // Update UI tanpa fetch ulang (Optimistic UI)
      setKategoriList(prev => prev.filter(k => k.id !== id));
      setDeleteModal({ isOpen: false, id: 0, name: "" }); // Tutup modal

    } catch (error: unknown) { 
      const message = error instanceof Error ? error.message : "Gagal menghapus kategori.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-center" />

      {/* --- MODAL HAPUS --- */}
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        categoryName={deleteModal.name}
        isLoading={isDeleting}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDelete}
      />

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-8">
        
        <h2 className="text-center text-2xl font-bold text-[#004A80] mb-6">
          Kelola Data Kategori
        </h2>

        {isLoading && <p className="text-center text-gray-500 py-4">Memuat data...</p>}
        {error && <p className="text-center text-red-600 py-4 bg-red-50 rounded-lg mb-4">{error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse ">
              <thead>
                <tr className="bg-[#004A80] text-white text-sm uppercase tracking-wider">
                  <th className="p-4 text-left rounded-tl-lg font-semibold">No</th>
                  <th className="p-4 text-left font-semibold">Nama Kategori</th>
                  <th className="p-4 text-right rounded-tr-lg font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className="w-full min-w-full divide-y divide-gray-200">
                {kategoriList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500 italic">
                      Belum ada kategori yang ditambahkan.
                    </td>
                  </tr>
                ) : (
                  kategoriList.map((kategori, index) => (
                    <tr key={kategori.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-[#0060A9]">{index + 1}</td>
                      <td className="p-4 text-sm text-gray-700 font-medium">{kategori.nama_kategori}</td>
                      <td className="p-4 text-right space-x-2">

                        <Link href={`/admin/kategori/edit/${kategori.id}`}>
                          <button className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-1.5 rounded-md hover:bg-indigo-100 transition text-xs font-bold shadow-sm">
                            Edit
                          </button>
                        </Link>

                        <button
                          onClick={() => confirmDelete(kategori.id, kategori.nama_kategori)}
                          className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-md hover:bg-red-100 transition text-xs font-bold shadow-sm"
                        >
                          Hapus
                        </button>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && (
          <div className="text-right mt-8 pt-4 border-t border-gray-100">
            <Link href="/admin/kategori/baru">
              <button className="bg-[#0060A9] px-6 py-2.5 rounded-full text-sm font-bold text-white hover:bg-[#004a80] transition shadow-md">
                + Tambah Kategori
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}