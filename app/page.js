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
        { label: "Protein", value: 8, satuan: "gr" },
        { label: "Lemak", value: 14, satuan: "gr" },
        { label: "Gula", value: 8, satuan: "gr" },
        { label: "Serat", value: 2, satuan: "gr" },
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
        { label: "Protein", value: 0, satuan: "gr" },
        { label: "Lemak", value: 0, satuan: "gr" },
        { label: "Gula", value: 17, satuan: "gr" },
        { label: "Serat", value: 0, satuan: "gr" },
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
        { label: "Protein", value: 5, satuan: "gr" },
        { label: "Lemak", value: 6, satuan: "gr" },
        { label: "Gula", value: 6, satuan: "gr" },
        { label: "Serat", value: 3, satuan: "gr" },
        { label: "Natrium", value: 200, satuan: "mg" },
      ],
    },
    {
      id: 4,
      name: "Aqua 600ml",
      img: "/assets/img/aqua.png",
      gizi: [
        { label: "Kalori", value: 0, satuan: "kcal" },
        { label: "Karbohidrat", value: 0, satuan: "gr" },
        { label: "Protein", value: 0, satuan: "gr" },
        { label: "Lemak", value: 0, satuan: "gr" },
        { label: "Gula", value: 0, satuan: "gr" },
        { label: "Serat", value: 0, satuan: "gr" },
        { label: "Natrium", value: 0, satuan: "mg" },
      ],
    },
    {
      id: 5,
      name: "Good Day Kopi",
      img: "/assets/img/goodday.png",
      gizi: [
        { label: "Kalori", value: 50, satuan: "kcal" },
        { label: "Karbohidrat", value: 9, satuan: "gr" },
        { label: "Protein", value: 1, satuan: "gr" },
        { label: "Lemak", value: 1, satuan: "gr" },
        { label: "Gula", value: 8, satuan: "gr" },
        { label: "Serat", value: 0, satuan: "gr" },
        { label: "Natrium", value: 40, satuan: "mg" },
      ],
    },
    {
      id: 6,
      name: "Chitato Sapi Panggang",
      img: "/assets/img/chitato.png",
      gizi: [
        { label: "Kalori", value: 160, satuan: "kcal" },
        { label: "Karbohidrat", value: 18, satuan: "gr" },
        { label: "Protein", value: 2, satuan: "gr" },
        { label: "Lemak", value: 9, satuan: "gr" },
        { label: "Gula", value: 1, satuan: "gr" },
        { label: "Serat", value: 1, satuan: "gr" },
        { label: "Natrium", value: 220, satuan: "mg" },
      ],
    },
    {
      id: 7,
      name: "Pocari Sweat",
      img: "/assets/img/pocari.png",
      gizi: [
        { label: "Kalori", value: 105, satuan: "kcal" },
        { label: "Karbohidrat", value: 26, satuan: "gr" },
        { label: "Protein", value: 0, satuan: "gr" },
        { label: "Lemak", value: 0, satuan: "gr" },
        { label: "Gula", value: 25, satuan: "gr" },
        { label: "Serat", value: 0, satuan: "gr" },
        { label: "Natrium", value: 230, satuan: "mg" },
      ],
    },
    {
      id: 8,
      name: "Oreo Original",
      img: "/assets/img/oreo.png",
      gizi: [
        { label: "Kalori", value: 160, satuan: "kcal" },
        { label: "Karbohidrat", value: 25, satuan: "gr" },
        { label: "Protein", value: 2, satuan: "gr" },
        { label: "Lemak", value: 7, satuan: "gr" },
        { label: "Gula", value: 13, satuan: "gr" },
        { label: "Serat", value: 1, satuan: "gr" },
        { label: "Natrium", value: 135, satuan: "mg" },
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
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Navbar />

      <div className="px-4 lg:px-10 pt-6 pb-10">
        <div className="flex gap-6 items-start">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <Hero onSearch={handleSearch} />

            <div ref={searchRef}>
              <h2
                className="text-2xl lg:text-3xl font-extrabold mb-4"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Makanan & Minuman
              </h2>

              {/* SEARCH BAR */}
              {showSearch && (
                <div className="flex items-center gap-3 bg-white border-2 border-green-400 rounded-full px-5 py-3 mb-6 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
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
                    style={{ fontFamily: "var(--font-inter)" }}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))
                ) : (
                  <div
                    className="col-span-full text-center py-10 text-gray-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
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