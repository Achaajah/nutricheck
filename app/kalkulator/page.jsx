"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";

const FITUR_OPTIONS = ["Umum", "Reduce Sugar", "Low Fat", "Muscle Gain"];
const JENIS_KELAMIN_OPTIONS = ["Laki-laki", "Perempuan"];
const AKTIVITAS_OPTIONS = ["Rendah", "Sedang", "Tinggi"];

const KETERANGAN_AKTIVITAS = {
  Rendah: "Jarang berolahraga",
  Sedang: "Olahraga 3-5 kali / minggu",
  Tinggi: "Aktivitas fisik berat setiap hari",
};

const REQUIRED_FIELDS = {
  Umum: [],
  "Reduce Sugar": [
    { field: "gula", label: "Gula" },
    { field: "karbohidratTotal", label: "Karbohidrat Total" },
    { field: "serat", label: "Serat" },
    { field: "kalori", label: "Kalori" },
  ],
  "Low Fat": [
    { field: "lemakTotal", label: "Lemak Total" },
    { field: "lemakJenuh", label: "Lemak Jenuh" },
    { field: "lemakTrans", label: "Lemak Trans" },
    { field: "kalori", label: "Kalori" },
  ],
  "Muscle Gain": [
    { field: "protein", label: "Protein" },
    { field: "karbohidratTotal", label: "Karbohidrat Total" },
    { field: "mineral", label: "Mineral" },
    { field: "kalori", label: "Kalori" },
  ],
};

const PROGRAM_DESC = {
  Umum: "Isi kandungan gizi bebas sesuai kebutuhan.",
  "Reduce Sugar": "Program ini fokus mengurangi asupan gula. Field bertanda * wajib diisi.",
  "Low Fat": "Program ini fokus mengurangi lemak. Field bertanda * wajib diisi.",
  "Muscle Gain": "Program ini fokus membangun otot. Field bertanda * wajib diisi.",
};

const DEFAULT_GIZI = {
  karbohidratTotal: "", karbohidratSederhana: "", karbohidratKompleks: "",
  lemakTotal: "", lemakJenuh: "", lemakTakJenuh: "", lemakTrans: "",
  gula: "", gulaLaktosa: "", gulaGlukosa: "", gulaFruktosa: "",
  protein: "", proteinHewani: "", proteinNabati: "", proteinKompleks: "", proteinSederhana: "",
  serat: "", seratHemiselulosa: "", seratSelulosa: "", seratLignin: "", seratPektrim: "",
  mineral: "", mineralMakro: "", mineralMikro: "",
  natrium: "", kalori: "",
};

const AKTIVITAS_FACTOR = { Rendah: 1.2, Sedang: 1.55, Tinggi: 1.725 };

function buildPrompt(fitur, { usia, beratBadan, tinggiBadan, jenisKelamin, aktivitas }, gizi) {
  const g = (field) => gizi[field] || 0;


  // PROMPT, RULES AND EXPLANATION 
  const dataSection = `Data pengguna:
- Usia: ${usia} tahun
- Berat Badan: ${beratBadan} kg
- Tinggi Badan: ${tinggiBadan} cm
- Jenis Kelamin: ${jenisKelamin}
- Intensitas Aktivitas: ${aktivitas} (${KETERANGAN_AKTIVITAS[aktivitas]})
- Faktor Aktivitas: ${AKTIVITAS_FACTOR[aktivitas]}

Kandungan gizi makanan (per porsi/kemasan):
- Kalori: ${g("kalori")} kcal
- Karbohidrat Total: ${g("karbohidratTotal")} g (Sederhana: ${g("karbohidratSederhana")}g, Kompleks: ${g("karbohidratKompleks")}g)
- Lemak Total: ${g("lemakTotal")} g (Jenuh: ${g("lemakJenuh")}g, Tak Jenuh: ${g("lemakTakJenuh")}g, Trans: ${g("lemakTrans")}g)
- Gula Total: ${g("gula")} g (Laktosa: ${g("gulaLaktosa")}g, Glukosa: ${g("gulaGlukosa")}g, Fruktosa: ${g("gulaFruktosa")}g)
- Protein Total: ${g("protein")} g (Hewani: ${g("proteinHewani")}g, Nabati: ${g("proteinNabati")}g, Kompleks: ${g("proteinKompleks")}g, Sederhana: ${g("proteinSederhana")}g)
- Serat Total: ${g("serat")} g (Hemiselulosa: ${g("seratHemiselulosa")}g, Selulosa: ${g("seratSelulosa")}g, Lignin: ${g("seratLignin")}g, Pektrim: ${g("seratPektrim")}g)
- Mineral: ${g("mineral")} g (Makro: ${g("mineralMakro")}g, Mikro: ${g("mineralMikro")}g)
- Natrium: ${g("natrium")} mg`;

  const tdeeInstruksi = `Langkah Awal — Hitung TDEE:
- Laki-laki: BMR = 66.5 + (13.75 × BB) + (5.003 × TB) - (6.75 × Usia)
- Perempuan: BMR = 655.1 + (9.563 × BB) + (1.850 × TB) - (4.676 × Usia)
- TDEE = BMR × Faktor Aktivitas (${AKTIVITAS_FACTOR[aktivitas]})`;

  const rules = {
    Umum: `ATURAN EVALUASI PROGRAM "UMUM":

Langkah 1: Mulai dengan Skor Awal = 100.

Langkah 2: Cek Zat Jahat — kurangi poin jika melebihi batas:
- Natrium > 150 mg per porsi → kurangi 15 poin
- Lemak Jenuh > 4 g per porsi → kurangi 15 poin
- Lemak Trans > 0 g (berapapun) → kurangi 30 poin
- Gula Total > 10 g per porsi → kurangi 15 poin
  - Sub-analisis Fruktosa: jika Fruktosa > 5 g → kurangi tambahan 5 poin

Langkah 3: Cek Zat Baik — tambah poin jika memenuhi syarat:
- Protein Total > 5 g → tambah 10 poin
  - Sub-analisis: jika Protein Hewani atau Protein Kompleks > 0 → tambah 5 poin
- Serat Total > 3 g → tambah 10 poin
- Mineral Makro atau Mineral Mikro > 0 → tambah 5 poin

Langkah 4: Hitung Skor Akhir = Skor Awal - total pengurangan + total penambahan.

Langkah 5: Klasifikasi:
- Skor 80–100 → status "Makanan Sehat" (Lampu Hijau)
- Skor 50–79 → status "Perlu Perhatian" (Lampu Kuning) — sebutkan zat yang menurunkan skor
- Skor < 50 → status "Tidak Direkomendasikan" (Lampu Merah)

Konversi skor ke skala 1–10: skor = Skor Akhir / 10 (bulatkan 1 desimal, minimal 1.0).

Pada hasilKalkulasi, tampilkan: skorAwal, daftarPengurangan (array of {zat, poin}), daftarPenambahan (array of {zat, poin}), skorAkhir.`,

    "Reduce Sugar": `${tdeeInstruksi}

ATURAN EVALUASI PROGRAM "REDUCE SUGAR":

Langkah 1: Hitung Baseline:
- Target Gula Harian (g) = (TDEE × 0.10) / 4
- Batas Natrium Selingan = 500 mg

Langkah 2: Hitung Rasio Gula:
- Rasio Gula (%) = (Gula Total / Karbohidrat Total) × 100
- Jika Rasio Gula > 30%, karbohidrat didominasi gula cepat serap (kualitas buruk)

Langkah 3: Hitung Beban Glikemik Lokal:
- Beban Glikemik Lokal = (Glukosa × 1.0) + (Laktosa × 0.46) + (Fruktosa × 0.19)

Langkah 4: Hitung Kekuatan Rem Serat (B_total):
- Serat Larut = Pektrim + Hemiselulosa
- Serat Tidak Larut = Selulosa + Lignin
- B_total = (Serat Larut × 1.0) + (Serat Tidak Larut × 0.5)

Langkah 5: Filter Natrium — cek apakah Natrium > 500 mg.

Langkah 6: Tentukan Status:
- "Makanan Sehat" (Hijau): Rasio Gula ≤ 20% DAN B_total ≥ 1.0 g DAN Natrium ≤ 500 mg
- "Perlu Perhatian" (Kuning):
  • Kategori A: Rasio Gula ≤ 20% tetapi Natrium > 500 mg
  • Kategori B: Rasio Gula 21–30%, atau B_total < 1.0 g
- "Tidak Direkomendasikan" (Merah/Sugar Crash): Rasio Gula > 30% DAN B_total < 0.5 g

Skor 1–10: Hijau=8–10, Kuning=5–7, Merah=1–4 (sesuaikan dalam rentang berdasarkan seberapa jauh dari ambang batas).

Pada hasilKalkulasi, tampilkan: tdee, targetGulaHarian, rasioGula, bebanGlikemikLokal, seratLarut, seratTidakLarut, bTotal, natriumStatus.`,

    "Low Fat": `${tdeeInstruksi}

ATURAN EVALUASI PROGRAM "LOW FAT":

Langkah 1: Hitung Baseline:
- Target Kalori Diet = TDEE - 500 kcal
- Batas Lemak Harian (g) = (Target Kalori Diet × 0.25) / 9
- Batas Natrium Selingan = 500 mg

Langkah 2: Skreening Lemak Trans:
- Jika Lemak Trans > 0 g → LANGSUNG kunci status "Tidak Direkomendasikan" (Merah/Bahaya Mutlak), abaikan parameter lain.

Langkah 3: Hitung Rasio Lemak Jenuh:
- Rasio Lemak Jenuh (%) = (Lemak Jenuh / Lemak Total) × 100
- Jika > 40%, makanan dinilai kurang baik (didominasi lemak padat)

Langkah 4: Filter Lapis Kedua:
- Cek Natrium > 500 mg
- Cek Gula Total > 10 g

Langkah 5: Hitung Serat Pengenyang:
- Serat Pengenyang = Selulosa + Lignin

Langkah 6: Tentukan Status:
- "Makanan Sehat" (Diet Ideal): Kalori ≤ 35% Target Kalori Diet DAN Lemak Trans = 0 DAN Rasio Lemak Jenuh ≤ 40% DAN Natrium ≤ 500 mg DAN Serat Pengenyang ≥ 1.5 g
- "Perlu Perhatian" (Zat Tersembunyi): Kalori & lemak total memenuhi defisit, TETAPI Rasio Lemak Jenuh > 40% ATAU Natrium > 500 mg ATAU Gula > 10 g
- "Tidak Direkomendasikan" (Bahaya Mutlak): Lemak Trans > 0 ATAU Kalori > 50% dari Target Kalori Diet

Skor 1–10: Hijau=8–10, Kuning=5–7, Merah=1–4.

Pada hasilKalkulasi, tampilkan: tdee, targetKaloriDiet, batasLemakHarian, rasioLemakJenuh, seratPengenyang, persenKaloriTerhadapTarget, natriumStatus, gulaStatus.`,

    "Muscle Gain": `${tdeeInstruksi}

ATURAN EVALUASI PROGRAM "MUSCLE GAIN":

Langkah 1: Hitung Baseline:
- Target Kalori Surplus = TDEE + 300 kcal
- Target Protein Harian (g) = 2 × Berat Badan (${beratBadan} kg)
- Batas Natrium Maksimal per Porsi = 600 mg

Langkah 2: Hitung Kualitas Protein:
- Densitas Protein (%) = (Protein × 4 / Kalori) × 100
- Rasio Protein Berkualitas (%) = ((Protein Hewani + Protein Kompleks) / Protein Total) × 100

Langkah 3: Filter Lapis Kedua:
- Cek Natrium > 600 mg
- Cek Lemak Jenuh > 5 g

Langkah 4: Analisis Perlindungan Otot:
- Cek apakah Karbohidrat Kompleks > Karbohidrat Sederhana (Gula)
- Cek apakah Mineral Makro > 0

Langkah 5: Tentukan Status:
- "Makanan Sehat" (Anabolik Maksimal): Densitas Protein ≥ 20% DAN Rasio Protein Berkualitas ≥ 60% DAN Natrium ≤ 600 mg DAN Lemak Jenuh ≤ 5 g
- "Perlu Perhatian" (Dirty Bulking): Densitas Protein ≥ 20% DAN Rasio Protein Berkualitas ≥ 60%, TETAPI Natrium > 600 mg ATAU Lemak Jenuh > 5 g
- "Tidak Direkomendasikan": Densitas Protein < 20% ATAU Rasio Protein Berkualitas < 60%

Skor 1–10: Hijau=8–10, Kuning=5–7, Merah=1–4.

Pada hasilKalkulasi, tampilkan: tdee, targetKaloriSurplus, targetProteinHarian, densitasProtein, rasioProteinBerkualitas, natriumStatus, lemakJenuhStatus, karboKompleksVsSederhana, mineralMakroStatus.`,
  };

  const responseFormat = `Berikan respons HANYA dalam format JSON valid berikut (tanpa teks lain, tanpa markdown):
{
  "status": "Makanan Sehat" atau "Perlu Perhatian" atau "Tidak Direkomendasikan",
  "statusLabel": "label spesifik program (misal: Anabolik Maksimal, Sugar Crash, Diet Ideal, dll.)",
  "skor": angka 1.0–10.0 (1 desimal),
  "penjelasan": ["poin penjelasan 1", "poin 2", "poin 3", "poin 4"],
  "hasilKalkulasi": { hasil perhitungan antara sesuai instruksi di atas },
  "kalkulasi": [
    {"label": "Kalori", "nilai": "${g("kalori")}", "satuan": "kcal"},
    {"label": "Karbohidrat Total", "nilai": "${g("karbohidratTotal")}", "satuan": "g", "sub": [{"label": "Sederhana", "nilai": "${g("karbohidratSederhana")}", "satuan": "g"}, {"label": "Kompleks", "nilai": "${g("karbohidratKompleks")}", "satuan": "g"}]},
    {"label": "Lemak Total", "nilai": "${g("lemakTotal")}", "satuan": "g", "sub": [{"label": "Jenuh", "nilai": "${g("lemakJenuh")}", "satuan": "g"}, {"label": "Tak Jenuh", "nilai": "${g("lemakTakJenuh")}", "satuan": "g"}, {"label": "Trans", "nilai": "${g("lemakTrans")}", "satuan": "g"}]},
    {"label": "Gula", "nilai": "${g("gula")}", "satuan": "g", "sub": [{"label": "Glukosa", "nilai": "${g("gulaGlukosa")}", "satuan": "g"}, {"label": "Fruktosa", "nilai": "${g("gulaFruktosa")}", "satuan": "g"}, {"label": "Laktosa", "nilai": "${g("gulaLaktosa")}", "satuan": "g"}]},
    {"label": "Protein", "nilai": "${g("protein")}", "satuan": "g", "sub": [{"label": "Hewani", "nilai": "${g("proteinHewani")}", "satuan": "g"}, {"label": "Nabati", "nilai": "${g("proteinNabati")}", "satuan": "g"}, {"label": "Kompleks", "nilai": "${g("proteinKompleks")}", "satuan": "g"}]},
    {"label": "Serat", "nilai": "${g("serat")}", "satuan": "g", "sub": [{"label": "Hemiselulosa", "nilai": "${g("seratHemiselulosa")}", "satuan": "g"}, {"label": "Selulosa", "nilai": "${g("seratSelulosa")}", "satuan": "g"}, {"label": "Lignin", "nilai": "${g("seratLignin")}", "satuan": "g"}, {"label": "Pektrim", "nilai": "${g("seratPektrim")}", "satuan": "g"}]},
    {"label": "Mineral", "nilai": "${g("mineral")}", "satuan": "g", "sub": [{"label": "Makro", "nilai": "${g("mineralMakro")}", "satuan": "g"}, {"label": "Mikro", "nilai": "${g("mineralMikro")}", "satuan": "g"}]},
    {"label": "Natrium", "nilai": "${g("natrium")}", "satuan": "mg"}
  ],
  "totalNilaiGizi": jumlah total semua nilai gizi utama
}`;

  return `Kamu adalah sistem evaluasi gizi NutriCheck. Tugasmu adalah mengevaluasi makanan berdasarkan aturan EKSAK berikut. JANGAN gunakan pengetahuan lain, ikuti HANYA aturan di bawah ini.

${dataSection}

${rules[fitur]}

${responseFormat}`.trim();
}

const potta = { fontFamily: "var(--font-jakarta)" };
const patua = { fontFamily: "var(--font-inter)" };

function GiziInput({ field, satuan, placeholder, gizi, onChange, isError }) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={gizi[field]}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder || "0"}
        style={patua}
        className={`w-full border rounded-lg px-2 py-1 text-xs outline-none transition
          ${isError ? "border-red-400 bg-red-50 focus:border-red-500" : "border-gray-200 focus:border-green-400"}`}
      />
      <span className="text-xs text-gray-400 whitespace-nowrap" style={patua}>{satuan}</span>
    </div>
  );
}

const statusConfig = {
  "Makanan Sehat": { color: "text-green-600", icon: "✅", bg: "bg-green-50" },
  "Perlu Perhatian": { color: "text-yellow-500", icon: "⚠️", bg: "bg-yellow-50" },
  "Tidak Direkomendasikan": { color: "text-red-500", icon: "❌", bg: "bg-red-50" },
  Error: { color: "text-red-500", icon: "❌", bg: "bg-red-50" },
};

export default function KalkulatorPage() {
  const [fitur, setFitur] = useState("Umum");
  const [usia, setUsia] = useState("");
  const [beratBadan, setBeratBadan] = useState("");
  const [tinggiBadan, setTinggiBadan] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [aktivitas, setAktivitas] = useState("");
  const [gizi, setGizi] = useState(DEFAULT_GIZI);
  const [hasil, setHasil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorFields, setErrorFields] = useState([]);

  const isPriority = (field) => REQUIRED_FIELDS[fitur]?.some((r) => r.field === field);
  const isError = (field) => errorFields.includes(field);

  const handleGiziChange = (field, value) => {
    setGizi((prev) => ({ ...prev, [field]: value }));
    if (errorFields.includes(field)) {
      setErrorFields((prev) => prev.filter((f) => f !== field));
    }
  };

  const handleAnalisis = async () => {
    if (!usia || !beratBadan || !tinggiBadan || !jenisKelamin || !aktivitas) {
      alert("Lengkapi semua data diri terlebih dahulu!");
      return;
    }

    const required = REQUIRED_FIELDS[fitur] || [];
    const emptyRequired = required.filter((r) => !gizi[r.field] && gizi[r.field] !== 0);

    if (emptyRequired.length > 0) {
      setErrorFields(emptyRequired.map((r) => r.field));
      const labels = emptyRequired.map((r) => r.label).join(", ");
      alert(`Program "${fitur}" membutuhkan field berikut: ${labels}`);
      return;
    }

    setErrorFields([]);
    setIsLoading(true);
    setHasil(null);

    const prompt = buildPrompt(fitur, { usia, beratBadan, tinggiBadan, jenisKelamin, aktivitas }, gizi);


    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }], mode: "kalkulator" }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || data.content?.[0]?.text || "";

      if (!text || text.trim() === "") {
        throw new Error("AI mengembalikan response kosong. Coba lagi.");
      }

      // Robust JSON extraction: handle markdown code blocks and extra text
      let clean = text;
      // Remove markdown code fences (```json ... ``` or ``` ... ```)
      clean = clean.replace(/```(?:json)?\s*/gi, "").replace(/```/g, "").trim();

      // If there's extra text around the JSON, try to extract just the JSON object
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        clean = jsonMatch[0];
      } else {
        throw new Error("AI response tidak mengandung JSON valid. Raw: " + text.slice(0, 200));
      }

      const parsed = JSON.parse(clean);
      setHasil(parsed);
    } catch (err) {
      setHasil({
        status: "Error",
        skor: 0,
        penjelasan: [err.message || "Terjadi kesalahan saat menganalisis.", "Silakan coba lagi — model AI mungkin sedang sibuk."],
        kalkulasi: [],
        totalNilaiGizi: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasil(null);
    setGizi(DEFAULT_GIZI);
    setErrorFields([]);
    setUsia(""); setBeratBadan(""); setTinggiBadan("");
    setJenisKelamin(""); setAktivitas("");
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Navbar />
      <div className="px-4 lg:px-10 pt-6 pb-10">
        <div className="flex gap-6 items-start">
          <Sidebar />

          <div className="flex-1 flex flex-col gap-6 min-w-0">

            {/* HEADER */}
            <div className="bg-white rounded-2xl px-6 lg:px-8 pt-6 lg:pt-8 pb-4 shadow-sm">
              <h1 className="text-2xl lg:text-3xl font-extrabold" style={potta}>Kalkulator Gizi</h1>
              <p className="text-gray-500 mt-1 text-sm" style={patua}>Isi data diri Anda untuk menghitung kebutuhan gizi harian</p>
            </div>

            {/* FORM AREA */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* DATA DIRI */}
              <div className="bg-white rounded-2xl p-6 shadow-sm w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
                <div>
                  <p className="text-green-500 font-bold text-base flex items-center gap-2" style={potta}><span>❖</span> Data Diri</p>
                  <p className="text-xs text-gray-400 mt-1" style={patua}>Masukkan data diri Anda!</p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap" style={patua}>Usia (thn)</label>
                  <input type="number" value={usia} onChange={(e) => setUsia(e.target.value)} placeholder="0"
                    style={patua} className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-green-400" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap" style={patua}>Berat Badan (Kg)</label>
                  <input type="number" value={beratBadan} onChange={(e) => setBeratBadan(e.target.value)} placeholder="0"
                    style={patua} className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-green-400" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-semibold text-gray-700 whitespace-nowrap" style={patua}>Tinggi Badan (cm)</label>
                  <input type="number" value={tinggiBadan} onChange={(e) => setTinggiBadan(e.target.value)} placeholder="0"
                    style={patua} className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-green-400" />
                </div>

                <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)}
                  style={patua} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 bg-white">
                  <option value="">Jenis Kelamin</option>
                  {JENIS_KELAMIN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>

                <select value={aktivitas} onChange={(e) => setAktivitas(e.target.value)}
                  style={patua} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 bg-white">
                  <option value="">Aktivitas</option>
                  {AKTIVITAS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>

                <select value={fitur} onChange={(e) => { setFitur(e.target.value); setHasil(null); setErrorFields([]); }}
                  style={patua} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 bg-white">
                  {FITUR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>

                {/* INFO PROGRAM */}
                <div className={`rounded-xl p-3 text-xs ${fitur === "Umum" ? "bg-gray-50 text-gray-500" : "bg-green-50 text-green-700"}`} style={patua}>
                  <p className="font-bold mb-1" style={potta}>{fitur}</p>
                  <p>{PROGRAM_DESC[fitur]}</p>
                  {fitur !== "Umum" && (
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="font-semibold">Field wajib:</p>
                      {REQUIRED_FIELDS[fitur].map((r) => (
                        <p key={r.field} className={`flex items-center gap-1 ${isError(r.field) ? "text-red-500 font-semibold" : ""}`}>
                          <span>{isError(r.field) ? "❌" : "✅"}</span> {r.label}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {aktivitas && (
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-green-600 font-bold mb-2" style={potta}>Keterangan Aktivitas</p>
                    {Object.entries(KETERANGAN_AKTIVITAS).map(([k, v]) => (
                      <p key={k} className="text-xs text-gray-600" style={patua}><span className="font-semibold">{k}</span> : {v}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* KANDUNGAN GIZI */}
              <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 min-w-0">
                <div className="mb-4">
                  <p className="text-green-500 font-bold text-base flex items-center gap-2" style={potta}><span>❖</span> Kandungan Gizi Makanan</p>
                  <p className="text-xs text-gray-400 mt-1" style={patua}>
                    Masukkan kandungan gizi dari makanan yang ingin dianalisis (per porsi / kemasan)
                    {fitur !== "Umum" && <span className="text-red-400 ml-1">— Field bertanda * wajib diisi</span>}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* KARBOHIDRAT */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("karbohidratTotal") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Karbohidrat Total{isPriority("karbohidratTotal") ? "*" : ""}
                      {isError("karbohidratTotal") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="karbohidratTotal" satuan="g" placeholder="250-300" gizi={gizi} onChange={handleGiziChange} isError={isError("karbohidratTotal")} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Sederhana</p><GiziInput field="karbohidratSederhana" satuan="g" placeholder="250-300" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Kompleks</p><GiziInput field="karbohidratKompleks" satuan="g" placeholder="250-300" gizi={gizi} onChange={handleGiziChange} /></div>
                    </div>
                  </div>

                  {/* MINERAL */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("mineral") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Mineral{isPriority("mineral") ? "*" : ""}
                      {isError("mineral") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="mineral" satuan="mg" placeholder="100" gizi={gizi} onChange={handleGiziChange} isError={isError("mineral")} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Makro</p><GiziInput field="mineralMakro" satuan="mg" placeholder="100" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Mikro</p><GiziInput field="mineralMikro" satuan="mg" placeholder="100" gizi={gizi} onChange={handleGiziChange} /></div>
                    </div>
                  </div>

                  {/* LEMAK */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("lemakTotal") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Lemak Total{isPriority("lemakTotal") ? "*" : ""}
                      {isError("lemakTotal") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="lemakTotal" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} isError={isError("lemakTotal")} />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className={`text-xs mb-1 ${isPriority("lemakJenuh") ? "text-green-500 font-semibold" : "text-gray-500"}`} style={patua}>
                          Jenuh{isPriority("lemakJenuh") ? "*" : ""}
                          {isError("lemakJenuh") && <span className="text-red-400 ml-1">!</span>}
                        </p>
                        <GiziInput field="lemakJenuh" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} isError={isError("lemakJenuh")} />
                      </div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Tak jenuh</p><GiziInput field="lemakTakJenuh" satuan="g" placeholder="30-40" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div>
                        <p className={`text-xs mb-1 ${isPriority("lemakTrans") ? "text-green-500 font-semibold" : "text-gray-500"}`} style={patua}>
                          Trans{isPriority("lemakTrans") ? "*" : ""}
                          {isError("lemakTrans") && <span className="text-red-400 ml-1">!</span>}
                        </p>
                        <GiziInput field="lemakTrans" satuan="g" placeholder="0-2" gizi={gizi} onChange={handleGiziChange} isError={isError("lemakTrans")} />
                      </div>
                    </div>
                  </div>

                  {/* NATRIUM */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-1" style={potta}>Natrium</p>
                    <GiziInput field="natrium" satuan="mg" placeholder="100" gizi={gizi} onChange={handleGiziChange} />
                  </div>

                  {/* GULA */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("gula") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Gula{isPriority("gula") ? "*" : ""}
                      {isError("gula") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="gula" satuan="g" placeholder="5-10" gizi={gizi} onChange={handleGiziChange} isError={isError("gula")} />
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Laktosa</p><GiziInput field="gulaLaktosa" satuan="g" placeholder="5-10" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Glukosa</p><GiziInput field="gulaGlukosa" satuan="g" placeholder="5-10" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Fruktosa</p><GiziInput field="gulaFruktosa" satuan="g" placeholder="5-10" gizi={gizi} onChange={handleGiziChange} /></div>
                    </div>
                  </div>

                  {/* KALORI */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("kalori") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Kalori{isPriority("kalori") ? "*" : ""}
                      {isError("kalori") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="kalori" satuan="kcal" placeholder="100" gizi={gizi} onChange={handleGiziChange} isError={isError("kalori")} />
                  </div>

                  {/* PROTEIN */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("protein") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Protein{isPriority("protein") ? "*" : ""}
                      {isError("protein") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="protein" satuan="g" placeholder="15-25" gizi={gizi} onChange={handleGiziChange} isError={isError("protein")} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Hewani</p><GiziInput field="proteinHewani" satuan="g" placeholder="15-25" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Nabati</p><GiziInput field="proteinNabati" satuan="g" placeholder="15-25" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Kompleks</p><GiziInput field="proteinKompleks" satuan="g" placeholder="15-25" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Sederhana</p><GiziInput field="proteinSederhana" satuan="g" placeholder="15-25" gizi={gizi} onChange={handleGiziChange} /></div>
                    </div>
                  </div>

                  {/* SERAT */}
                  <div>
                    <p className={`text-sm font-bold mb-1 ${isPriority("serat") ? "text-green-500" : "text-gray-700"}`} style={potta}>
                      Serat{isPriority("serat") ? "*" : ""}
                      {isError("serat") && <span className="text-red-400 text-xs ml-1">wajib diisi!</span>}
                    </p>
                    <GiziInput field="serat" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} isError={isError("serat")} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Hemiselulosa</p><GiziInput field="seratHemiselulosa" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Selulosa</p><GiziInput field="seratSelulosa" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Lignin</p><GiziInput field="seratLignin" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Pektrim</p><GiziInput field="seratPektrim" satuan="g" placeholder="2-5" gizi={gizi} onChange={handleGiziChange} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TOMBOL ANALISIS */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-green-500 font-bold text-sm mb-3" style={potta}>❖ Analisis</p>
              <button onClick={handleAnalisis} disabled={isLoading}
                style={patua} className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 transition text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="ml-2">Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                    </svg>
                    Analisis Sekarang
                  </>
                )}
              </button>
            </div>

            {/* HASIL ANALISIS */}
            {hasil && !isLoading && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-green-500 font-bold text-lg mb-4 text-center" style={potta}>Hasil Analisis</h2>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* TABEL KALKULASI */}
                  <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 border-b border-gray-100">
                      <div className="p-3 font-bold text-sm text-gray-700 border-r border-gray-100" style={potta}>Informasi Nilai Gizi</div>
                      <div className="p-3 font-bold text-sm text-gray-700" style={potta}>Hasil</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="border-r border-gray-100 p-3 flex flex-col gap-2">
                        {hasil.kalkulasi?.map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-gray-700" style={patua}>{item.label}</span>
                              <span className="text-gray-500" style={patua}>{item.nilai} <span className="text-gray-400">{item.satuan}</span></span>
                            </div>
                            {item.sub?.map((s, j) => (
                              <div key={j} className="flex justify-between text-xs pl-3 text-gray-400 mt-0.5" style={patua}>
                                <span>{s.label}</span><span>{s.nilai} {s.satuan}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <div className="p-3 flex items-center justify-center">
                        <span className="text-4xl lg:text-5xl font-extrabold text-gray-800" style={potta}>{hasil.totalNilaiGizi}</span>
                      </div>
                    </div>
                  </div>

                  {/* STATUS, SKOR, PENJELASAN */}
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className={`${statusConfig[hasil.status]?.bg || "bg-gray-50"} rounded-xl p-4 flex flex-col items-center justify-center gap-2`}>
                        <p className="text-xs text-gray-500 font-semibold" style={patua}>Status</p>
                        <span className="text-3xl">{statusConfig[hasil.status]?.icon || "✅"}</span>
                        <p className={`text-xs font-bold text-center ${statusConfig[hasil.status]?.color || "text-green-600"}`} style={patua}>{hasil.status}</p>
                        {hasil.statusLabel && (
                          <p className="text-[10px] text-gray-400 font-medium text-center" style={patua}>{hasil.statusLabel}</p>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center gap-1">
                        <p className="text-xs text-gray-500 font-semibold" style={patua}>Skor</p>
                        <p className="text-2xl font-extrabold text-green-500" style={potta}>{hasil.skor} <span className="text-gray-400 text-base">/ 10</span></p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 font-semibold mb-2" style={potta}>Penjelasan</p>
                        <div className="flex flex-col gap-1.5">
                          {hasil.penjelasan?.map((p, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <span className="text-green-500 text-xs mt-0.5">✅</span>
                              <span className="text-xs text-gray-600" style={patua}>{p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* HASIL KALKULASI ANTARA */}
                    {hasil.hasilKalkulasi && typeof hasil.hasilKalkulasi === "object" && (
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs text-green-600 font-bold mb-2" style={potta}>📊 Detail Kalkulasi</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(hasil.hasilKalkulasi).map(([key, val]) => (
                            <div key={key} className="flex justify-between text-xs" style={patua}>
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                              <span className="text-gray-800 font-semibold">{typeof val === "number" ? val.toLocaleString("id-ID", { maximumFractionDigits: 2 }) : String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                      <span className="text-green-500 text-sm mt-0.5">ℹ️</span>
                      <p className="text-xs text-gray-500" style={patua}>Skor dihitung berdasarkan aturan evaluasi program {fitur} sesuai flow NutriCheck</p>
                    </div>
                    <button onClick={handleReset} style={patua}
                      className="w-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-bold py-2.5 rounded-xl text-sm">
                      Reset & Analisis Ulang
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}