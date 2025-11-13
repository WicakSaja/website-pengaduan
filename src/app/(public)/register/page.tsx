"use client"; 

import Link from 'next/link';
import { useState } from 'react'; 
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000'; 

// Style reusable baru (dari login.html)
const labelStyle = "block mb-2 text-sm font-medium text-[#0060A9]"; // Label biru
const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]"; // Input rounded-lg

export default function RegisterPage() {
  const router = useRouter();

  // State
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nik, setNik] = useState('');
  const [telepon, setTelepon] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi handleSubmit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = {
      nama: nama,
      email: email,
      password: password,
      nik: nik || undefined, 
      telepon: telepon || undefined,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        alert('Registrasi berhasil! Silakan login.');
        router.push('/login'); 
      } else {
        setError(result.message || 'Registrasi gagal.');
      }
    } catch (err) {
      setError('Tidak dapat terhubung ke server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STRUKTUR JSX BARU (Adaptasi dari login.html) ---
  return (
    // Body Wrapper
    <div 
        className="flex min-h-screen items-center justify-center bg-cover bg-center text-gray-800 pt-20" // Opsional: padding top global
        style={{ backgroundImage: "url('/hero-bg.png')" }} // Sesuaikan nama file
    >
        {/* Efek Blur */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/10"></div> 

        {/* Garis Biru Atas (Opsional) */}
        {/* <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#007BCC] z-30"></div> */}
        
        {/* Kartu Register dengan Margin Atas */}
        <main className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl md:p-10 mt-24"> {/* <-- MARGIN ATAS DITAMBAHKAN DI SINI */}
            <form onSubmit={handleSubmit}>
                <h1 className="mb-8 text-center text-2xl font-bold text-[#0060A9]">
                    DAFTAR AKUN BARU
                </h1>
                
                {/* Field Nama Lengkap */}
                <div className="mb-4 text-left"> 
                    <label htmlFor="nama" className={labelStyle}>Nama Lengkap*</label>
                    <input 
                        type="text" id="nama" name="nama" 
                        className={inputStyle} 
                        value={nama} onChange={(e) => setNama(e.target.value)}
                        placeholder="Nama Lengkap Anda"
                        required 
                    />
                </div>
                
                {/* Field Email */}
                <div className="mb-4 text-left">
                    <label htmlFor="email" className={labelStyle}>Email*</label>
                    <input 
                        type="email" id="email" name="email" 
                        className={inputStyle} 
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@anda.com"
                        required 
                    />
                </div>
                
                {/* Field Password */}
                <div className="mb-4 text-left">
                    <label htmlFor="password" className={labelStyle}>Password*</label>
                    <input 
                        type="password" id="password" name="password" 
                        className={inputStyle} 
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        required 
                    />
                </div>

                {/* Field NIK (Opsional) */}
                <div className="mb-4 text-left">
                    <label htmlFor="nik" className={labelStyle}>NIK (Opsional)</label>
                    <input 
                        type="text" id="nik" name="nik" 
                        className={inputStyle} 
                        value={nik} onChange={(e) => setNik(e.target.value)}
                        placeholder="16 digit NIK Anda"
                    />
                </div>

                {/* Field Telepon (Opsional) */}
                <div className="mb-6 text-left"> 
                    <label htmlFor="telepon" className={labelStyle}>No. Telepon (Opsional)</label>
                    <input 
                        type="tel" id="telepon" name="telepon" 
                        className={inputStyle} 
                        value={telepon} onChange={(e) => setTelepon(e.target.value)}
                        placeholder="081234567890"
                    />
                </div>

                {/* Tampilkan Error */}
                {error && (
                  <div className="mb-4 text-center text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Tombol Submit */}
                <button 
                    type="submit" 
                    className="w-full rounded-full bg-[#0060A9] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    {isLoading ? 'Mendaftarkan...' : 'Daftar'}
                </button>

                 {/* Link ke Login */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="font-semibold text-[#0060A9] hover:underline">
                    Masuk di sini
                    </Link>
                </p>
            </form>
        </main>
    </div>
  );
}