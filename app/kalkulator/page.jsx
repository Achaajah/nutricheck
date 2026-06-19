"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";

const PROGRAMS = ["Umum", "Reduce Sugar", "Low Fat", "Muscle Gain"];

const DEFAULT_GIZI = {
  kalori: "",
  karbohidrat: "",
  protein: "",
  lemak: "",
  gula: "",
  serat: "",
  natrium: "",
};

export default function KalkulatorPage() {
  const [program, setProgram] = useState("Umum");
  const [nama, setNama] = useState("");
  const [usia, setUsia] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [gizi, setGizi] = useState(DEFAULT_GIZI);
  const [hasil, setHasil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGiziChange = (field, value) => {
    setGizi((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalisis = async () => {
    if (!nama || !usia || !jenisKelamin) {
      alert("Lengkapi nama, usia, dan jenis kelamin terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    setHasil(null);

    const prompt = `
Kamu adalah ahli gizi yang menggunakan standar AKG (Angka Kecukupan Gizi) Kemenkes Indonesia.

Data pengguna:
- Nama: ${nama}
- Usia: ${usia} tahun
- Jenis Kelamin: ${jenisKelamin}
- Program Diet: ${program}

Kandungan gizi makanan yang dikonsumsi (per porsi):
- Kalori: ${gizi.kalori || 0} kcal
- Karbohidrat: ${gizi.karbohidrat || 0} g
- Protein: ${gizi.protein || 0} g
- Lemak: ${gizi.lemak || 0} g
- Gula: ${gizi.gula || 0} g
- Serat: ${gizi.serat || 0} g
- Natrium: ${gizi.natrium || 0} mg

Analisis apakah kandungan gizi ini sesuai untuk program "${program}" berdasarkan standar AKG Kemenkes Indonesia.

Berikan respons HANYA dalam format JSON berikut, tanpa teks lain:
{
  "status": "MAKANAN SEHAT" atau "PERLU PERHATIAN" atau "TIDAK DIREKOMENDASIKAN",
  "skor": angka dari 1-10,
  "alasan": ["alasan 1", "alasan 2", "alasan 3"],
  "saran": "satu kalimat saran singkat"
}
    `.trim();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setHasil(parsed);
    } catch {
      setHasil({
        status: "ERROR",
        skor: 0,
        alasan: ["Terjadi kesalahan saat menganalisis."],
        saran: "Coba lagi beberapa saat.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasil(null);
    setGizi(DEFAULT_GIZI);
    setNama("");
    setUsia("");
    setJenisKelamin("");
  };

  const statusColor = {
    "MAKANAN SEHAT": "text-green-600",
    "PERLU PERHATIAN": "text-yellow-500",
    "TIDAK DIREKOMENDASIKAN": "text-red-500",
    ERROR: "text-red-500",
  };

  const statusBg = {
    "MAKANAN SEHAT": "bg-green-50",
    "PERLU PERHATIAN": "bg-yellow-50",
    "TIDAK DIREKOMENDASIKAN": "bg-red-50",
    ERROR: "bg-red-50",
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Navbar />
      <div className="px-6 lg:px-10 pt-6">
        <div className="flex gap-6 items-start">
          <Sidebar />

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm">
            <h1 className="text-3xl font-extrabold">Kalkulator Gizi</h1>
            <p className="text-gray-500 mt-1 mb-6">
              Isi data diri Anda untuk menghitung kebutuhan gizi harian
            </p>

            {/* TABS PROGRAM */}
            <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
              {PROGRAMS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setProgram(p);
                    setHasil(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                    ${
                      program === p
                        ? "bg-green-500 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-green-100"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex gap-8">
              {/* KIRI - FORM */}
              <div className="flex-1 flex flex-col gap-5">
                {/* NAMA & USIA */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukan nama lengkap"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Usia
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={usia}
                        onChange={(e) => setUsia(e.target.value)}
                        placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
                      />
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        tahun
                      </span>
                    </div>
                  </div>
                </div>

                {/* JENIS KELAMIN */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <div className="flex gap-4">
                    {["Laki-laki", "Perempuan"].map((jk) => (
                      <label
                        key={jk}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value={jk}
                          checked={jenisKelamin === jk}
                          onChange={() => setJenisKelamin(jk)}
                          className="accent-green-500"
                        />
                        <span className="text-sm text-gray-700">{jk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* INPUT GIZI */}
                <div className="border border-gray-100 rounded-xl p-4">
                  <p className="font-bold text-sm text-gray-700 mb-3">
                    Input Kandungan Gizi{" "}
                    <span className="font-normal text-gray-400">
                      (per porsi)
                    </span>
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      { key: "kalori", label: "Kalori", satuan: "kcal" },
                      { key: "karbohidrat", label: "Karbohidrat", satuan: "g" },
                      { key: "protein", label: "Protein", satuan: "g" },
                      { key: "lemak", label: "Lemak", satuan: "g" },
                      { key: "gula", label: "Gula", satuan: "g" },
                      { key: "serat", label: "Serat", satuan: "g" },
                      { key: "natrium", label: "Natrium", satuan: "mg" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-28">
                          {item.label}
                        </span>
                        <input
                          type="number"
                          value={gizi[item.key]}
                          onChange={(e) =>
                            handleGiziChange(item.key, e.target.value)
                          }
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-400"
                        />
                        <span className="text-sm text-gray-400 w-8">
                          {item.satuan}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KANAN - HASIL */}
              <div className="w-72 flex flex-col gap-4">
                <div>
                  <p className="font-bold text-gray-800">Hasil Analisis</p>
                  <p className="text-xs text-gray-400">
                    Berikut hasil evaluasi makanan anda
                  </p>
                </div>

                {!hasil && !isLoading && (
                  <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[200px]">
                    <span className="text-3xl">🥗</span>
                    <p className="text-sm text-gray-400">
                      Isi data dan klik Analisis untuk melihat hasil
                    </p>
                  </div>
                )}

                {isLoading && (
                  <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[200px]">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                    <p className="text-sm text-gray-400">
                      Sedang menganalisis...
                    </p>
                  </div>
                )}

                {hasil && !isLoading && (
                  <div className="flex flex-col gap-3">
                    {/* STATUS */}
                    <div
                      className={`${statusBg[hasil.status]} rounded-2xl p-4`}
                    >
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p
                        className={`font-extrabold text-base ${statusColor[hasil.status]}`}
                      >
                        {hasil.status}{" "}
                        {hasil.status === "MAKANAN SEHAT"
                          ? "✅"
                          : hasil.status === "PERLU PERHATIAN"
                            ? "⚠️"
                            : "❌"}
                      </p>
                    </div>

                    {/* SKOR */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Skor</p>
                      <p className="font-extrabold text-3xl text-green-500">
                        {hasil.skor}{" "}
                        <span className="text-gray-400 text-lg">/ 10</span>
                      </p>
                    </div>

                    {/* ALASAN */}
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="font-bold text-sm text-gray-700 mb-2">
                        Alasan
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {hasil.alasan?.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
                            <span className="text-green-500 mt-0.5">✅</span>
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SARAN */}
                    {hasil.saran && (
                      <div className="bg-green-50 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 mb-1">Saran</p>
                        <p className="text-sm text-green-700 font-medium">
                          {hasil.saran}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TOMBOL */}
                <button
                  onClick={hasil ? handleReset : handleAnalisis}
                  disabled={isLoading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 transition text-white font-bold py-3 rounded-xl mt-2"
                >
                  {isLoading
                    ? "Menganalisis..."
                    : hasil
                      ? "Analisis Ulang"
                      : "Analisis"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
