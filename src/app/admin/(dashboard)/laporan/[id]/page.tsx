"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface LampiranItem {
  id: number;
  filePath: string;
}

interface UserInfo {
  nama_lengkap?: string;
  nik?: string;
}

interface KategoriInfo {
  nama_kategori?: string;
}

interface PengaduanDetail {
  id: number;
  judul?: string;
  deskripsi?: string;
  lokasi?: string;
  status: string;
  createdAt: string;
  user?: UserInfo;
  kategori?: KategoriInfo;
  lampiran: LampiranItem[];
}

// --- KOMPONEN MODAL KONFIRMASI ---
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "info" | "danger" | "success";
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmationModal = ({ isOpen, title, message, type, onClose, onConfirm, isLoading }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const colors = {
    info: "bg-[#0060A9] hover:bg-[#004a80]",
    success: "bg-green-600 hover:bg-green-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          
          <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>
        
        <div className="flex border-t border-gray-100 bg-gray-50 px-6 py-4 gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-1/2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-1/2 rounded-lg px-4 py-2 text-sm font-bold text-white transition shadow-md disabled:opacity-50 ${colors[type]}`}
          >
            {isLoading ? "Memproses..." : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HALAMAN UTAMA ---

export default function DetailPengaduanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<PengaduanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [loadingPdf, setLoadingPdf] = useState(false); 
  
  // State untuk Modal
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "info" | "danger" | "success",
    action: async () => {},
  });
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Ambil Data
  const fetchDetail = useCallback(async () => {
    const token = localStorage.getItem("adminToken");
    const userString = localStorage.getItem("adminUser");

    if (!token || !userString) return router.push("/admin/login");

    try {
      const userObj = JSON.parse(userString);
      setUserRole(userObj.role || "");
    } catch (e) {
      console.error("Gagal parsing user data");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setData(result.data as PengaduanDetail);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memuat detail pengaduan";
      console.error(err);
      alert(message);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

 
  const processVerifikasi = async (status: string) => {
    const token = localStorage.getItem("adminToken");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}/verifikasi`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);
      
      setModal(prev => ({ ...prev, isOpen: false })); // Tutup modal
      fetchDetail(); // Refresh data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal update status";
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  // API: Persetujuan
  const processPersetujuan = async () => {
    const token = localStorage.getItem("adminToken");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}/persetujuan`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setModal(prev => ({ ...prev, isOpen: false }));
      fetchDetail();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyetujui aduan";
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  // API: Selesai
  const processSelesai = async () => {
    const token = localStorage.getItem("adminToken");
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}/selesai`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setModal(prev => ({ ...prev, isOpen: false }));
      fetchDetail();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menutup aduan";
      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  // === HANDLER TOMBOL (Membuka Modal) ===

  const openVerifikasiModal = (status: string) => {
    setModal({
      isOpen: true,
      title: status === 'diterima' ? "Terima Pengaduan?" : "Tolak Pengaduan?",
      message: status === 'diterima' 
        ? "Aduan akan diteruskan ke Pimpinan untuk persetujuan." 
        : "Aduan akan ditolak dan tidak diproses lebih lanjut.",
      type: status === 'diterima' ? 'info' : 'danger',
      action: () => processVerifikasi(status)
    });
  };

  const openPersetujuanModal = () => {
    setModal({
      isOpen: true,
      title: "Setujui Pelaksanaan?",
      message: "Apakah Anda yakin menyetujui aduan ini untuk segera dilaksanakan oleh tim teknisi?",
      type: "success",
      action: () => processPersetujuan()
    });
  };

  const openSelesaiModal = () => {
    setModal({
      isOpen: true,
      title: "Tandai Selesai?",
      message: "Pastikan pekerjaan lapangan telah benar-benar selesai sebelum menutup aduan ini secara permanen.",
      type: "success",
      action: () => processSelesai()
    });
  };

  const handlePrintPDF = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    
    setLoadingPdf(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/pengaduan/${id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh PDF");
      }

      // Proses Blob untuk download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan-Pengaduan-${id}.pdf`; // Nama file saat didownload
      document.body.appendChild(a);
      a.click();
      a.remove(); // Bersihkan elemen
      window.URL.revokeObjectURL(url); // Bersihkan memori
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mencetak PDF";
      console.error(err);
      alert("Gagal mencetak PDF: " + message);
    } finally {
      setLoadingPdf(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Memuat data...</div>;
  if (!data) return <div className="text-center mt-20">Data tidak ditemukan</div>;

  return (
    <>
      {/* Komponen Modal */}
      <ConfirmationModal 
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        isLoading={actionLoading}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.action}
      />

      <div className="flex justify-center py-10 px-4">
        <div className="bg-white w-full max-w-3xl rounded-xl p-8 shadow-md border border-gray-200">
          
          {/* HEADER */}
          <h2 className="text-center text-xl font-bold text-[#004A80] mb-8">Detail Data Pengaduan</h2>

          {/* HEADER & DETAIL DATA */}
        <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-[#004A80]">
                Detail Data Pengaduan
             </h2>
             
             {/* Tombol Print */}
             <button
                onClick={handlePrintPDF}
                disabled={loadingPdf}
                className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold disabled:bg-gray-400"
             >
                {loadingPdf ? (
                   "Memproses..."
                ) : (
                   <>
                     {/* Ikon Print SVG */}
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 001.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                     </svg>
                     Cetak Laporan
                   </>
                )}
             </button>
        </div>

          {/* INFORMASI UTAMA */}
          <div className="space-y-5 text-sm">
            {[
              ["Id", data.id],
              ["Tanggal Lapor", new Date(data.createdAt).toLocaleDateString("id-ID")],
              ["NIK Pelapor", data.user?.nik || "-"],
              ["Nama Pelapor", data.user?.nama_lengkap || "-"],
              ["Kategori", data.kategori?.nama_kategori || "-"],
              ["Status Saat Ini", data.status],
              ["Judul Pengaduan", data.judul],
              ["Lokasi", data.lokasi],
            ].map(([label, value], index) => (
              <div key={index} className="border-b pb-3">
                <p className="font-semibold text-[#004A80]">{label}</p>
                <p className="mt-1 text-gray-700">{value}</p>
              </div>
            ))}

            {/* STATUS BADGE */}
            <div className="border-b pb-3">
              <p className="font-semibold text-[#004A80]">Status Saat Ini</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase
                ${data.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                ${data.status === "diterima" ? "bg-blue-100 text-blue-800" : ""}
                ${data.status === "diproses" ? "bg-indigo-100 text-indigo-800" : ""}
                ${data.status === "dilaksanakan" ? "bg-green-100 text-green-800" : ""}
                ${data.status === "selesai" ? "bg-gray-500 text-white" : ""}
                ${data.status === "ditolak" ? "bg-red-100 text-red-800" : ""}
              `}>
                {data.status}
              </span>
            </div>

            {/* DESKRIPSI */}
            <div className="border-b pb-3">
              <p className="font-semibold text-[#004A80]">Deskripsi</p>
              <p className="mt-1 text-gray-700 leading-relaxed whitespace-pre-line">{data.deskripsi}</p>
            </div>
          </div>

         {/* LAMPIRAN */}
<div className="border-b pb-3 mt-6">
  <p className="font-semibold text-[#004A80] mb-2">Lampiran</p>
  {data.lampiran && data.lampiran.length > 0 ? (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {data.lampiran.map((item, index) => {
        // 1. Bersihkan Path URL
        let cleanPath = item.filePath.replace(/\\/g, "/");
        if (!cleanPath.startsWith("/")) cleanPath = "/" + cleanPath;
        const fileUrl = `${API_BASE_URL}${cleanPath}`;

        // 2. Cek apakah ini Video
        const isVideo = cleanPath.match(/\.(mp4|mkv|webm|avi)$/i);

        // 3. Helper untuk MIME Type (agar browser mengenali formatnya)
        const getMimeType = (path: string) => {
          if (path.endsWith(".webm")) return "video/webm";
          if (path.endsWith(".mkv")) return "video/x-matroska";
          return "video/mp4";
        };

        return (
          <div
            key={item.id}
            className="block group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
          >
            {isVideo ? (
              // === JIKA VIDEO ===
              <video
                controls
                preload="metadata"
                className="w-full h-32 object-cover bg-black"
              >
                <source src={fileUrl} type={getMimeType(cleanPath)} />
                Browser tidak mendukung video.
              </video>
            ) : (
              // === JIKA GAMBAR ===
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <Image
                  src={fileUrl}
                  alt={`Lampiran-${index}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "https://via.placeholder.com/150?text=Gagal+Memuat";
                  }}
                />
                {/* Overlay Text untuk Gambar */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center pointer-events-none">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-xs bg-black/50 px-2 py-1 rounded">
                    Klik untuk memperbesar
                  </span>
                </div>
              </a>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-gray-500 text-sm italic">Tidak ada lampiran.</p>
  )}
</div>

          {/* AREA TOMBOL AKSI */}
          <div className="mt-10 text-center">
            <h3 className="font-semibold text-[#004A80] mb-4">Aksi Penanganan</h3>

            {/* --- 1. ADMIN: VERIFIKASI & SELESAI --- */}
            {(userRole === "admin" || userRole === "master_admin") && (
              <>
                {data.status === "pending" && (
                  <div className="mb-6 border-b pb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Verifikasi Awal</h4>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => openVerifikasiModal("diterima")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-md font-medium"
                      >
                        Terima Aduan
                      </button>
                      <button
                        onClick={() => openVerifikasiModal("ditolak")}
                        className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition shadow-md font-medium"
                      >
                        Tolak Aduan
                      </button>
                    </div>
                  </div>
                )}

                {data.status === "dilaksanakan" && (
                  <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-700 mb-2">Penutupan Aduan</h4>
                      <button
                          onClick={openSelesaiModal}
                          className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition shadow-lg font-bold"
                      >
                           Tandai SELESAI
                      </button>
                  </div>
                )}
              </>
            )}

            {/* --- 2. PIMPINAN: PERSETUJUAN --- */}
            {userRole === "pimpinan" && (data.status === "diterima" || data.status === "diproses") && (
              <div className="mb-8 border-b pb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Persetujuan Pelaksanaan</h4>
                <button
                  onClick={openPersetujuanModal}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition shadow-lg font-bold"
                >
                   Setujui Pelaksanaan
                </button>
              </div>
            )}

            {/* --- 3. STATUS FINAL --- */}
            {(data.status === "selesai" || data.status === "ditolak") && (
              <div className="mb-8 p-4 bg-gray-100 rounded-lg text-gray-600 italic border border-gray-200">
                Aduan ini sudah mencapai status final: <span className="font-bold uppercase">{data.status}</span>.
              </div>
            )}

            <button onClick={() => router.back()} className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition mt-4 text-sm font-medium">
              Kembali
            </button>
          </div>

        </div>
      </div>
    </>
  );
}