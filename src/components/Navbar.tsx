"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        router.push("/");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="container mx-auto max-w-5xl">
                <nav className="flex items-center justify-between rounded-full bg-[#0060A9] px-6 py-3 text-white shadow-lg md:px-8 md:py-4">

                    {/* LOGO */}
                    <Link href="/" className="text-xl font-bold md:text-2xl">
                        LaporPak
                    </Link>

                    {/* MENU DESKTOP */}
                    <ul className="hidden md:flex items-center space-x-8">
                        <li>
                            <Link href="/" className="opacity-90 hover:opacity-100">
                                Home
                            </Link>
                        </li>

                        <li>
                            <a href="/#form-pengaduan" className="opacity-90 hover:opacity-100">
                                Lapor
                            </a>
                        </li>

                        <li>
                            <Link href="/lacak" className="opacity-90 hover:opacity-100">
                                Lacak
                            </Link>
                        </li>
                    </ul>

                    {/* PROFILE / LOGIN */}
                    <div className="relative" ref={dropdownRef}>
                        {user ? (
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-[#0060A9] hover:bg-gray-200 transition"
                            >
                                <FontAwesomeIcon icon={faUser} />
                            </button>
                        ) : (
                            <div className="flex items-center space-x-3 md:space-x-4">
                                <Link
                                    href="/login"
                                    className="rounded-full px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium text-white hover:bg-white/20 transition"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-white px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-[#0060A9] hover:bg-gray-200 transition"
                                >
                                    Daftar
                                </Link>
                            </div>
                        )}

                        {/* DROPDOWN USER */}
                        {isDropdownOpen && user && (
                            <div className="absolute right-0 mt-3 w-48 rounded-md bg-[#004A80] shadow-lg ring-1 ring-black ring-opacity-5 animate-fadeIn">
                                <div className="px-4 py-3 border-b border-blue-900">
                                    <p className="text-sm font-medium text-white">Profil</p>
                                    <p className="text-xs text-gray-300 truncate">{user.nama}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/riwayat"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9] hover:text-white transition"
                                    >
                                        Riwayat Pengaduan
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#0060A9] hover:text-white transition"
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
