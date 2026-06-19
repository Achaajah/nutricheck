export default function Navbar() {
  return (
    <div className="w-full bg-white shadow-sm border-b">
      
      <div className="flex justify-between items-center px-8 py-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/assets/img/logo.svg" alt="logo" width="40" />
          <span className="font-bold text-xl">NutriCheck</span>
        </div>

        {/* Menu */}
        <div className="flex gap-8">
          <span className="text-green-600 font-semibold cursor-pointer">
            Beranda
          </span>

          <span className="cursor-pointer hover:text-green-600 transition">
            Kalkulator Gizi
          </span>

          <span className="cursor-pointer hover:text-green-600 transition">
            Tentang Kami
          </span>
        </div>

      </div>
    </div>
  );
}