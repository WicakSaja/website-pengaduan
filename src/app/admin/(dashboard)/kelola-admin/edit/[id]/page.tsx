"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Style Reusable
const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]";
const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9] bg-white";
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

interface AdminRecord {
  id: number;
  nama_lengkap: string;
  username: string;
  role: string;
}

// ==========================================================
// 1. KOMPONEN MODAL KONFIRMASI (REUSABLE)
// ==========================================================
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
          {/* Ikon Edit/Pencil */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0060A9]">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">Simpan Perubahan?</h3>
          <p className="text-gray-500 text-sm">
            Apakah Anda yakin ingin memperbarui data admin ini?
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
            {isLoading ? "Menyimpan..." : "Ya, Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // State Form
  const [namaLengkap, setNamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState(""); // Optional untuk update password

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data Admin Saat Ini
  useEffect(() => {
    if (!id) return;

    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        // Anda mungkin perlu membuat endpoint GET /api/admin/admins/:id di backend
        // Jika belum ada, kita bisa memfilter dari list (kurang efisien tapi bisa jalan sementara)
        const res = await fetch(`${API_BASE_URL}/api/admin/admins`, {
             headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();

        if (result.success) {
            const admins: AdminRecord[] = Array.isArray(result.data)
              ? result.data
              : Array.isArray(result.data?.admins)
                ? result.data.admins
                : [];
            const currentAdmin = admins.find((a) => a.id === Number(id));
            if (currentAdmin) {
                setNamaLengkap(currentAdmin.nama_lengkap);
                setUsername(currentAdmin.username);
                setRole(currentAdmin.role);
            } else {
                toast.error("Data admin tidak ditemukan");
                router.push("/admin/kelola-admin");
            }
        } else {
            throw new Error(result.message);
        }

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat data admin";
        console.error(err);
        toast.error(message);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAdmin();
  }, [id, router]);

  // 2. Handler Form (Buka Modal)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap || !username || !role) {
        toast.error("Mohon lengkapi data wajib.");
        return;
    }
    setIsModalOpen(true);
  };

  // 3. Handler API (Eksekusi Update)
  const processUpdate = async () => {
    setIsUpdating(true);
    const token = localStorage.getItem("adminToken");

    if (!token) {
        router.push("/admin/login");
        return;
    }

    const updateData: Partial<Pick<AdminRecord, "nama_lengkap" | "username" | "role">> & { password?: string } = {
        nama_lengkap: namaLengkap,
        username: username,
        role: role
    };

    // Hanya kirim password jika diisi
    if (password.trim() !== "") {
        updateData.password = password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/admins/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Gagal update admin");

      setIsModalOpen(false);
      toast.success("Admin berhasil diperbarui!");
      
      setTimeout(() => {
        router.push("/admin/kelola-admin");
      }, 1000);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
      toast.error(message);
      setIsModalOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoadingData) {
    return <div className="p-8 text-center text-gray-500 pt-32">Memuat data admin...</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <Toaster position="top-center" />

      {/* --- MODAL --- */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        isLoading={isUpdating}
        onClose={() => setIsModalOpen(false)}
        onConfirm={processUpdate}
      />

      <h1 className="text-2xl font-bold text-[#004A80] mb-6 text-center">
        Edit Data Admin
      </h1>

      <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
        <form className="space-y-5" onSubmit={handleFormSubmit}>
          
          {/* Nama Lengkap */}
          <div>
            <label className={labelStyle}>Nama Lengkap</label>
            <input
              type="text"
              className={inputStyle}
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className={labelStyle}>Username</label>
            <input
              type="text"
              className={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className={labelStyle}>Role (Peran)</label>
            <select
              className={inputStyle}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="pimpinan">Pimpinan</option>
              <option value="master_admin">Master Admin</option>
            </select>
          </div>

          {/* Password (Opsional) */}
          <div>
            <label className={labelStyle}>Password Baru (Opsional)</label>
            <input
              type="password"
              className={inputStyle}
              placeholder="Kosongkan jika tidak ingin mengubah"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
             <p className="text-xs text-gray-500 mt-1">
                Isi hanya jika Anda ingin mengganti password admin ini.
            </p>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-4 flex gap-3 justify-end">
            <Link href="/admin/kelola-admin">
                <button type="button" className="rounded-full bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition">
                    Batal
                </button>
            </Link>
            
            <button
                type="submit"
                className={buttonBlueCapsule}
                disabled={isUpdating}
            >
                {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}