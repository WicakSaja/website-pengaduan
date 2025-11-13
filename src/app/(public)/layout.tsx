import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css'; 
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer';

// 1. IMPORT AUTHPROVIDER
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id"> 
      <body className={inter.className}>
        {/* 2. BUNGKUS SEMUANYA DENGAN AUTHPROVIDER */}
        <AuthProvider>
          <Navbar /> 
          <main>{children}</main>
          <Footer /> 
        </AuthProvider>
      </body>
    </html>
  );
}