"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FoodCard from "./components/FoodCard";
import FloatingAI from "./components/FloatingAI";

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  // Fetch foods dari API saat pertama kali mount
  useEffect(() => {
    async function fetchFoods() {
      try {
        setLoading(true);
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Gagal mengambil data makanan");
        const data = await res.json();
        setFoods(data);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  const handleSearch = () => {
    setShowSearch(true);
    setTimeout(() => {
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      searchRef.current?.querySelector("input")?.focus();
    }, 100);
  };

  // Client-side search filtering
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
                {loading ? (
                  <div
                    className="col-span-full text-center py-10 text-gray-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Memuat data makanan...
                  </div>
                ) : error ? (
                  <div
                    className="col-span-full text-center py-10 text-red-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {error}
                  </div>
                ) : filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))
                ) : (
                  <div
                    className="col-span-full text-center py-10 text-gray-400"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Makanan &quot;{search}&quot; tidak ditemukan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}