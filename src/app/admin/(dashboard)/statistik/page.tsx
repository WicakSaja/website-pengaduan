// src/app/admin/(dashboard)/statistik/page.tsx
import React from 'react';

// Komponen helper untuk 'bar' di chart
const Bar = ({ height, label }: { height: string, label: string }) => (
  <div className="flex-1 flex flex-col justify-end items-center gap-2">
    {/* Bar-nya */}
    <div 
      className="w-3/4 bg-gray-200 rounded-t-md"
      style={{ height: height }}
    ></div>
    {/* Label di bawah */}
    <span className="text-xs text-gray-500 text-center">{label}</span>
  </div>
);

export default function StatistikPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Statistik
      </h1>

      {/* 1. Kontainer Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        
        {/* Wrapper untuk chart dan sumbu Y */}
        <div className="flex h-[400px]">
          
          {/* Sumbu Y (Angka) */}
          <div className="flex flex-col justify-between text-right text-xs text-gray-400 pr-2 border-r border-gray-200">
            <span>200</span>
            <span>175</span>
            <span>150</span>
            <span>125</span>
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span className="text-transparent">0</span> {/* Untuk alignment */}
          </div>
          
          {/* Area Chart (Bar) */}
          <div className="flex-1 flex justify-around items-end pl-2 border-b border-gray-200">
            {/* Ini adalah mockup statis. 
              Tinggi bar (height) nanti akan diisi data dari API.
              Contoh: height: `${(data.pending / data.total) * 100}%` 
            */}
            <Bar height="10%" label="Pengaduan yang Masuk" />
            <Bar height="5%" label="Pengaduan yang Diproses" />
            <Bar height="3%" label="Pengaduan yang Selesai" />
            <Bar height="2%" label="Pengaduan yang Ditolak" />
            <Bar height="4%" label="Admin" />
            <Bar height="60%" label="Pengguna" /> 
          </div>

        </div>
      </div>
    </div>
  );
}