// src/app/admin/login/page.tsx
"use client"; // 1. Ubah jadi Client Component

import Link from 'next/link';
import { useState } from 'react'; // 2. Import useState
import { useRouter } from 'next/navigation';

// --- Base URL API Anda ---
const API_BASE_URL = 'http://localhost:5000'; // 3. Base URL Backend

// Style reusable
const labelStyle = "block text-xs font-medium text-gray-500 mb-1 ml-4";
const inputStyle = "w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900";

export default function AdminLoginPage() {
  const router = useRouter();

  // 4. State untuk form, loading, dan error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 5. Fungsi handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Panggil endpoint login
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.data && result.data.user) {
        // --- 6. CEK ROLE ---
        const userRole = result.data.user.role;
        if (userRole === 'admin' || userRole === 'master_admin') { // Sesuaikan 'master_admin' jika nama role beda
          // --- 7. SUKSES (Admin / Master Admin) ---
          // Simpan token & user (sementara di localStorage, bisa dipisah nanti)
          localStorage.setItem('adminToken', result.data.token); 
          localStorage.setItem('adminUser', JSON.stringify(result.data.user));

          alert('Login Admin Berhasil!');
          router.push('/admin/dashboard'); // Arahkan ke dashboard admin
        } else {
          // Jika login berhasil tapi bukan admin/master
          setError('Akses ditolak. Anda bukan Admin.');
          // Mungkin logout paksa jika token user biasa terlanjur tersimpan
          localStorage.removeItem('token'); 
          localStorage.removeItem('user');
        }
      } else {
        // GAGAL LOGIN
        setError(result.message || 'Login gagal. Periksa email dan password.');
      }
    } catch (err) {
      // GAGAL KONEKSI
      setError('Tidak dapat terhubung ke server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wrapper utama (Desain disamakan dengan login user)
    <section className="relative flex items-center justify-center min-h-screen">
      
      {/* Background Image (DENGAN BLUR) */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      ></div>
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Kartu Form */}
      <div className="relative z-10 w-full max-w-md p-6 mt-16">
        <form 
          className="bg-white p-8 md:p-10 rounded-2xl shadow-xl"
          onSubmit={handleSubmit} // 8. Hubungkan form
        >
          
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
            MASUK (Admin)
          </h1>
          <p className="text-center text-sm text-gray-600 mb-8">
            Silakan login untuk mengakses dashboard
          </p>

          <div className="space-y-5">
            {/* Field Email */}
            <div>
              <label htmlFor="email" className={labelStyle}>Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="email@admin.com" 
                className={inputStyle} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Field Password */}
            <div>
              <label htmlFor="password" className={labelStyle}>Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                className={inputStyle} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Tampilkan Error */}
            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition duration-300 mt-4 disabled:bg-gray-400"
              disabled={isLoading} 
            >
              {isLoading ? 'Loading...' : 'Masuk'}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}