    "use client";

    import { useState, useEffect, use } from "react";
    import Image from "next/image";
    import Link from "next/link";

    const API_BASE_URL =  process.env.NEXT_PUBLIC_API_BASE;

        interface PengumumanDetail {
            id: number;
            judul: string;
            isi: string;
            dibuatPada: string;
            gambar?: string | null;
        }

        export default function DetailPengumuman({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // ⬅️ cara terbaru (menghapus warning)

        const [detail, setDetail] = useState<PengumumanDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
        const res = await fetch(`${API_BASE_URL}/api/pengumuman/${id}`);
        const json = await res.json();
        setDetail(json?.data || null);
        setLoading(false);
        }
        loadData();
    }, [id]);

    if (loading)
        return <div className="min-h-screen flex justify-center items-center">Memuat...</div>;

    if (!detail)
        return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-3">
            <p className="text-gray-500 text-lg">Pengumuman tidak ditemukan</p>
            <Link href="/pengumuman" className="text-[#0060A9] underline">← Kembali</Link>
        </div>
        );

    return (
        <main className="min-h-screen pt-24 px-6 max-w-4xl mx-auto">
       

        <h1 className="text-3xl font-bold text-[#004A80] mb-4">{detail.judul}</h1>

        <p className="text-gray-500 text-sm mb-6">
            Dipublikasikan: {new Date(detail.dibuatPada).toLocaleDateString("id-ID")}
        </p>

                {detail.gambar && (
                        <div className="w-full max-h-[350px] relative rounded-xl shadow mb-6 overflow-hidden">
                            <Image
                                src={`${API_BASE_URL}${detail.gambar}`}
                                alt={detail.judul || "Pengumuman"}
                                fill
                                sizes="(max-width: 768px) 100vw, 80vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                )}

        <p className="text-lg leading-relaxed whitespace-pre-line text-gray-700">
            {detail.isi}
        </p>
        <Link
  href="/pengumuman"
  className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full 
  border border-[#0060A9] text-[#0060A9] font-medium transition-all 
  hover:bg-[#0060A9] hover:text-white hover:shadow-md"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L6.707 7l4.647 4.646a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708 0z"/>
  </svg>
  Kembali
</Link>

        </main>
    );
    }
