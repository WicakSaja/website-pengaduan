"use client"; 

import { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Pastikan semua ikon yang dibutuhkan diimpor
import { faBullhorn, faClock, faCheckCircle, faTimesCircle, faUserShield, faUsers } from '@fortawesome/free-solid-svg-icons'; 

const API_BASE_URL = 'http://localhost:5000'; 

// Tipe data (tetap sama)
interface AdminUser { id: number; nama: string; role: 'admin' | 'master_admin'; }
interface StatistikLaporan { total?: number; pending?: number; proses?: number; selesai?: number; ditolak?: number; }
interface StatistikSistem { total_users?: number; total_pengaduan?: number; active_admins?: number; }

export default function AdminDashboardPage() {
  const router = useRouter();
  const [statsLaporan, setStatsLaporan] = useState<StatistikLaporan | null>(null);
  const [statsSistem, setStatsSistem] = useState<StatistikSistem | null>(null);
  const [userRole, setUserRole] = useState<AdminUser['role'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data (logika tetap sama)
  useEffect(() => {
    // ... (Kode fetch data Anda yang sudah ada, memastikan userRole di-set) ...
     const fetchData = async () => { setIsLoading(true); setError(null); const token = localStorage.getItem('adminToken'); const userString = localStorage.getItem('adminUser'); if (!token || !userString) { /*... redirect ...*/ setIsLoading(false); return; } let role: AdminUser['role'] | null = null; try { const userData: AdminUser = JSON.parse(userString); role = userData.role; setUserRole(role); } catch (e) { /*... handle error, redirect ...*/ setIsLoading(false); return; } try { const resLaporan = await fetch(`${API_BASE_URL}/api/dashboard/statistik-laporan`, { headers: { 'Authorization': `Bearer ${token}` } }); if(!resLaporan.ok) throw new Error('Gagal ambil stats laporan'); const dataLaporan = await resLaporan.json(); if (dataLaporan.success) { setStatsLaporan(dataLaporan.data); } else { throw new Error(dataLaporan.message || 'Gagal stats laporan'); } if (role === 'master_admin') { const resSistem = await fetch(`${API_BASE_URL}/api/master/dashboard/statistik-sistem`, { headers: { 'Authorization': `Bearer ${token}` } }); if(!resSistem.ok) throw new Error('Gagal ambil stats sistem'); const dataSistem = await resSistem.json(); if (dataSistem.success) { setStatsSistem(dataSistem.data); } else { console.error(dataSistem.message || 'Gagal stats sistem'); } } } catch (err: any) { setError(err.message || 'Server error.'); console.error(err); if (err.message.includes('Unauthorized')) { /*... handle logout ...*/ } } finally { setIsLoading(false); } }; fetchData();
  }, [router]);

  // Render Logic
  if (isLoading) { return <p>Loading data statistik...</p>; }
  if (error) { return <p className="text-red-600">Error: {error}</p>; }

  // === PERUBAHAN UTAMA: LAYOUT GRID DINAMIS ===
  // Tentukan kelas grid berdasarkan role
  const gridColsClass = userRole === 'master_admin' 
      ? 'grid-cols-1 gap-6 md:grid-cols-3' // 3 kolom untuk Master Admin
      : 'grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'; // 4 kolom (atau 2) untuk Admin biasa

  return (
    <div>
      {/* Grid Statistik (kelas dinamis) */}
      <div className={`grid ${gridColsClass}`}> 
        
        {/* Kartu Umum (Tampil untuk semua admin) */}
        <StatCard 
          title="Total Pengaduan" 
          value={statsLaporan?.total ?? 0} 
          icon={<FontAwesomeIcon icon={faBullhorn} />} 
        />
         <StatCard 
          title="Pengaduan Selesai" 
          value={statsLaporan?.selesai ?? 0} 
          icon={<FontAwesomeIcon icon={faCheckCircle} />} 
        />
        {/* Urutan kartu di Master Admin berbeda, kita ikuti desain Master Admin */}
         {userRole === 'master_admin' && statsSistem && (
            <StatCard 
                title="Total Pengguna Aktif" 
                value={statsSistem.total_users ?? 0} 
                icon={<FontAwesomeIcon icon={faUsers} />} 
            />
         )}

        <StatCard 
          title="Pengaduan Diproses" 
          value={statsLaporan?.proses ?? 0} 
          icon={<FontAwesomeIcon icon={faClock} />} 
        />
        <StatCard 
          title="Pengaduan Ditolak" 
          value={statsLaporan?.ditolak ?? 0} 
          icon={<FontAwesomeIcon icon={faTimesCircle} />} 
        />
        
        {/* Kartu Khusus Master Admin */}
        {userRole === 'master_admin' && statsSistem && (
            <StatCard 
                title="Total Admin" 
                value={statsSistem.active_admins ?? 0} 
                icon={<FontAwesomeIcon icon={faUserShield} />} 
            />
        )}

         {/* Jika Admin biasa & ingin 4 kolom, kartu Selesai & Ditolak bisa dipindah ke sini */}
         {userRole === 'admin' && (
             <>
                 {/* <StatCard title="Pengaduan Selesai" ... /> */}
                 {/* <StatCard title="Pengaduan Ditolak" ... /> */}
             </>
         )}
      </div>
    </div>
  );
}