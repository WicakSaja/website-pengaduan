"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:5000";

const labelStyle = "block mb-2 text-sm font-medium text-[#0060A9]";
const inputStyle =
  "w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]";

const dusunList = ["Junrejo", "Tlekung", "Krajan"];
const rtList = ["01", "02", "03"];
const rwList = ["01", "02", "05"];

export default function RegisterPage() {
  const router = useRouter();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [nik, setNik] = useState("");
  const [noHp, setNoHp] = useState("");
  const [dusun, setDusun] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [alamatDetail, setAlamatDetail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const alamatGabungan = `Dusun ${dusun}, RT ${rt}, RW ${rw}, ${alamatDetail}`;

    const formData = {
      nama_lengkap: namaLengkap,
      nik,
      no_hp: noHp,
      alamat: alamatGabungan,
      username,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil 🎉",
          text: "Anda akan diarahkan ke halaman login...",
          showConfirmButton: false,
          timer: 2000,
        });

        router.push("/login");
      } else {
        const message =
          result?.errors?.[0]?.msg || result?.message || "Registrasi gagal.";

        setError(message);

        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal!",
          text: message,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server.");

      Swal.fire({
        icon: "error",
        title: "Koneksi Error!",
        text: "Tidak dapat terhubung ke server.",
      });
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

      <main className="z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl md:p-10 mt-24">
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

          {/* NAMA */}
          <div className="mb-4">
            <label className={labelStyle}>Nama Lengkap*</label>
            <input
              type="text"
              className={inputStyle}
              placeholder="Nama Lengkap"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
            />
          </div>

          {/* NIK */}
          <div className="mb-4">
            <label className={labelStyle}>NIK*</label>
            <input
              type="text"
              className={inputStyle}
              placeholder="16 digit NIK"
              minLength={16}
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              required
            />
          </div>

          {/* NO HP */}
          <div className="mb-4">
            <label className={labelStyle}>Nomor Telepon*</label>
            <input
              type="tel"
              className={inputStyle}
              placeholder="Ex: 081234567890"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              required
            />
          </div>

          {/* ALAMAT DROPDOWN */}
          <div className="mb-4">
            <label className={labelStyle}>Alamat*</label>
            <div className="grid grid-cols-3 gap-3 mb-3">

              <select
                className={inputStyle}
                value={dusun}
                onChange={(e) => setDusun(e.target.value)}
                required
              >
                <option value="">Dusun</option>
                {dusunList.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                className={inputStyle}
                value={rt}
                onChange={(e) => setRt(e.target.value)}
                required
              >
                <option value="">RT</option>
                {rtList.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                className={inputStyle}
                value={rw}
                onChange={(e) => setRw(e.target.value)}
                required
              >
                <option value="">RW</option>
                {rwList.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* DETAIL ALAMAT */}
            <input
              type="text"
              className={inputStyle}
              placeholder="Contoh: Jl. Cempaka No. 15"
              value={alamatDetail}
              onChange={(e) => setAlamatDetail(e.target.value)}
              required
            />
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <label className={labelStyle}>Username*</label>
            <input
              type="text"
              className={inputStyle}
              placeholder="Username login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className={labelStyle}>Password*</label>
            <input
              type="password"
              className={inputStyle}
              placeholder="Minimal 8 karakter"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-center text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* BUTTON */}
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
