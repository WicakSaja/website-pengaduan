"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Interface Data
interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  dibuatPada: string;
  admin: {
    nama_lengkap: string;
  };
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading }: DeleteModalProps) => {
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
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">Hapus Pengumuman?</h3>
          <p className="text-gray-500 text-sm">
            Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.
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

export default function ListPengumuman() {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State untuk Modal Hapus
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: 0
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken"); 
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/pengumuman`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();
        setData(result.data || []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Gagal memuat data pengumuman.";
        console.error(error);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Fungsi Buka Modal
  const confirmDelete = (id: number) => {
    setDeleteModal({ isOpen: true, itemId: id });
  };

  // Fungsi Eksekusi Hapus
  const handleDelete = async () => {
    setIsDeleting(true);
    const id = deleteModal.itemId;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Sesi berakhir. Login kembali.");
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus.");
      }

      // Update UI
      setData(currentData => currentData.filter(item => item.id !== id));
      toast.success("Pengumuman berhasil dihapus.");
      setDeleteModal({ isOpen: false, itemId: 0 }); // Tutup modal

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal menghapus.";
      console.error("Error menghapus:", error);
      toast.error(`Gagal: ${message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format Tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* --- MODAL HAPUS --- */}
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        isLoading={isDeleting}
        onClose={() => setDeleteModal({ isOpen: false, itemId: 0 })}
        onConfirm={handleDelete}
      />

      {/* === HEADER === */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#004A80]">
          Kelola Pengumuman
        </h1>
        <Link
          href="/admin/pengumuman/tambah"
          className="bg-[#0060A9] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#004a80] transition-colors font-semibold"
        >
          + Tambah Pengumuman
        </Link>
      </div>

      {/* === TABEL DATA === */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-[#004A80] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Judul</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Admin</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#0060A9]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memuat data...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                  Belum ada pengumuman yang dibuat.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{item.judul}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                        {item.admin?.nama_lengkap || "Unknown"}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(item.dibuatPada)}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/pengumuman/edit/${item.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(item.id)} // Buka Modal
                      className="text-red-600 hover:text-red-900 font-semibold transition-colors"
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
    </div>
  );
}