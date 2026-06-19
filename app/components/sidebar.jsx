"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();

  const menu = [
    {
      name: "Beranda",
      href: "/",
      icon: "/assets/img/home.png",
    },
    {
      name: "Kalkulator Gizi",
      href: "/kalkulator",
      icon: "/assets/img/kalkulator.png",
    },
    {
      name: "Tentang Gizi",
      href: "/informasi",
      icon: "/assets/img/informasi.png",
    },
  ];

  return (
    <div
      className="
        w-72
        min-h-[calc(100vh-100px)]
        sticky top-20
        bg-[#dfeee3]
        p-5
        rounded-2xl
        flex flex-col
        justify-between
        shadow-sm
      "
    >
      {/* MENU */}
      <div>
        <h1 className="text-xl font-bold mb-6">Menu</h1>

        <div className="flex flex-col gap-3">
          {menu.map((item, index) => {
            const isActive = path === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                className={`
                  flex items-center gap-3
                  p-3 rounded-lg
                  transition-all duration-200
                  
                  ${
                    isActive
                      ? "bg-green-500 text-white font-semibold shadow"
                      : "hover:bg-green-100 text-gray-700"
                  }
                `}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6 object-contain"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* CARD BAWAH */}
      <div className="bg-white p-4 rounded-xl shadow text-center mt-6 flex flex-col items-center gap-3">
        <img src="/assets/img/logo.svg" alt="logo" className="w-12" />

        <p className="text-sm leading-tight">
          Yuk, jaga pola makan
          <br /> sehat setiap hari
        </p>

        <button className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-full">
          Yuk!
        </button>
      </div>
    </div>
  );
}
