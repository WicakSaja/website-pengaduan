"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBars,
  faXmark,
  faChevronDown,
  faFileSignature,
  faSearch,
  faClockRotateLeft,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

// Fungsi Scroll Halus
const scrollToElement = (id: string) => {
  if (typeof window === 'undefined') return;
  
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const handleAnchorClick = (e: any, href: string) => {
    const targetId = href.split("#")[1];
    if (pathname === "/") {
      e.preventDefault();
      scrollToElement(targetId);
    } 
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      const isToggleClicked = document.querySelector(".mobile-menu-toggle")?.contains(target);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && !isToggleClicked) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = [
    { name: "Home", href: "/" },
    { name: "Lapor", href: "/#form-pengaduan", isAnchor: true },
    { name: "Lacak", href: "/lacak" },
  ];

  return (
    // Container Header dengan padding atas agar "mengapung"
    <header className="fixed top-0 w-full z-50 pt-6 px-4 transition-all">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-4">
      
        <nav className="flex-1 bg-[#005086] rounded-full px-8 py-4 shadow-xl flex items-center justify-between relative z-20">
          
        {/* LOGO */}
          <Link href="/" className="text-2xl font-extrabold tracking-wide">
            {/* Lapor: Biru Muda & Tidak Miring */}
            <span className="text-sky-300 not-italic">Lapor</span>
            
            {/* Pak: Putih & Miring */}
            <span className="text-white italic">Pak</span>
          </Link>

          {/* MENU DESKTOP (Tengah) */}
          <ul className="hidden md:flex items-center gap-10 mx-auto absolute left-1/2 transform -translate-x-1/2">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={link.isAnchor ? (e) => handleAnchorClick(e, link.href) : undefined}
                  className="text-white text-base font-medium hover:text-blue-200 transition duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* HAMBURGER (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-toggle md:hidden p-2 text-white hover:bg-white/10 rounded-full transition"
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="h-6 w-6" />
          </button>
        </nav>

        <div 
          className="hidden md:flex bg-[#005086] rounded-full px-3 py-3 shadow-xl items-center justify-center min-w-[80px] relative z-20" 
          ref={dropdownRef}
        >
          {user ? (
            // --- JIKA SUDAH LOGIN ---
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition duration-300"
              >
                {/* Ikon User Sederhana (Seperti di gambar) */}
                <FontAwesomeIcon icon={faUser} className="text-lg" />
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-14 w-56 rounded-xl bg-white shadow-2xl ring-1 ring-black/5 animate-fadeIn overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Akun</p>
                    <p className="text-sm font-bold text-[#005086] truncate">
                      {user.nama || user.nama_lengkap || "Pengguna"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link href="/riwayat" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005086] transition">
                      <FontAwesomeIcon icon={faClockRotateLeft} className="w-4 h-4 mr-3 opacity-70" />
                      Riwayat
                    </Link>
                    
                    <div className="border-t border-gray-100 my-1"></div>

                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                      <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3 opacity-70" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // --- JIKA BELUM LOGIN ---
            <Link href="/login" className="px-4 py-1 text-sm font-bold text-white hover:text-blue-200 transition whitespace-nowrap">
              Masuk
            </Link>
          )}
        </div>

      </div>

      <div
        ref={mobileMenuRef}
        className={`md:hidden absolute top-full left-0 w-full px-4 mt-2 transition-all duration-300 transform origin-top ${
          isMobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#005086] rounded-2xl shadow-xl p-4 text-white space-y-2 border border-white/10">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={link.isAnchor ? (e) => handleAnchorClick(e, link.href) : undefined}
              className="block px-4 py-3 rounded-xl hover:bg-white/10 font-medium transition"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="border-t border-white/20 my-2"></div>

          {user ? (
            <>
              <Link href="/riwayat" className="block px-4 py-3 rounded-xl hover:bg-white/10 font-medium">
                <FontAwesomeIcon icon={faClockRotateLeft} className="mr-2" /> Riwayat Saya
              </Link>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-200 font-medium">
                 Logout
              </button>
            </>
          ) : (
             <Link href="/login" className="block px-4 py-3 rounded-xl bg-white text-[#005086] font-bold text-center shadow-md">
                Masuk / Daftar
             </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;