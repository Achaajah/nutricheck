"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Beranda", href: "/", icon: "/assets/img/Home.svg" },
    { name: "Kalkulator Gizi", href: "/kalkulator", icon: "/assets/img/kalkulator.png" },
    { name: "Tentang Gizi", href: "/informasi", icon: "/assets/img/informasi.png" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      {/* MENU */}
      <div>
        <h1 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-potta-one)" }}>
          Menu
        </h1>
        <div className="flex flex-col gap-3">
          {menu.map((item, index) => {
            const isActive = path === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isActive ? "bg-green-500 text-white font-semibold shadow" : "hover:bg-green-100 text-gray-700"}
                `}
                style={{ fontFamily: "var(--font-patua-one)" }}
              >
                <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* CARD BAWAH */}
      <div className="bg-white p-4 rounded-xl shadow text-center mt-6 flex flex-col items-center gap-3">
        <img src="/assets/img/logo.svg" alt="logo" className="w-12" />
        <p className="text-sm leading-tight" style={{ fontFamily: "var(--font-patua-one)" }}>
          Yuk, jaga pola makan <br /> sehat setiap hari
        </p>
        <button
          onClick={() => { router.push("/kalkulator"); setIsOpen(false); }}
          className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-full"
          style={{ fontFamily: "var(--font-patua-one)" }}
        >
          Yuk!
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* HAMBURGER BUTTON - mobile & tablet only */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-green-500 text-white p-2 rounded-xl shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* OVERLAY - mobile & tablet */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR MOBILE - slide in dari kiri */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 h-full w-72 bg-[#dfeee3] p-5 z-50 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* TOMBOL TUTUP */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mt-8 h-[calc(100%-2rem)]">
          <SidebarContent />
        </div>
      </div>

      {/* SIDEBAR DESKTOP - sticky seperti biasa */}
      <div className="hidden lg:flex w-72 sticky top-6 self-start bg-[#dfeee3] p-5 rounded-2xl flex-col justify-between shadow-sm min-h-[calc(100vh-6rem)]">
        <SidebarContent />
      </div>
    </>
  );
}