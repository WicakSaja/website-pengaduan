"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Link from 'next/link';

interface AdminUser { id: number; nama: string; role: 'admin' | 'master_admin' | 'pimpinan'; }

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminRole, setAdminRole] = useState<string | null>(null);

    // Cek token & role
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userString = localStorage.getItem('adminUser');
        let role: string | null = null;
        if (userString) { try { role = (JSON.parse(userString) as AdminUser).role; } catch { role = null; } }
        
        if (!token) { 
            router.replace('/admin/login'); 
        } else { 
            setIsAuthenticated(true); 
            const formattedRole = role 
                ? role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'Admin';
            setAdminRole(formattedRole); 
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        router.replace('/admin/login');
    };

    if (isLoading) { return <div className="flex h-screen items-center justify-center text-[#005086] font-bold">Memuat...</div>; }

    if (isAuthenticated) {
        return (
            // UBAH 1: Flex-col agar Header di atas, Konten di bawah
            <div className="flex h-screen flex-col bg-gray-50">
           
                <header className="flex h-20 flex-shrink-0 items-center justify-between bg-[#005086] px-8 shadow-md z-30 relative">
                    
                    {/* LOGO */}
                    <div className="text-2xl font-extrabold tracking-wide">
                        <span className="text-sky-300">Lapor</span>
                        <span className="text-white italic">Pak</span>
                    </div>

                    {/* KANAN: ROLE & LOGOUT */}
                    <div className="flex items-center gap-4">
                            <div className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#005086] shadow-sm">
                            {adminRole}
                            </div>

                            <button
                            onClick={handleLogout}
                            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-[#005086] shadow-sm transition hover:bg-gray-100 hover:text-red-600"
                        >
                            Logout
                            </button>
                    </div>
                </header>

             
                <div className="flex flex-1 overflow-hidden">
                    
                    {/* Sidebar (Kiri) */}
                    <Sidebar /> 

                    {/* Main Content (Kanan) */}
                    <main className="flex-1 relative overflow-y-auto bg-gray-50 p-6 md:p-8">
                        
                        {/* Background Pattern */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gray-300 rounded-full opacity-40 mix-blend-multiply"></div>
                            <div className="absolute top-10 right-10 w-32 h-32 bg-red-200 rounded-full opacity-50 mix-blend-multiply"></div>
                            <div className="absolute top-1/3 right-0 w-24 h-48 bg-blue-200 rounded-l-full opacity-40 mix-blend-multiply"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100 rounded-tr-full opacity-50 mix-blend-multiply"></div>
                            <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-gray-300 rounded-full opacity-50"></div>
                        </div>

                        {/* Konten Halaman */}
                        <div className="relative z-10">
                            {children}
                        </div>

                    </main>
                </div>
            </div>
        );
    }

    return null;
}