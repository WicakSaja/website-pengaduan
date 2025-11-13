// src/components/HeroSection.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
// Kita butuh useAuth lagi di sini untuk cek status login
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const router = useRouter();
  const { user } = useAuth(); // Ambil status user

  // Fungsi handle klik tombol Lapor/Masuk
  const handleActionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (user) {
      // JIKA SUDAH LOGIN: Scroll ke form pengaduan
      const targetElement = document.getElementById('form-pengaduan');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback jika ID tidak ditemukan (seharusnya tidak terjadi)
        router.push('/#form-pengaduan'); 
      }
    } else {
      // JIKA BELUM LOGIN: Arahkan ke halaman login
      router.push('/login');
    }
  };

  return (
    // Section utama, full height, background image
    <section className="relative flex min-h-screen items-center justify-center text-center text-white">
      
      {/* Background Image Wrapper */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.png')" }} // Pastikan nama file gambar benar
      ></div>

      {/* Overlay Gelap (sesuai index.html) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-transparent"></div>
      
      {/* Efek Fade Putih di Bawah (sesuai index.html body::after) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white/70 via-white/50 to-transparent"
        style={{ zIndex: 1 }} // Pastikan di atas overlay gelap jika perlu
      ></div>

      {/* Konten Utama (z-index agar di atas overlay & fade) */}
      <div className="relative z-10 p-4">
        {/* Subtitle (sesuai index.html .subtitle) */}
        <p className="mb-2 text-lg font-light md:text-xl">
          Website Pelayanan Pengaduan Masyarakat
        </p>
        
        {/* Judul Utama (sesuai index.html h1) */}
        <h1 className="mb-10 text-4xl font-medium leading-tight md:text-6xl" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          Selamat Datang<br />di <span className="font-bold">LaporPak</span>
        </h1>
        
        {/* Tombol Aksi (Gaya btn-masuk dari index.html) */}
        <button 
          onClick={handleActionClick}
          className="inline-block rounded-full bg-[#0060A9] px-10 py-3 text-base font-semibold text-white shadow-lg transition duration-300 ease-in-out hover:bg-[#004a80] hover:-translate-y-0.5 hover:shadow-xl md:px-14 md:py-4 md:text-lg"
        >
          {/* Teks tombol berubah tergantung status login */}
          {user ? 'Lapor Keluhan Anda' : 'Masuk untuk Melapor'} 
        </button>
      </div>
    </section>
  );
};

export default HeroSection;