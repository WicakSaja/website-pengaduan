"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface Pengumuman {
  id: number;
  judul: string;
  isi: string;
  gambar?: string | null;
  dibuatPada?: string;
}

export default function PengumumanPage() {
  const [list, setList] = useState<Pengumuman[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/pengumuman`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setList(Array.isArray(data.data) ? data.data : []);
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col pt-28 container mx-auto px-6 max-w-5xl">

      <h1 className="text-3xl font-bold text-[#004A80] text-center mb-10">
        Semua Pengumuman
      </h1>

      {/* CARD LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {list.map((item) => (
    <Link key={item.id} href={`/pengumuman/${item.id}`}>
      <div
        className="cursor-pointer bg-white flex flex-col p-6 rounded-xl shadow-lg 
        border border-gray-200 transition duration-300 hover:shadow-xl hover:border-[#0060A9] hover:scale-[1.02] 
        min-h-80"  
      >
        
        {/* Judul */}
        <h3 className="text-lg font-semibold text-[#0060A9] mb-3 line-clamp-2">
          {item.judul}
        </h3>

        {/* Gambar */}
        {item.gambar && (
          <div className="w-full h-40 mb-4 overflow-hidden rounded-md border relative">
            <Image
              src={`${API_BASE_URL}${item.gambar}`}
              alt={item.judul || "Pengumuman"}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              priority={false}
            />
          </div>
        )}

        {/* Isi preview */}
        <p className="text-sm text-gray-700 line-clamp-3 mt-auto">
          {item.isi}
        </p>
      </div>
    </Link>
  ))}
</div>


      {/* PUSH FOOTER KE BAWAH */}
      <div className="grow" />
    </main>
  );
}
