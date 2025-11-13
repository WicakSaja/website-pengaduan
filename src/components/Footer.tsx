// src/components/Footer.tsx
import Link from 'next/link';

const Footer = () => {
  return (
    // Section Footer (sesuai .main-footer)
    <footer className="bg-[#004a80] px-4 py-10 text-[#d0d0d0] md:px-8 md:py-16"> {/* Warna biru tua, padding, warna teks */}
      {/* Kontainer (sesuai .footer-container) */}
      <div className="container mx-auto max-w-6xl"> {/* max-w-6xl ~ 1200px */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start"> {/* Flexbox untuk layout */}
          
          {/* Info Kiri (sesuai .footer-info) */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl"> {/* Ukuran font & warna logo */}
              LaporPak
            </h3>
            <p className="mb-1 text-sm font-light md:text-base">Kecamatan Jumo</p> {/* Font lebih tipis */}
            <p className="mb-1 text-sm font-light md:text-base">Telp: (123) 456-7890</p>
            <p className="mb-1 text-sm font-light md:text-base">Fax: (123) 456-7891</p>
            <p className="text-sm font-light md:text-base">Email: info@laporpak.go.id</p>
          </div>

          {/* Kolom Kanan (Bisa ditambahkan Link Navigasi jika perlu) */}
          {/* <div className="text-center md:text-right">
            <h4 className="mb-4 text-lg font-semibold text-white">Tautan Cepat</h4>
            <Link href="/" className="mb-2 block text-sm hover:text-white">Beranda</Link>
            <Link href="/#lapor" className="mb-2 block text-sm hover:text-white">Lapor</Link>
            <Link href="/#lacak" className="block text-sm hover:text-white">Lacak</Link>
          </div> */}

        </div>

        {/* Copyright (sesuai .footer-copyright) */}
        <div className="mt-8 border-t border-[#005A9C] pt-6 text-center text-xs text-[#a0a0a0] md:mt-12 md:pt-8 md:text-sm"> {/* Border biru lebih muda, warna teks lebih pudar */}
          © 2025 Capstone Kelompok 7
        </div>
      </div>
    </footer>
  );
};

export default Footer;