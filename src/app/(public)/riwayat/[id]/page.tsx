"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const API_BASE_URL = "http://localhost:5000";

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
    status: "pending" | "diproses" | "selesai"; // FIX STATUS
    lampiran: Lampiran[];
}

export default function DetailRiwayatPage() {
    const params = useParams();
    const id = params.id;

    const { token } = useAuth();

    const [data, setData] = useState<PengaduanDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // =============================
    // STATUS CHECK FIXED
    // =============================
    const isComplete = (step: string) => {
        if (!data) return false;

        // urutan yang benar sesuai database
        const order = ["pending", "diproses", "selesai"];

        return order.indexOf(data.status) >= order.indexOf(step);
    };

    useEffect(() => {
        if (!token) return;

        const fetchDetail = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/pengaduan/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const result = await res.json();
                if (!res.ok) throw new Error(result.message);

                setData(result.data);
            } catch (err: any) {
                setError(err.message || "Gagal memuat detail.");
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
        <main className="pt-32 min-h-screen bg-white">

            <h1 className="text-3xl font-bold text-[#004A80] text-center mb-10">
                DETAIL PENGADUAN
            </h1>

            <div className="max-w-5xl mx-auto p-6">
                <div className="bg-white border rounded-xl shadow-xl p-10">

                    {/* === BAGIAN HEADER === */}
                    <h2 className="text-center text-lg font-semibold text-[#0060A9] mb-8">
                        PENGADUAN ANDA
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8">

                        {/* FOTO */}
                        <div
                            className="h-40 w-56 bg-gray-200 bg-cover bg-center rounded"
                            style={{
                                backgroundImage: `url(${
                                    data.lampiran?.[0]
                                        ? API_BASE_URL + data.lampiran[0].filePath.replace(/\\/g, "/")
                                        : "/placeholder-image.png"
                                })`
                            }}
                        ></div>

                        {/* INFO */}
                        <div className="text-gray-700 space-y-2 text-sm">
                            <p><strong>Judul Masalah:</strong> {data.judul}</p>
                            <p><strong>Deskripsi Masalah:</strong> {data.deskripsi}</p>
                            <p><strong>Tanggal:</strong> {new Date(data.createdAt).toLocaleDateString("id-ID")}</p>
                            <p><strong>Lokasi:</strong> {data.lokasi}</p>
                        </div>
                    </div>

                    <hr className="my-10 border-[#0060A9]/40" />

                  {/* ============================= */}
{/*          STATUS UI           */}
{/* ============================= */}

<h2 className="text-center text-lg font-semibold text-[#0060A9] mb-6">
    STATUS DAN TANGGAPAN
</h2>

<div className="relative">

    {/* GARIS VERTICAL */}
    <div className="absolute left-[7px] top-2 bottom-11 w-[3px] 
        bg-gray-300">
    </div>

    {/* Step 1 */}
    <div className="relative flex gap-4 items-start mb-6">
        {/* Lingkaran */}
        <div className={`h-4 w-4 rounded-full border-2 z-10
            ${isComplete("pending") ? "bg-[#0060A9] border-[#0060A9]" : "border-gray-400"}
        `}></div>

        {/* Teks */}
        <div>
            <p className="font-semibold text-[#004A80]">Diterima</p>
            <p className="text-sm text-gray-700">Laporan diterima</p>
        </div>
    </div>

    {/* Step 2 */}
    <div className="relative flex gap-4 items-start mb-6">
        <div className={`h-4 w-4 rounded-full border-2 z-10
            ${isComplete("diproses") ? "bg-[#0060A9] border-[#0060A9]" : "border-gray-400"}
        `}></div>

        <div>
            <p className="font-semibold text-[#004A80]">Diverifikasi</p>
            <p className="text-sm text-gray-700">Laporan telah diverifikasi</p>
        </div>
    </div>

    {/* Step 3 */}
    <div className="relative flex gap-4 items-start mb-6">
        <div className={`h-4 w-4 rounded-full border-2 z-10
            ${isComplete("diproses") ? "bg-[#0060A9] border-[#0060A9]" : "border-gray-400"}
        `}></div>

        <div>
            <p className="font-semibold text-[#004A80]">Dalam Proses</p>
            <p className="text-sm text-gray-700">Laporan valid, diteruskan ke tim teknisi</p>
        </div>
    </div>

    {/* Step 4 */}
    <div className="relative flex gap-4 items-start">
        <div className={`h-4 w-4 rounded-full border-2 z-10
            ${isComplete("selesai") ? "bg-[#0060A9] border-[#0060A9]" : "border-gray-400"}
        `}></div>

        <div>
            <p className="font-semibold text-[#004A80]">Selesai</p>
            <p className="text-sm text-gray-700">Laporan sudah diperbaiki oleh tim teknisi</p>
        </div>
    </div>

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
