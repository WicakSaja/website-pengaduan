// src/app/layout.tsx  <-- (LANGSUNG DI DALAM APP)
import type { Metadata } from 'next';
import './globals.css'; // Pastikan path ini benar

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
      {/* Body ini HARUS KOSONG agar tidak tumpang tindih */}
      <body>{children}</body>
    </html>
  );
}