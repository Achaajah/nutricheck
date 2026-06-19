export default function Hero() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow flex justify-between items-center">
      {/* TEXT */}
      <div>
        <h1 className="text-3xl font-extrabold">
          Selamat Datang di
        </h1>

        <h2 className="text-4xl font-extrabold text-green-500 mt-2">
          NutriCheck
        </h2>

        <p className="mt-4 text-lg font-semibold max-w-md">
          Cari informasi gizi makanan dan hitung kebutuhan nutrisi sesuai kondisi tubuhmu.
        </p>

        <button className="mt-6 bg-green-500 hover:bg-green-600 transition text-black font-bold px-6 py-3 rounded-full">
          Mulai Sekarang
        </button>
      </div>

      {/* IMAGE */}
      <div className="w-64 h-64 bg-green-200 rounded-full flex items-center justify-center">
        <img 
          src="/assets/img/logo.svg" 
          alt="Logo Image" 
          className="w-40"
        />
      </div>
    </div>
  );
}