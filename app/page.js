"use client";

import { useRef, useState } from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FoodCard from "./components/FoodCard";
import FloatingAI from "./components/FloatingAI";

export default function Home() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const foods = [
    {
      id: 1,
      name: "Indomie Mi Goreng",
      img: "/assets/img/indomie.png",
      gizi: [
        { label: "Kalori", value: 380, satuan: "kcal" },
        { label: "Karbohidrat", value: 54, satuan: "gr" },
        { label: "Serat", value: 2, satuan: "gr" },
        { label: "Gula", value: 8, satuan: "gr" },
        { label: "Protein", value: 8, satuan: "gr" },
        { label: "Lemak", value: 14, satuan: "gr" },
        { label: "Natrium", value: 1070, satuan: "mg" },
      ],
    },
    {
      id: 2,
      name: "Teh Pucuk Harum",
      img: "/assets/img/teh.png",
      gizi: [
        { label: "Kalori", value: 70, satuan: "kcal" },
        { label: "Karbohidrat", value: 18, satuan: "gr" },
        { label: "Serat", value: 0, satuan: "gr" },
        { label: "Gula", value: 17, satuan: "gr" },
        { label: "Protein", value: 0, satuan: "gr" },
        { label: "Lemak", value: 0, satuan: "gr" },
        { label: "Natrium", value: 15, satuan: "mg" },
      ],
    },
    {
      id: 3,
      name: "Sari Gandum",
      img: "/assets/img/sari.png",
      gizi: [
        { label: "Kalori", value: 240, satuan: "kcal" },
        { label: "Karbohidrat", value: 42, satuan: "gr" },
        { label: "Serat", value: 3, satuan: "gr" },
        { label: "Gula", value: 6, satuan: "gr" },
        { label: "Protein", value: 5, satuan: "gr" },
        { label: "Lemak", value: 6, satuan: "gr" },
        { label: "Natrium", value: 200, satuan: "mg" },
      ],
    },
  ];

  const handleSearch = () => {
    setShowSearch(true);
    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      searchRef.current?.querySelector("input")?.focus();
    }, 100);
  };

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Navbar />

      <div className="px-6 lg:px-10 pt-6">
        <div className="flex gap-6 items-start">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-6">
            <Hero onSearch={handleSearch} />

            {/* SECTION MAKANAN */}
            <div ref={searchRef}>
              <h2 className="text-3xl font-extrabold mb-4">
                Makanan & Minuman
              </h2>

              {/* SEARCH BAR */}
              {showSearch && (
                <div className="flex items-center gap-3 bg-white border-2 border-green-400 rounded-full px-5 py-3 mb-6 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari makanan atau minuman"
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-gray-400 hover:text-gray-600 text-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}

              {/* FOOD CARDS */}
              <div className="grid grid-cols-3 gap-6">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10 text-gray-400">
                    Makanan "{search}" tidak ditemukan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingAI />
    </div>
  );
}
