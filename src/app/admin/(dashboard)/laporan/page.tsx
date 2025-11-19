"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

interface PengaduanRow {
  id: number;
  tanggal_pengaduan?: string;
  createdAt?: string;
  kategori?: { nama_kategori: string };
  user?: { nama_lengkap: string; nik: string };
  status: string;
}

export default function DataPengaduanPage() {
  const router = useRouter();

  const [laporanList, setLaporanList] = useState<PengaduanRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ==========================
  // FETCH DATA PENGADUAN
  // ==========================
  const fetchPengaduan = async () => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/pengaduan?page=${page}&limit=10&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Gagal mengambil data pengaduan");

      const result = await res.json();
      const laporan = result.data?.pengaduan;

      if (!Array.isArray(laporan)) {
        throw new Error("Format data pengaduan tidak valid");
      }

      setLaporanList(laporan);
      setTotalPages(result.data.totalPages);
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduan();
  }, [page, search]);

  const formatTanggal = (tgl?: string) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "proses":
        return "bg-blue-500";
      case "selesai":
        return "bg-green-600";
      case "ditolak":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="relative">
      <div className="relative z-10 rounded-xl bg-white p-6 shadow-lg md:p-8">

        <h2 className="mb-6 text-center text-xl font-bold text-[#004A80] md:text-2xl">
          Data Pengaduan
        </h2>

        {/* SEARCH */}
        <div className="mb-6 flex justify-start text-black">
          <input
            type="text"
            placeholder="Cari nama, NIK, atau kategori..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full max-w-sm rounded-lg border border-[#0060A9] px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-[#0060A9] outline-none"
          />
        </div>

        {isLoading && <p className="text-center text-gray-500">Memuat data...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#004a80] text-white">
                <tr>
                  <th className="p-3 text-sm">No</th>
                  <th className="p-3 text-sm">Tanggal</th>
                  <th className="p-3 text-sm">Nama</th>
                  <th className="p-3 text-sm">NIK</th>
                  <th className="p-3 text-sm">Kategori</th>
                  <th className="p-3 text-sm">Status</th>
                  <th className="p-3 text-sm text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {laporanList.map((lap, index) => (
                  <tr
                    key={lap.id}
                    className="border-b border-gray-200 hover:bg-gray-100 transition"
                  >
                    <td className="p-3 text-sm text-[#004A80] font-semibold">
                      {index + 1 + (page - 1) * 10}
                    </td>

                    <td className="p-3 text-sm text-[#004A80]">
                      {formatTanggal(lap.createdAt)}
                    </td>

                    <td className="p-3 text-sm text-[#004A80]">
                      {lap.user?.nama_lengkap || "-"}
                    </td>

                    <td className="p-3 text-sm text-[#004A80]">
                      {lap.user?.nik || "-"}
                    </td>

                    <td className="p-3 text-sm text-[#004A80]">
                      {lap.kategori?.nama_kategori || "-"}
                    </td>

                    <td className="p-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${statusColor(
                          lap.status
                        )}`}
                      >
                        {lap.status}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => router.push(`/admin/laporan/${lap.id}`)}
                        className="rounded-full bg-[#0060A9] px-4 py-1 text-xs font-semibold text-white hover:bg-[#004A80] transition"
                      >
                        Detail
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
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#0060A9] disabled:bg-gray-300 disabled:text-gray-600 hover:bg-[#004A80] transition"
          >
            Prev
          </button>

          <span className="px-2 py-1 text-sm font-semibold text-[#004A80]">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#0060A9] disabled:bg-gray-300 disabled:text-gray-600 hover:bg-[#004A80] transition"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}
