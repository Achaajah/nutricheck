"use client";

export default function Hero({ onSearch }) {
  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl shadow flex flex-col lg:flex-row justify-between items-center gap-6">
      {/* TEXT */}
      <div className="text-center lg:text-left">
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ fontFamily: "var(--font-patua-one)" }}>
          Selamat Datang di
        </h1>
        <h2 className="text-3xl lg:text-4xl font-extrabold text-green-500 mt-2" style={{ fontFamily: "var(--font-potta-one)" }}>
          NutriCheck
        </h2>
        <p className="mt-4 text-base lg:text-lg max-w-md" style={{ fontFamily: "var(--font-patua-one)" }}>
          Cari informasi gizi makanan dan hitung kebutuhan nutrisi sesuai kondisi tubuhmu.
        </p>
        <button
          onClick={onSearch}
          className="mt-6 bg-green-500 hover:bg-green-600 transition text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 mx-auto lg:mx-0"
          style={{ fontFamily: "var(--font-patua-one)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          Cari Makanan atau Minuman
        </button>
        <span className="text-xs text-gray-400 mt-2 block text-center lg:text-left" style={{ fontFamily: "var(--font-patua-one)" }}>
          Klik untuk mencari makanan favoritmu!
        </span>
      </div>

      {/* IMAGE */}
      <div className="w-40 h-40 lg:w-64 lg:h-64 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
        <img src="/assets/img/logo.svg" alt="Logo Image" className="w-24 lg:w-40" />
      </div>
    </div>
  );
}