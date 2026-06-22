"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const path = usePathname();

  const menu = [
    { name: "Beranda", href: "/" },
    { name: "Kalkulator Gizi", href: "/kalkulator" },
    { name: "Tentang Kami", href: "/informasi" },
  ];

  return (
    <div className="w-full bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-4 lg:px-8 py-4">

        {/* Logo - geser kanan di mobile biar ga nabrak hamburger */}
        <div className="flex items-center gap-2 pl-10 lg:pl-0">
          <img src="/assets/img/logo.svg" alt="logo" width="40" />
          <span className="font-bold text-xl" style={{ fontFamily: "var(--font-potta-one)" }}>
            NutriCheck
          </span>
        </div>

        {/* Menu - hidden di mobile */}
        <div className="hidden md:flex gap-4 lg:gap-8">
          {menu.map((item) => {
            const isActive = path === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-sm font-semibold transition px-3 py-1 rounded-full border
                  ${isActive
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-600 hover:text-green-600"
                  }
                `}
                style={{ fontFamily: "var(--font-patua-one)" }}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}