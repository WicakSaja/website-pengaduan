"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

type BackendStatus =
  | "pending"
  | "diterima"
  | "ditolak"
  | "diproses"
  | "dilaksanakan"
  | "selesai";

interface Lampiran {
  id: number;
  filePath: string;
}

interface PengaduanDetail {
  id: number;
  judul: string;
  deskripsi: string;
  lokasi: string;
  createdAt: string;
  status: BackendStatus;
  lampiran: Lampiran[];
}

export default function DetailRiwayatPage() {
  const params = useParams();
  const id = params.id;

  const { token } = useAuth();

  const [data, setData] = useState<PengaduanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusOrder: BackendStatus[] = [
    "pending",
    "diterima",
    "diproses",
    "dilaksanakan",
    "selesai",
  ];

  const isComplete = (step: BackendStatus) => {
    if (!data) return false;

    if (data.status === "ditolak") {
      return step === "pending";
    }

    const currentIndex = statusOrder.indexOf(data.status);
    const stepIndex = statusOrder.indexOf(step);

    return currentIndex >= stepIndex;
  };

  useEffect(() => {
    if (!token) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pengaduan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        setData(result.data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat detail.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, token]);

  if (loading)
    return <div className="pt-28 text-center">Memuat detail...</div>;

  if (error)
    return <div className="pt-28 text-center text-red-600">{error}</div>;

  if (!data)
    return <div className="pt-28 text-center">Data tidak ditemukan</div>;

  return (
    <main className="pt-32 min-h-screen bg-transparant">
      <h1 className="text-3xl font-bold text-[#004A80] text-center mb-10">
        DETAIL PENGADUAN
      </h1>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white border rounded-xl shadow-xl p-10">

          {/* HEADER */}
          <h2 className="text-center text-lg font-semibold text-[#0060A9] mb-8">
            PENGADUAN ANDA
          </h2>

          <div className="flex flex-col md:flex-row gap-8">

    {data.lampiran.map((lamp, index) => {
  // 1. FIX URL: Pastikan ada slash pembatas agar URL valid
  let cleanPath = lamp.filePath.replace(/\\/g, "/");
  if (!cleanPath.startsWith("/")) {
    cleanPath = "/" + cleanPath;
  }
  const url = `${API_BASE_URL}${cleanPath}`;

  // Cek ekstensi file
  const isVideo = cleanPath.match(/\.(mp4|mkv|webm|avi)$/i);

  // 2. HELPER: Tentukan tipe konten (MIME Type) yang benar
  const getMimeType = (path: string) => {
    const lower = path.toLowerCase();
    if (lower.endsWith(".webm")) return "video/webm";
    if (lower.endsWith(".mkv")) return "video/x-matroska";
    return "video/mp4"; // Default
  };

  return (
    <div
      key={lamp.id}
      className="relative overflow-hidden rounded-lg border border-gray-300 group"
    >
      {/* 🎥 VIDEO */}
      {isVideo ? (
        <video
          controls
          preload="metadata"
          className="w-full h-32 object-cover bg-black"
          // 3. FIX UTAMA: HAPUS onClick yang memaksa fullscreen!
          // Biarkan kontrol bawaan browser menangani play/pause/fullscreen
        >
          <source src={url} type={getMimeType(cleanPath)} />
          Browser Anda tidak mendukung tag video.
        </video>
      ) : (
        // 🖼 GAMBAR
        <Image
          src={url}
          alt={`Lampiran-${index}`}
          width={320}
          height={128}
          className="w-full h-32 object-cover transition duration-300 group-hover:scale-110 cursor-pointer"
          onClick={() => window.open(url, "_blank")}
          onError={(e) =>
            (e.currentTarget.src =
              "https://via.placeholder.com/150?text=Error")
          }
        />
      )}

      {/* TEXT HOVER (Hanya untuk gambar, video sudah punya kontrol sendiri) */}
      {!isVideo && (
        <div 
          className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center pointer-events-none"
        >
          <span className="text-white opacity-0 group-hover:opacity-100 text-xs bg-black/50 px-2 py-1 rounded">
            Lihat Gambar
          </span>
        </div>
      )}
    </div>
  );
})}




            {/* INFORMASI */}
            <div className="text-gray-700 space-y-2 text-sm">
              <p><strong>Judul Masalah:</strong> {data.judul}</p>
              <p><strong>Deskripsi Masalah:</strong> {data.deskripsi}</p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {new Date(data.createdAt).toLocaleDateString("id-ID")}
              </p>
              <p><strong>Lokasi:</strong> {data.lokasi}</p>
            </div>
          </div>

          <hr className="my-10 border-[#0060A9]/40" />

          {/* STATUS */}
          <h2 className="text-center text-lg font-semibold text-[#0060A9] mb-6">
            STATUS DAN TANGGAPAN
          </h2>

          {data.status === "ditolak" && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6">
              <p className="font-bold">Aduan Ditolak</p>
              <p>Aduan Anda telah ditolak oleh admin.</p>
            </div>
          )}

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-11 w-[3px] bg-gray-300"></div>

            {[
              { key: "pending", title: "Diterima", desc: "Laporan diterima" },
              {
                key: "diterima",
                title: "Diverifikasi",
                desc: "Laporan telah diverifikasi admin",
              },
              {
                key: "diproses",
                title: "Dalam Proses",
                desc: "Laporan valid, sedang ditangani",
              },
              {
                key: "dilaksanakan",
                title: "Dilaksanakan",
                desc: "Tindakan telah dilakukan",
              },
              {
                key: "selesai",
                title: "Selesai",
                desc: "Aduan telah selesai sepenuhnya",
              },
            ].map((step) => (
              <div key={step.key} className="relative flex gap-4 items-start mb-6">
                <div
                  className={`h-4 w-4 rounded-full border-2 z-10 ${
                    isComplete(step.key as BackendStatus)
                      ? step.key === "selesai"
                        ? "bg-green-600 border-green-600"
                        : "bg-[#0060A9] border-[#0060A9]"
                      : "border-gray-400"
                  }`}
                ></div>

                <div>
                  <p className="font-semibold text-[#004A80]">{step.title}</p>
                  <p className="text-sm text-gray-700">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/riwayat">
              <button className="bg-[#0060A9] text-white px-8 py-2 rounded-full hover:bg-[#004a80]">
                Kembali
              </button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
