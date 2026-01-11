"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

const labelStyle = "block mb-2 text-sm font-medium text-[#0060A9]";
const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.data.token, result.data.user);
        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
              max-w-lg w-full bg-white shadow-2xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-[#0060A9]`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="h-6 w-6 text-[#0060A9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-base font-bold text-[#004A80]">
                    Akses Diterima! 👋
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    Selamat datang, {username}. Anda akan dialihkan...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ), {
  
            position: 'top-center',
            duration: 1500, 
        });

        setTimeout(() => {
          toast.dismiss(); 
          router.push('/');
        }, 1500);

      } else {
        setError(result.message || 'Login gagal.');
        toast.error(result.message || 'Login gagal.', { position: 'top-center' });
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server.');
      toast.error(' Tidak dapat terhubung ke server.', { position: 'top-center' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Komponen untuk menampilkan pop up toast */}
      <Toaster />

      <div
        className="flex min-h-screen items-center justify-center bg-cover bg-center text-gray-800"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        <div className="absolute inset-0 backdrop-blur-md bg-black/10"></div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#007BCC] z-10"></div>

        <main className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl md:p-10">
          <form onSubmit={handleSubmit}>
            <h1 className="mb-8 text-center text-2xl font-bold text-[#0060A9]">
              MASUK
            </h1>

            {/* Username */}
            <div className="mb-6 text-left">
              <label htmlFor="username" className={labelStyle}>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={inputStyle}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6 text-left">
              <label htmlFor="password" className={labelStyle}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-center text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-full bg-[#0060A9] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Masuk'}
            </button>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-semibold text-[#0060A9] hover:underline">
                Daftar di sini
              </Link>
            </p>
          </form>
        </main>
      </div>
    </>
  );
}