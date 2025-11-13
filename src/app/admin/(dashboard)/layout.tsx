"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Link from 'next/link';

// Hapus import FontAwesomeIcon jika tidak dipakai lagi di header
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

// Tipe data user admin
interface AdminUser { id: number; nama: string; role: 'admin' | 'master_admin'; }

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminRole, setAdminRole] = useState<string | null>(null);

    // Cek token & role (logika tetap sama)
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userString = localStorage.getItem('adminUser');
        let role: string | null = null;
        if (userString) { try { role = (JSON.parse(userString) as AdminUser).role; } catch { role = null; } }
        if (!token) { router.replace('/admin/login'); }
        else { setIsAuthenticated(true); setAdminRole(role); }
        setIsLoading(false);
    }, [router]);

    // Fungsi Logout (logika tetap sama)
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.replace('/admin/login');
    };

    if (isLoading) { return <div className="flex h-screen items-center justify-center">Memverifikasi akses...</div>; }

    if (isAuthenticated) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar /> {/* Sidebar biru muda */}

                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* === HEADER ATAS (STYLE BARU) === */}
                    <header className="flex h-16 flex-shrink-0 items-center justify-between bg-[#004a80] px-6 text-white shadow-md"> {/* bg biru tua */}
                        {/* Logo */}
                        <Link href="/admin/dashboard" className="text-xl font-bold">LaporPak</Link>

                        {/* Tombol Kanan (Style Kapsul Putih) */}
                        <div className="flex items-center gap-3"> {/* Kurangi gap jika perlu */}
                             {/* Tombol Role */}
                             <div className="rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-[#0060A9]"> {/* bg putih, teks biru */}
                                {adminRole === 'master_admin' ? 'Master Admin' : 'Admin'}
                             </div>
                             {/* Tombol Logout */}
                             <button
                                onClick={handleLogout}
                                className="rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-[#0060A9] transition hover:bg-gray-200" // bg putih, teks biru
                            >
                                Logout
                             </button>
                        </div>
                    </header>
                    {/* === AKHIR HEADER === */}


                    {/* Area Konten */}
                    <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
                        {children}
                    </main>
                </div>
            </div>
        );
    }

    return null;
}