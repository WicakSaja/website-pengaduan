"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:5000";

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

export default function DetailPengaduanPage({ params }: any) {
  const router = useRouter();
  const { id } = params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  
  // State untuk Modal
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info" as "info" | "danger" | "success",
    action: async () => {}, // Fungsi kosong default
  });
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Ambil Data
  const fetchDetail = async () => {
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

      setData(result.data);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat detail pengaduan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  // === LOGIKA API (Dipisahkan dari UI) ===

  // API: Verifikasi
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
    } catch (err: any) {
      alert(err.message || "Gagal update status");
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
    } catch (err: any) {
      alert(err.message || "Gagal menyetujui aduan");
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
    } catch (err: any) {
      alert(err.message || "Gagal menutup aduan");
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
                {data.lampiran.map((item: any, index: number) => {
                  const imageUrl = `${API_BASE_URL}${item.filePath.replace(/\\/g, "/")}`;
                  return (
                    <a key={item.id} href={imageUrl} target="_blank" rel="noopener noreferrer" className="block group relative overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={imageUrl}
                        alt={`Lampiran-${index}`}
                        className="w-full h-32 object-cover transition duration-300 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150?text=Gagal"; }}
                      />
                    </a>
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
                          ✅ Tandai SELESAI
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
                  ✅ Setujui Pelaksanaan
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