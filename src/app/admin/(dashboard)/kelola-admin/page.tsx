"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Interface sesuai data dari API
interface AdminData {
  id: number;
  nama_lengkap: string;
  username: string;
  role: string;
}

export default function KelolaAdminPage() {
  const router = useRouter();
  const [adminList, setAdminList] = useState<AdminData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Data Admin
  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Pastikan data adalah array
          setAdminList(Array.isArray(result.data) ? result.data : []);
        } else {
          throw new Error(result.message || 'Gagal mengambil data admin');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal terhubung ke server.';
        console.error(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, [router]);

  // Handle Hapus Admin
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Admin berhasil dihapus.');
        // Hapus dari state tanpa reload
        setAdminList((prev) => prev.filter((admin) => admin.id !== id));
      } else {
        alert(result.message || 'Gagal menghapus admin.');
      }
    } catch {
      alert('Terjadi kesalahan saat menghapus admin.');
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* === Header Halaman === */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#004A80]">
          Manajemen Admin
        </h1>
        
        {/* Tombol Tambah Admin */}
        <Link href="/admin/kelola-admin/tambah">
          <button className="bg-[#0060A9] text-white px-6 py-2.5 rounded-full shadow-md hover:bg-[#004a80] transition-colors font-semibold text-sm">
            + Tambah Admin
          </button>
        </Link>
      </div>

      {/* === Konten Utama === */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center text-gray-500">Memuat data admin...</div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center text-red-600 bg-red-50 border-b border-red-100">
            {error}
          </div>
        )}

        {/* Tabel Data */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              {/* Header Tabel */}
              <thead className="bg-[#004A80] text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-12">
                    No
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* Body Tabel */}
              <tbody className="bg-white divide-y divide-gray-100">
                {adminList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                      Belum ada data admin yang tersedia.
                    </td>
                  </tr>
                ) : (
                  adminList.map((admin, index) => (
                    <tr key={admin.id} className="hover:bg-blue-50 transition-colors">
                      {/* No */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0060A9]">
                        {index + 1}
                      </td>
                      
                      {/* Nama */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {admin.nama_lengkap}
                      </td>
                      
                      {/* Username */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {admin.username}
                      </td>
                      
                      {/* Role Badge */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              admin.role === 'master_admin'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : admin.role === 'pimpinan'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }
                          `}
                        >
                          {admin.role === 'master_admin' 
                            ? 'Master Admin' 
                            : admin.role === 'pimpinan' 
                              ? 'Pimpinan' 
                              : 'Admin'}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/kelola-admin/edit/${admin.id}`}>
                            <button className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition text-xs font-semibold">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-100 transition text-xs font-semibold"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}