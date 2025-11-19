// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

// ==========================================================
// 1. IMPOR FONT 'INTER' DI SINI
// ==========================================================
import { Inter } from 'next/font/google';

// 2. Inisialisasi font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LaporPak - Layanan Pengaduan Masyarakat',
  description: 'Website untuk pengaduan masyarakat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* ========================================================== */}
      {/* 3. TERAPKAN FONT KE <body> DAN GABUNGKAN CLASS-NYA */}
      {/* ========================================================== */}
      <body className={`${inter.className} antialiased bg-gray-50 relative min-h-screen overflow-x-hidden`}>
        
        {/* ================================================================= */}
        {/* 🎨 BACKGROUND GEOMETRIS (LEBIH KONTRAS/JELAS)                     */}
        {/* ================================================================= */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          
          {/* 1. Lingkaran Abu Besar (Kanan Atas) - Warna dipergelap ke gray-300 */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gray-300 rounded-full opacity-60 mix-blend-multiply"></div>
          
          {/* 2. Lingkaran Merah/Pink (Kanan Atas) - Warna dipergelap ke red-300 */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-red-300 rounded-full opacity-70 mix-blend-multiply"></div>
          
          {/* 3. Setengah Lingkaran Biru Muda (Kanan Tengah) - Ganti warna agar variatif */}
          <div className="absolute top-1/3 -right-12 w-28 h-56 bg-blue-200 rounded-l-full opacity-60 mix-blend-multiply"></div>
          
          {/* 4. Seperempat Lingkaran Pink (Kiri Bawah) - Warna dipergelap ke red-200 */}
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-200 rounded-tr-full opacity-60 mix-blend-multiply"></div>
          
          {/* 5. Lingkaran Abu Kecil (Bawah Tengah) - Opasitas dinaikkan */}
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gray-400 rounded-full opacity-50"></div>

          {/* 6. Segitiga/Kotak Abstrak (Kanan Bawah) - Warna dipergelap */}
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 opacity-40 rotate-12 rounded-xl mix-blend-multiply"></div>
          
          {/* 7. Elemen Tambahan (Kiri Atas) - Agar seimbang */}
          <div className="absolute top-20 left-[-50px] w-40 h-40 bg-gray-200 rounded-full opacity-60"></div>

        </div>
        {/* ================================================================= */}

        {/* Wrapper Konten agar berada di atas background */}
        <div className="relative z-10">
          {/* Semua konten halaman */}
          {children}
        </div>

        {/* Toaster untuk notifikasi global */}
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: '#4CAF50',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#4CAF50',
              },
            },
            error: {
              style: {
                background: '#f44336',
                color: '#fff',
                fontWeight: '600',
                borderRadius: '8px',
              },
            },
          }}
        />
      </body>
    </html>
  );
}