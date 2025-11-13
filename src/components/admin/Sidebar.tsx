// src/components/admin/Sidebar.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import ikon Font Awesome yang sesuai
import { faThLarge, faFileAlt, faTags, faUsersCog, faUserShield, faChartLine, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface AdminUser { id: number; nama: string; role: 'admin' | 'master_admin'; }

// Komponen Link Sidebar Helper
const SidebarLink = ({ href, icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) => (
    <li>
        <Link
            href={href}
            // Style link: abu muda, hover biru tua+putih. Jika aktif: biru tua+putih
            className={`flex items-center rounded-lg p-3 font-medium text-blue-100 transition duration-300 ease-in-out hover:bg-[#0060A9] hover:text-white ${isActive ? 'bg-[#0060A9] text-white font-semibold' : ''}`}
            aria-current={isActive ? 'page' : undefined}
        >
            <FontAwesomeIcon icon={icon} className="mr-3 w-5 text-center text-lg" /> {/* Teks ikon biru muda */}
            <span>{label}</span>
        </Link>
    </li>
);


const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini
    const [userRole, setUserRole] = useState<AdminUser['role'] | null>(null);

    // Baca role dari localStorage
    useEffect(() => {
        const adminUserString = localStorage.getItem('adminUser');
        if (adminUserString) {
            try {
                const adminUserData: AdminUser = JSON.parse(adminUserString);
                setUserRole(adminUserData.role);
            } catch (error) { console.error("Gagal parse admin user:", error); handleLogout(); }
        }
    }, []);

    // Fungsi Logout
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        // Panggil API logout jika perlu
        router.replace('/admin/login');
    };

    // Jangan render jika role belum siap (opsional)
    // if (!userRole) return <aside className="h-screen w-64 flex-shrink-0 bg-[#007BCC]"></aside>;

    return (
        // Sidebar: Background biru muda, lebar tetap
        <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-[#007BCC] p-4 text-white">
            {/* Logo tidak ada di desain ini, hanya menu */}

            {/* Navigasi */}
            <nav className="flex-1">
                <ul className="space-y-2">
                    {/* Gunakan Komponen SidebarLink */}
                    <SidebarLink href="/admin/dashboard" icon={faThLarge} label="DASHBOARD" isActive={pathname === '/admin/dashboard'} />
                    <SidebarLink href="/admin/laporan" icon={faFileAlt} label="DATA PENGADUAN" isActive={pathname.startsWith('/admin/laporan')} />
                    <SidebarLink href="/admin/kategori" icon={faTags} label="DATA KATEGORI" isActive={pathname.startsWith('/admin/kategori')} />

                    {/* Menu Khusus Master Admin */}
                    {userRole === 'master_admin' && (
                        <>
                            <SidebarLink href="/admin/kelola-pengguna" icon={faUsersCog} label="KELOLA PENGGUNA" isActive={pathname.startsWith('/admin/kelola-pengguna')} />
                            <SidebarLink href="/admin/kelola-admin" icon={faUserShield} label="KELOLA ADMIN" isActive={pathname.startsWith('/admin/kelola-admin')} />
                            <SidebarLink href="/admin/statistik" icon={faChartLine} label="STATISTIK" isActive={pathname === '/admin/statistik'} />
                        </>
                    )}
                </ul>
            </nav>

            {/* Tombol Logout tidak ada di sidebar desain ini, dipindah ke header */}
        </aside>
    );
};

export default Sidebar;