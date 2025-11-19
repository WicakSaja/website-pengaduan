// src/components/admin/Sidebar.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faThLarge, 
    faFileAlt, 
    faTags, 
    faUsersCog, 
    faUserShield, 
    faChartLine, 
    faBullhorn 
} from '@fortawesome/free-solid-svg-icons';

interface AdminUser { id: number; nama: string; role: 'admin' | 'master_admin'| 'pimpinan'; }

// Komponen Link Sidebar Helper
const SidebarLink = ({ href, icon, label, isActive }: { href: string; icon: any; label: string; isActive: boolean }) => (
    <li>
        <Link
            href={href}
            className={`flex items-center rounded-lg p-3 font-medium transition-all duration-300 ease-in-out 
            ${isActive 
                ? 'bg-white text-[#0096FF] font-bold shadow-md scale-105' // Aktif: Putih, Teks Biru Cerah
                : 'text-white hover:bg-white/20 hover:text-white' // Non-Aktif: Putih, Hover Transparan
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            <FontAwesomeIcon icon={icon} className="mr-3 w-5 text-center text-lg" />
            <span>{label}</span>
        </Link>
    </li>
);

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<AdminUser['role'] | null>(null);

    useEffect(() => {
        const adminUserString = localStorage.getItem('adminUser');
        if (adminUserString) {
            try {
                const adminUserData: AdminUser = JSON.parse(adminUserString);
                setUserRole(adminUserData.role);
            } catch (error) { console.error("Gagal parse admin user:", error); handleLogout(); }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.replace('/admin/login');
    };

    return (
        // UBAH DI SINI: Ganti bg-[#005086] menjadi bg-[#0096FF] (Biru Cerah)
        <aside className="flex h-full w-64 flex-shrink-0 flex-col bg-[#0096FF] p-4 text-white shadow-xl z-20">
            
            {/* Navigasi */}
            <nav className="flex-1 mt-4"> 
                <ul className="space-y-2">
                    
                    <SidebarLink href="/admin/dashboard" icon={faThLarge} label="DASHBOARD" isActive={pathname === '/admin/dashboard'} />
                    
                    <SidebarLink href="/admin/laporan" icon={faFileAlt} label="DATA PENGADUAN" isActive={pathname.startsWith('/admin/laporan')} />
                    
                    <SidebarLink href="/admin/pengumuman" icon={faBullhorn} label="KELOLA PENGUMUMAN" isActive={pathname.startsWith('/admin/pengumuman')} />
                    
                    <SidebarLink href="/admin/kategori" icon={faTags} label="DATA KATEGORI" isActive={pathname.startsWith('/admin/kategori')} />

                    {/* Menu Khusus Master Admin */}
                    {userRole === 'master_admin' && (
                        <>
                            <div className="my-4 border-t border-white/30"></div>
                            <p className="px-3 text-xs font-bold text-blue-100 mb-2 uppercase tracking-wider opacity-80">Master Menu</p>
                            
                            <SidebarLink href="/admin/kelola-pengguna" icon={faUsersCog} label="KELOLA PENGGUNA" isActive={pathname.startsWith('/admin/kelola-pengguna')} />
                            
                            <SidebarLink href="/admin/kelola-admin" icon={faUserShield} label="KELOLA ADMIN" isActive={pathname.startsWith('/admin/kelola-admin')} />
                            
                            <SidebarLink href="/admin/statistik" icon={faChartLine} label="STATISTIK" isActive={pathname === '/admin/statistik'} />
                        </>
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;