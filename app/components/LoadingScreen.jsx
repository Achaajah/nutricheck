"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onFinish?.(), 500);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const messages = [
    "Memuat data gizi...",
    "Menyiapkan kalkulator...",
    "Menganalisis nutrisi...",
    "Hampir selesai...",
  ];

  const messageIndex = Math.floor((progress / 100) * messages.length);
  const currentMessage = messages[Math.min(messageIndex, messages.length - 1)];

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-6
        transition-opacity duration-500
        ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* LOGO */}
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <img
            src="/assets/img/logo.svg"
            alt="NutriCheck"
            className="w-24 h-24"
          />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">NutriCheck</h1>
        <p className="text-sm text-gray-400">{currentMessage}</p>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-64 flex flex-col gap-2">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right">{progress}%</p>
      </div>
    </div>
  );
}