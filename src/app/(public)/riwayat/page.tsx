"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface Lampiran {
  id: number;
  filePath: string;
}

interface PengaduanItem {
  id: number;
  judul: string;
  createdAt: string;
  status: string;
  lampiran: Lampiran[];
}

export default function RiwayatPage() {
  const { token, isLoading: authLoading } = useAuth();

  const [riwayat, setRiwayat] = useState<PengaduanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (!token) {
      setError("Harus login terlebih dahulu.");
      setLoading(false);
      return;
    }

    const fetchRiwayat = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/pengaduan/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal mengambil riwayat pengaduan.");
        }

        setRiwayat(Array.isArray(result.data) ? result.data : []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal mengambil riwayat pengaduan.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, [token]);

  if (loading || authLoading)
    return (
      <div className="flex min-h-screen items-center justify-center pt-32">
        Memuat riwayat...
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center pt-32 text-red-600">
        {error}
      </div>
    );

  return (
    <main className="pt-32 min-h-screen bg-transparant relative overflow-hidden">
      <h1 className="text-3xl font-bold text-[#004A80] text-center mb-10">
        RIWAYAT PENGADUAN
      </h1>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {riwayat.length === 0 ? (
          <p className="text-center text-gray-600">Belum ada pengaduan.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {riwayat.map((item) => (
              <Link key={item.id} href={`/riwayat/${item.id}`}>
           
                <div className="cursor-pointer rounded-xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-md">

                  {/* === GAMBAR LAMPIRAN UTAMA === */}
                  <div className="relative block h-40 w-full overflow-hidden group">
                   {/* === MEDIA PREVIEW (Gambar atau Video) === */}
{item.lampiran?.[0] ? (
  item.lampiran[0].filePath.match(/\.(mp4|mkv|webm|avi)$/i) ? (
    <video
      controls
      className="w-full h-full object-cover bg-black"
      onError={(e) => {
        (e.target as HTMLVideoElement).poster =
          "https://via.placeholder.com/300x200?text=Video+Error";
      }}
    >
      <source
        src={`${API_BASE_URL}${item.lampiran[0].filePath.replace(/\\/g, "/")}`}
        type="video/mp4"
      />
    </video>
  ) : (
    <Image
      src={`${API_BASE_URL}${item.lampiran[0].filePath.replace(/\\/g, "/")}`}
      alt={item.judul || "Lampiran"}
      width={400}
      height={200}
      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        target.src = "https://via.placeholder.com/300x200?text=Gagal+Memuat";
      }}
    />
  )
) : (
  <Image
    src="/placeholder-image.png"
    alt="Placeholder"
    width={400}
    height={200}
    className="w-full h-full object-cover"
  />
)}

                  </div>

                  {/* === KONTEN TEKS === */}
                  <div className="p-5 text-center">
                    <p className="font-bold text-base text-[#0060A9] h-12 overflow-hidden line-clamp-2 leading-snug">
                      {item.judul}
                    </p>

                    <p className="text-gray-500 text-xs mt-3 font-medium">
                      {isClient
                        ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "..."}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12 mb-16">
          <Link href="/">
            <button className="bg-[#0060A9] text-white px-8 py-3 rounded-full shadow-lg hover:bg-[#004a80] hover:shadow-xl transition-all font-semibold text-sm">
              Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}