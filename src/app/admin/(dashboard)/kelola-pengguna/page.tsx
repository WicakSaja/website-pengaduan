"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

interface UserRow {
  id: number;
  nama_lengkap: string;
  nik: string;
  no_hp: string;
  alamat: string;
  username: string;
  createdAt: string;
}

export default function DataPenggunaPage() {
  const router = useRouter();

  const [userList, setUserList] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/users?page=${page}&limit=10&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Gagal mengambil data pengguna");

      const result = await res.json();
      const users = result.data?.users;

      if (!Array.isArray(users)) {
        throw new Error("Format data pengguna tidak valid dari server");
      }

      setUserList(users);
      setTotalPages(result.data.totalPages);
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null) return;

    const token = localStorage.getItem("adminToken");
    if (!token) return alert("Token hilang");

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setDeleteId(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative z-0">
      {/* TABEL DATA */}
      <div className="relative z-10 rounded-xl bg-white p-6 shadow-lg md:p-8">
        <h2 className="mb-4 text-center text-xl font-bold text-[#004A80] md:text-2xl">
          Data Pengguna
        </h2>

        {/* SEARCH BAR */}
        <div className="mb-6 flex justify-start">
          <input
            type="text"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full max-w-sm rounded-lg border border-[#0060A9] px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#0060A9] outline-none"
          />
        </div>

        {isLoading && <p className="text-center text-gray-500">Memuat...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-[#004a80] text-white">
                <tr>
                  <th className="p-3 px-4 text-sm">No</th>
                  <th className="p-3 px-4 text-sm">Nama</th>
                  <th className="p-3 px-4 text-sm">NIK</th>
                  <th className="p-3 px-4 text-sm">No HP</th>
                  <th className="p-3 px-4 text-sm">Username</th>
                  <th className="p-3 px-4 text-sm text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {userList.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition"
                  >
                    <td className="p-3 px-4 text-sm font-semibold text-[#004A80]">
                      {index + 1 + (page - 1) * 10}
                    </td>
                    <td className="p-3 px-4 text-sm font-semibold text-[#004A80]">
                      {user.nama_lengkap}
                    </td>
                    <td className="p-3 px-4 text-sm font-semibold text-[#004A80]">
                      {user.nik}
                    </td>
                    <td className="p-3 px-4 text-sm font-semibold text-[#004A80]">
                      {user.no_hp}
                    </td>
                    <td className="p-3 px-4 text-sm font-semibold text-[#004A80]">
                      {user.username}
                    </td>
                    <td className="p-3 px-4 text-sm text-center">
                      <button
                        onClick={() => setDeleteId(user.id)}
                        className="rounded-full bg-red-600 px-4 py-1 text-xs font-semibold text-white hover:bg-red-700 transition shadow"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#0060A9] disabled:bg-gray-300 hover:bg-[#004A80] transition"
          >
            Prev
          </button>

          <span className="px-2 py-1 text-sm font-semibold text-[#004A80]">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#0060A9] disabled:bg-gray-300 hover:bg-[#004A80] transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* POPUP DELETE */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="rounded-xl bg-white p-6 shadow-xl w-[300px]">
            <p className="text-center mb-4 font-medium text-[#004A80] text-sm">
              Hapus pengguna ini?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg bg-gray-400 px-4 py-1 text-white hover:bg-gray-500"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-1 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
