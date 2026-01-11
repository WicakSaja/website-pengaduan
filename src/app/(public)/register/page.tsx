"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

const labelStyle = "block mb-2 text-sm font-medium text-[#0060A9]";
const inputStyle =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";

const dusunList = ["Junrejo", "Tlekung", "Krajan"];
const rtList = ["01", "02", "03"];
const rwList = ["01", "02", "05"];

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    nik: "",
    no_hp: "",
    username: "",
    password: "",
    dusun: "",
    rt: "",
    rw: "",
    alamatDetail: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Gabungkan lokasi
    const alamat = `Dusun ${formData.dusun}, RT ${formData.rt}, RW ${formData.rw}, ${formData.alamatDetail}`;

    // Payload sesuai yang diterima backend
    const payload = {
      nama_lengkap: formData.nama_lengkap,
      nik: formData.nik,
      no_hp: formData.no_hp,
      alamat,
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil 🎉",
          text: "Anda akan diarahkan ke halaman login.",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => router.push("/login"), 2000);
      } else {
        const message = result?.errors?.[0]?.msg || result?.message;
        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal!",
          text: message || "Silakan cek data yang dimasukkan.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Tidak dapat terhubung ke server.",
      });
      console.error("🚨 Register error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center text-gray-800 py-12"
      style={{ backgroundImage: "url('/hero-bg.png')" }}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/10"></div>

      <main className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl mt-24">
        <form onSubmit={handleSubmit}>
          <h1 className="mb-1 text-center text-2xl font-bold text-[#0060A9]">
            DAFTAR
          </h1>
          <p className="text-center text-sm mb-8">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#0060A9] font-semibold">
              MASUK
            </Link>
          </p>

          {/* Nama Lengkap */}
          <div className="mb-4">
            <label className={labelStyle}>Nama Lengkap*</label>
            <input
              type="text"
              name="nama_lengkap"
              className={inputStyle}
              placeholder="Nama Lengkap"
              required
              value={formData.nama_lengkap}
              onChange={handleChange}
            />
          </div>

          {/* NIK */}
          <div className="mb-4">
            <label className={labelStyle}>NIK (16 digit)*</label>
            <input
              type="text"
              name="nik"
              className={inputStyle}
              placeholder="Ex: 357XXXXXXX"
              required
              minLength={16}
              maxLength={16}
              value={formData.nik}
              onChange={handleChange}
            />
          </div>

          {/* No HP */}
          <div className="mb-4">
            <label className={labelStyle}>Nomor HP*</label>
            <input
              type="tel"
              name="no_hp"
              className={inputStyle}
              placeholder="Contoh: 0812345678"
              required
              value={formData.no_hp}
              onChange={handleChange}
            />
          </div>

          {/* Alamat */}
          <div className="mb-4">
            <label className={labelStyle}>Alamat*</label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <select
                name="dusun"
                className={inputStyle}
                required
                value={formData.dusun}
                onChange={handleChange}
              >
                <option value="">Dusun</option>
                {dusunList.map((dusun) => (
                  <option key={dusun} value={dusun}>
                    {dusun}
                  </option>
                ))}
              </select>

              <select
                name="rt"
                className={inputStyle}
                required
                value={formData.rt}
                onChange={handleChange}
              >
                <option value="">RT</option>
                {rtList.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt}
                  </option>
                ))}
              </select>

              <select
                name="rw"
                className={inputStyle}
                required
                value={formData.rw}
                onChange={handleChange}
              >
                <option value="">RW</option>
                {rwList.map((rw) => (
                  <option key={rw} value={rw}>
                    {rw}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              name="alamatDetail"
              className={inputStyle}
              placeholder="Contoh: Jl. Cempaka No. 5"
              required
              value={formData.alamatDetail}
              onChange={handleChange}
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className={labelStyle}>Username*</label>
            <input
              type="text"
              name="username"
              className={inputStyle}
              placeholder="Username login"
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className={labelStyle}>Password*</label>
            <input
              type="password"
              name="password"
              className={inputStyle}
              placeholder="Minimal 8 karakter"
              minLength={8}
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[#0060A9] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004a80] disabled:bg-gray-400"
          >
            {isLoading ? "Mendaftarkan..." : "DAFTAR"}
          </button>
        </form>
      </main>
    </div>
  );
}
    