"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

export default function DetailPengaduanPage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return router.push("/admin/login");

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setData(result.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat detail pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      alert("Status berhasil diperbarui");
      fetchDetail();
    } catch (err) {
      console.error(err);
      alert("Gagal update status");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat...</p>;
  if (!data) return <p className="text-center mt-10">Data tidak ditemukan</p>;

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="bg-white w-full max-w-3xl rounded-xl p-8 shadow-md border border-gray-200">

        {/* TITLE */}
        <h2 className="text-center text-xl font-bold text-[#004A80] mb-8">
          Detail Data Pengaduan
        </h2>

        {/* DETAIL SECTION */}
        <div className="space-y-5 text-sm">
          {[
            ["Id", data.id],
            ["Tanggal Lapor", new Date(data.createdAt).toLocaleDateString("id-ID")],
            ["NIK", data.user?.nik || "-"],
            ["Kategori", data.kategori?.nama_kategori || "-"],
            ["Status Saat Ini", data.status],
            ["Judul Pengaduan", data.judul],
            ["Lokasi", data.lokasi],
          ].map(([label, value], index) => (
            <div key={index} className="border-b pb-3">
              <p className="font-semibold text-[#004A80]">{label}</p>
              <p className="mt-1 text-gray-700">{value}</p>
            </div>
          ))}

          {/* DESKRIPSI */}
          <div className="border-b pb-3">
            <p className="font-semibold text-[#004A80]">Deskripsi</p>
            <p className="mt-1 text-gray-700 leading-relaxed">{data.deskripsi}</p>
          </div>
        </div>
        {/* LAMPIRAN / FOTO */}
<div className="border-b pb-3 mt-6">
  <p className="font-semibold text-[#004A80] mb-2">Lampiran</p>

  {data.lampiran && data.lampiran.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {data.lampiran.map((item: any) => (
        <a
          key={item.id}
          href={`http://localhost:5000${item.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={`http://localhost:5000${item.filePath}`}
            alt="Lampiran"
            className="w-full h-32 object-cover rounded-lg shadow-sm border"
          />
        </a>
      ))}
    </div>
  ) : (
    <p className="text-gray-600 text-sm">Tidak ada lampiran</p>
  )}
</div>


        {/* UPDATE STATUS */}
        <div className="mt-10 text-center">
          <h3 className="font-semibold text-[#004A80] mb-4">Update Status</h3>

          <div className="flex justify-center gap-5 mb-8">
            <button
              onClick={() => updateStatus("diproses")}
              className="bg-[#0060A9] text-white px-6 py-2 rounded-full hover:bg-[#004A80] transition"
            >
              Diterima
            </button>

            <button
              onClick={() => updateStatus("ditolak")}
              className="bg-[#0060A9] text-white px-6 py-2 rounded-full hover:bg-[#004A80] transition"
            >
              Ditolak
            </button>
          </div>

          <button
            onClick={() => router.back()}
            className="bg-[#004A80] text-white px-6 py-2 rounded-full hover:bg-[#002f55] transition"
          >
            Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
