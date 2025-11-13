"use client"; 

import Link from 'next/link';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; 

const API_BASE_URL = 'http://localhost:5000'; 

// Style reusable baru (sesuaikan jika perlu)
const labelStyle = "block mb-2 text-sm font-medium text-[#0060A9]"; // Label biru
const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"; // Input rounded-lg

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); 

  // State (Tetap Sama)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi handleSubmit (Tetap Sama)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // API Anda pakai 'email'
      });
      const result = await response.json();
      if (result.success) {
        login(result.data.token, result.data.user);
        alert('Login Berhasil!');
        router.push('/'); 
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- STRUKTUR JSX BARU (SESUAI login.html) ---
  return (
    // Body Wrapper (Flexbox, Background Image)
    <div 
        className="flex min-h-screen items-center justify-center bg-cover bg-center text-gray-800"
        style={{ backgroundImage: "url('/hero-bg.png')" }} // Ganti nama file jika perlu
    >
        {/* Efek Blur (membutuhkan div terpisah atau ::before) */}
        {/* Cara termudah dengan Tailwind: backdrop-blur di div overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/10"></div> 

        {/* Garis Biru Atas */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#007BCC] z-10"></div>

        {/* Efek Fade Putih Bawah (Opsional, bisa di skip jika sulit) */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-white/70 via-white/50 to-transparent z-[1]"></div> */}
        
        {/* Kartu Login (z-index agar di atas blur & fade) */}
        <main className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl md:p-10">
            <form onSubmit={handleSubmit}>
                <h1 className="mb-8 text-center text-2xl font-bold text-[#0060A9]"> {/* Judul Biru */}
                    MASUK
                </h1>
                
                {/* Field Email (desain pakai Username, tapi API pakai Email) */}
                <div className="mb-6 text-left">
                    <label htmlFor="email" className={labelStyle}>Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className={inputStyle} 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@anda.com"
                        required 
                    />
                </div>
                
                {/* Field Password */}
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

                {/* Tampilkan Error */}
                {error && (
                  <div className="mb-4 text-center text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Tombol Submit (Bentuk Kapsul) */}
                <button 
                    type="submit" 
                    className="w-full rounded-full bg-[#0060A9] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Masuk'}
                </button>

                 {/* Link ke Register (Tambahan, tidak ada di HTML) */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link href="/register" className="font-semibold text-[#0060A9] hover:underline">
                    Daftar di sini
                    </Link>
                </p>
            </form>
        </main>
    </div>
  );
}