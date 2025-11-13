import Link from 'next/link';

const labelStyle = "block text-xs font-medium text-gray-500 mb-1 ml-4";
const inputStyle = "w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900";

export default function LengkapiDataPage() {
  return (
    // Wrapper utama
    <section className="relative flex items-center justify-center min-h-screen">
      
      {/* 1. Background Image (DENGAN BLUR) */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-sm" // <-- TAMBAHKAN 'filter blur-sm'
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      ></div>

      {/* 2. Overlay Gelap */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* 3. Kartu Form (Ini tidak akan ikut blur) */}
      <div className="relative z-10 w-full max-w-md p-6 mt-16">
        <form className="bg-white p-8 md:p-10 rounded-2xl shadow-xl">
          
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Tolong Isi Dengan Lengkap
          </h1>
          <p className="text-center text-sm text-gray-600 mb-8">
            Isi Data Diri Anda yang Benar
          </p>

          <div className="space-y-5">
            <div>
              <label htmlFor="nama" className={labelStyle}>Nama Lengkap</label>
              <input type="text" id="nama" placeholder="Nama Lengkap Anda" className={inputStyle} />
            </div>
            <div>
              <label htmlFor="nik" className={labelStyle}>NIK</label>
              <input type="text" id="nik" placeholder="Nomor Induk Kependudukan" className={inputStyle} />
            </div>
            <div>
              <label htmlFor="alamat" className={labelStyle}>Alamat Lengkap</label>
              <input type="text" id="alamat" placeholder="Alamat Lengkap Anda" className={inputStyle} />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition duration-300 mt-4"
            >
              KIRIM
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}