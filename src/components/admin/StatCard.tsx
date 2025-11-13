// src/components/admin/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // Terima ikon sebagai JSX
}

// Direvisi sesuai desain baru (putih, footer biru)
const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    // Kartu putih, rounded, shadow
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      {/* Bagian Atas (Angka & Ikon) */}
      <div className="flex items-center justify-between p-6">
        {/* Angka (Biru) */}
        <span className="text-3xl font-bold text-[#0060A9] md:text-4xl">{value}</span>
        {/* Ikon (Biru dalam Lingkaran Biru Muda) */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl text-[#007BCC] md:h-14 md:w-14">
           {icon} {/* Tampilkan ikon langsung */}
        </div>
      </div>
      {/* Bagian Bawah (Footer Biru) */}
      <div className="bg-[#007BCC] p-3 text-center text-sm font-semibold text-white md:p-4 md:text-base">
        <span>{title}</span>
      </div>
    </div>
  );
};

export default StatCard;