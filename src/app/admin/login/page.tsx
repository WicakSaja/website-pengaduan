"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      setError("Login gagal. Periksa username & password.");
      return;
    }

    // FIX TERPENTING
    localStorage.setItem("adminToken", result.token);
    localStorage.setItem("adminUser", JSON.stringify(result.data));

    router.push("/admin/dashboard");

  } catch (err) {
    setError("Tidak dapat terhubung ke server.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* Background blur */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Box Login */}
      <div className="relative z-10 bg-white w-[350px] p-8 rounded-xl shadow-xl border border-gray-200">

        <h1 className="text-center text-xl font-bold mb-6 text-[#004A80]">
          LOGIN ADMIN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Masukkan username admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#0060A9]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-[#0060A9]"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0060A9] text-white py-2 rounded-md hover:bg-[#004A80] transition"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
