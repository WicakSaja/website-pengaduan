"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Style Reusable
const labelStyle = "block mb-1 text-sm font-medium text-[#0060A9]";
const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9] bg-white"; // Tambah bg-white
const buttonBlueCapsule = "rounded-full bg-[#0060A9] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400";

export default function TambahAdminPage() {
    const router = useRouter();

    // State Form
    const [namaLengkap, setNamaLengkap] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('admin'); // Default role

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('adminToken');
        if (!token) { 
            router.push('/admin/login'); 
            return; 
        }

        // Data disesuaikan dengan Backend (admin.js)
        const formData = {
            nama_lengkap: namaLengkap, // Backend butuh 'nama_lengkap'
            username: username,       // Backend butuh 'username'
            password: password,
            role: role                // Backend butuh 'role'
        };

        try {
            // Panggil endpoint yang benar: /api/admin/admins
            const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Gagal menambahkan admin`);
            }

            if (result.success) {
                alert('Admin baru berhasil ditambahkan!');
                router.push('/admin/kelola-admin');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan server.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-8">
             {/* Header agar seragam dengan halaman lain */}
             <h1 className="text-2xl font-bold text-[#004A80] mb-6 text-center">
                Tambah Admin Baru
            </h1>

            {/* Kartu Form */}
            <div className="max-w-xl mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-lg md:p-8">
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                    
                    {/* Field Nama Lengkap */}
                    <div>
                        <label htmlFor="nama_lengkap" className={labelStyle}>Nama Lengkap</label>
                        <input
                            type="text"
                            id="nama_lengkap"
                            className={inputStyle}
                            placeholder="Contoh: Budi Santoso"
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            required
                        />
                    </div>

                    {/* Field Username */}
                    <div>
                        <label htmlFor="username" className={labelStyle}>Username</label>
                        <input
                            type="text"
                            id="username"
                            className={inputStyle}
                            placeholder="Username untuk login"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Field Password */}
                    <div>
                        <label htmlFor="password" className={labelStyle}>Password</label>
                        <input
                            type="password"
                            id="password"
                            className={inputStyle}
                            placeholder="Minimal 6 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Field Role (PENTING) */}
                    <div>
                        <label htmlFor="role" className={labelStyle}>Role (Peran)</label>
                        <select
                            id="role"
                            className={inputStyle}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin (Verifikator)</option>
                            <option value="pimpinan">Pimpinan (Penyetuju)</option>
                            <option value="master_admin">Master Admin</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            *Pimpinan berhak menyetujui aduan agar &quot;Dilaksanakan&quot;.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    {/* Tombol Aksi */}
                    <div className="pt-4 flex gap-3 justify-end">
                        <Link href="/admin/kelola-admin">
                            <button type="button" className="rounded-full bg-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-300 transition">
                                Batal
                            </button>
                        </Link>
                        
                        <button
                            type="submit"
                            className={buttonBlueCapsule}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}