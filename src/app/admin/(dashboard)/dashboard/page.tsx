  "use client";

  import { useState, useEffect } from "react";
  import { useRouter } from "next/navigation";
  import StatCard from "@/components/admin/StatCard";

  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faBullhorn,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faUsers,
    faUserShield,
  } from "@fortawesome/free-solid-svg-icons";

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

  interface AdminUser {
    id: number;
    nama_lengkap: string;
    role: "admin" | "master_admin" | "pimpinan";
  }

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

  export default function AdminDashboardPage() {
    const router = useRouter();

    const [laporan, setLaporan] = useState<StatistikLaporan | null>(null);
    const [sistem, setSistem] = useState<StatistikSistem | null>(null);
    const [role, setRole] = useState<AdminUser["role"] | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const load = async () => {
        const token = localStorage.getItem("adminToken");
        const userData = localStorage.getItem("adminUser");

        if (!token || !userData) {
          router.push("/admin/login");
          return;
        }

        const admin: AdminUser = JSON.parse(userData);
        setRole(admin.role);

        // Statistik Laporan
        const r1 = await fetch(`${API_BASE_URL}/api/dashboard/statistik-laporan`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data1 = await r1.json();
        setLaporan(data1.data);

        // Statistik Sistem → hanya Master Admin
        if (admin.role === "master_admin") {
          const r2 = await fetch(
            `${API_BASE_URL}/api/master/dashboard/statistik-sistem`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (r2.ok) {
            const data2 = await r2.json();
            setSistem(data2.data);
          }
        }

        setLoading(false);
      };

      load();
    }, [router]);

    if (loading) {
      return <p className="p-6 text-center">Memuat dashboard...</p>;
    }

    // Grid Master Admin harus 3 kolom seperti gambar
    const gridClass =
      role === "master_admin"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#004A80] mb-6">
          Dashboard Admin
        </h1>

        <div className={gridClass}>
          {/* ----------- Kartu Untuk Semua Admin ----------- */}

          <StatCard
            title="Total Pengaduan"
            value={laporan?.total ?? 0}
            icon={<FontAwesomeIcon icon={faBullhorn} />}
          />

          <StatCard
            title="Pengaduan Selesai"
            value={laporan?.selesai ?? 0}
            icon={<FontAwesomeIcon icon={faCheckCircle} />}
          />

          <StatCard
            title="Pengaduan Diproses"
            value={laporan?.proses ?? 0}
            icon={<FontAwesomeIcon icon={faClock} />}
          />

          <StatCard
            title="Pengaduan Ditolak"
            value={laporan?.ditolak ?? 0}
            icon={<FontAwesomeIcon icon={faTimesCircle} />}
          />

          {/* ----------- Kartu Tambahan untuk MASTER ADMIN ----------- */}
          {role === "master_admin" && (
            <>
              <StatCard
                title="Total Pengguna Aktif"
                value={sistem?.total_users ?? 0}
                icon={<FontAwesomeIcon icon={faUsers} />}
              />

              <StatCard
                title="Total Admin"
                value={sistem?.active_admins ?? 0}
                icon={<FontAwesomeIcon icon={faUserShield} />}
              />
            </>
          )}
        </div>
      </div>
    );
  }
