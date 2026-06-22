"use client";

import { useState } from "react";

const potta = { fontFamily: "var(--font-potta-one)" };
const patua = { fontFamily: "var(--font-patua-one)" };

export default function FoodCard({ food }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className="
        bg-white
        p-5
        rounded-2xl
        border border-gray-100
        shadow-sm
        hover:shadow-md
        transition-all duration-300
        cursor-pointer
        min-h-[220px]
        flex flex-col justify-center
      "
    >
      {!flipped ? (
        /* DEPAN - Gambar */
        <div className="flex flex-col items-center">
          <div className="h-28 flex items-center justify-center mb-3">
            <img
              src={food.img}
              alt={food.name}
              className="max-h-full object-contain"
            />
          </div>
          <h3 className="font-semibold text-gray-800 text-center" style={patua}>
            {food.name}
          </h3>
        </div>
      ) : (
        /* BELAKANG - Detail Gizi */
        <div>
          <h3 className="font-bold text-gray-800 text-center text-base mb-4" style={potta}>
            Kandungan Gizi
          </h3>
          <div className="flex flex-col gap-2">
            {food.gizi?.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium w-24" style={patua}>{item.label}</span>
                <span className="font-bold text-gray-900 w-10 text-right" style={patua}>{item.value}</span>
                <span className="text-gray-400 w-8 text-left ml-1" style={patua}>{item.satuan}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4" style={patua}>
            Klik untuk kembali
          </p>
        </div>
      )}
    </div>
  );
}