// src/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react'; // Import useState, useEffect, useRef

// Font Awesome (perlu diinstal)
// npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Ikon user

const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk dropdown
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref untuk deteksi klik di luar

    const handleLogout = () => {
        setIsDropdownOpen(false); // Tutup dropdown
        logout();
        router.push('/');
    };

    // Fungsi untuk menutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        // Tambahkan event listener saat dropdown terbuka
        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Hapus event listener saat dropdown tertutup
            document.removeEventListener("mousedown", handleClickOutside);
        }
        // Cleanup listener saat komponen unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]); // Efek ini bergantung pada state isDropdownOpen

    return (
        <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="container mx-auto max-w-5xl">
                <nav className="relative flex items-center justify-between rounded-full bg-[#0060A9] px-6 py-3 text-white shadow-lg md:px-8 md:py-4"> {/* Tambah relative */}

                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold md:text-2xl">LaporPak</Link>

                    {/* Navigasi Tengah */}
                    <ul className="hidden items-center space-x-8 md:flex">
                        <li><Link href="/" className="opacity-90 hover:opacity-100">Home</Link></li>
                        <li><Link href="/lapor" className="opacity-90 hover:opacity-100">Lapor</Link></li>
                        <li><Link href="/lacak" className="opacity-90 hover:opacity-100">Lacak</Link></li>
                    </ul>

                    {/* Tombol Auth Kanan / Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}> {/* Wrapper relative untuk dropdown */}
                        {user ? (
                            // JIKA SUDAH LOGIN: Tombol Ikon Profil
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#0060A9] transition hover:bg-gray-200 md:h-10 md:w-10"
                                aria-label="User Profile"
                            >
                                <FontAwesomeIcon icon={faUser} />
                            </button>
                        ) : (
                            // JIKA BELUM LOGIN: Tombol Masuk & Daftar
                            <div className="flex items-center space-x-3 md:space-x-4">
                                <Link href="/login" className="rounded-full px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/20 md:px-5 md:py-2 md:text-sm">
                                    Masuk
                                </Link>
                                <Link href="/register" className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#0060A9] transition hover:bg-gray-200 md:px-5 md:py-2 md:text-sm">
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* Dropdown Menu (Muncul jika isDropdownOpen true) */}
                        {isDropdownOpen && user && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#004a80] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"> {/* Background biru tua */}
                                <div className="px-4 py-3">
                                    <p className="text-sm font-medium text-white">User Profile</p>
                                    <p className="truncate text-xs text-gray-300">{user.nama}</p> {/* Tampilkan nama */}
                                </div>
                                <div className="py-1">
                                    <Link
                                        href="/riwayat" // Link ke halaman riwayat
                                        onClick={() => setIsDropdownOpen(false)} // Tutup dropdown saat klik
                                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9] hover:text-white" // Style hover
                                    >
                                        Riwayat Pengaduan
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-[#0060A9] hover:text-white" // Style hover
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;