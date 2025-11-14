"use client";

interface SuccessPopupProps {
    isOpen: boolean;
    idPengaduan: number | null;
    onClose: () => void;
}

export default function SuccessPopup({ isOpen, idPengaduan, onClose }: SuccessPopupProps) {
    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(String(idPengaduan));
        alert("ID Pengaduan disalin!");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-96 text-center">

                <h2 className="text-xl font-bold text-[#0060A9] mb-2">
                    Pengaduan Berhasil Dikirim
                </h2>

                <p className="text-gray-700 mb-4">
                    Simpan ID Pengaduan Anda untuk melakukan pelacakan.
                </p>

                <div className="text-3xl font-bold text-[#004A80] mb-4">
                    {idPengaduan}
                </div>

                <button
                    onClick={copyToClipboard}
                    className="w-full py-2 bg-[#0060A9] text-white rounded-full mb-3"
                >
                    Salin ID
                </button>

                <a
                    href={`/lacak`}
                    className="block w-full py-2 bg-[#004A80] text-white rounded-full mb-3"
                >
                    Lacak Pengaduan
                </a>

                <button
                    onClick={onClose}
                    className="w-full py-2 bg-gray-300 rounded-full"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
