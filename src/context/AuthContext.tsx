// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipe data untuk user (sesuai API Anda)
interface User {
  nama_lengkap: string;
  id: number;
  nama: string;
  role: 'masyarakat' | 'admin' | 'master_admin';
}

// Tipe data untuk Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Buat Context-nya
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat Provider (pembungkus)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Untuk cek localStorage

  // Cek localStorage saat aplikasi pertama kali dimuat
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Gagal memuat data auth", error);
    } finally {
      setIsLoading(false); // Selesai loading
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Nanti kita tambahkan pemanggilan API /api/auth/logout di sini
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {!isLoading && children} {/* Hanya render anak setelah selesai loading */}
    </AuthContext.Provider>
  );
};

// Buat hook custom agar gampang dipakai
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
};