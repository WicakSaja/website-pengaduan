"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface StatistikLaporan {
  total: number;
  pending: number;
  proses: number;
  selesai: number;
  ditolak: number;
}

interface StatistikSistem {
  total_users: number;
  total_pengaduan: number;
  active_admins: number;
}

const Bar = ({ height }: { height: string }) => (
  <div
    className="w-[45%] bg-[#0060A9] rounded-md shadow-md transition-all duration-700 ease-out hover:bg-[#004A80]"
    style={{ height }}
  ></div>
);

export default function StatistikPage() {
  const [laporan, setLaporan] = useState<StatistikLaporan | null>(null);
  const [sistem, setSistem] = useState<StatistikSistem | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("adminToken");
      const adminUser = localStorage.getItem("adminUser");

      if (!token || !adminUser) return;

      const user = JSON.parse(adminUser);
      setRole(user.role);

      const r1 = await fetch(`${API_BASE_URL}/api/dashboard/statistik-laporan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res1 = await r1.json();
      setLaporan(res1.data);

      if (user.role === "master_admin") {
        const r2 = await fetch(`${API_BASE_URL}/api/master/dashboard/statistik-sistem`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const res2 = await r2.json();
        setSistem(res2.data);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <p className="text-center p-6">Memuat Statistik...</p>;

  const maxValue = Math.max(
    laporan?.total || 0,
    laporan?.proses || 0,
    laporan?.selesai || 0,
    laporan?.ditolak || 0,
    sistem?.total_users || 0,
    sistem?.active_admins || 0
  );

  const calcHeight = (value: number) => {
    if (!maxValue) return "20px";
    return `${Math.max((value / maxValue) * 250, 20)}px`;
  };

  const generateScale = () => {
    const step = Math.ceil(maxValue / 5);
    return Array.from({ length: 6 }, (_, i) => step * (5 - i));
  };

  const chartData = [
    { label: "Total Pengaduan", value: laporan?.total || 0 },
    { label: "Diproses", value: laporan?.proses || 0 },
    { label: "Selesai", value: laporan?.selesai || 0 },
    { label: "Ditolak", value: laporan?.ditolak || 0 },
    ...(role === "master_admin"
      ? [
          { label: "Admin Aktif", value: sistem?.active_admins || 0 },
          { label: "Pengguna", value: sistem?.total_users || 0 },
        ]
      : []),
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#004A80] mb-6 flex gap-2">
        📊 Statistik Sistem
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex h-[350px]">

          {/* Sumbu Y */}
          <div className="flex flex-col justify-between text-right text-xs text-gray-400 pr-3 border-r border-gray-300">
            {generateScale().map((num, i) => (
              <span key={i}>{num}</span>
            ))}
          </div>

          {/* Bar Chart */}
         <div className="flex-1 flex justify-around items-end px-10 gap-6 border-b border-gray-200">

            {chartData.map((item, i) => (
              <Bar key={i} height={calcHeight(item.value)} />
            ))}
          </div>
        </div>

        {/* Label di bawah chart */}
        <div className="flex justify-around text-center gap-2">
          {chartData.map((item, idx) => (
            <div key={idx} className="w-24">
              <p className="font-bold text-sm text-gray-700">{item.value}</p>
              <p className="text-[11px] text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
