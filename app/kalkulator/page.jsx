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

// Field wajib per program + label untuk pesan error
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

// Deskripsi tiap program
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

const potta = { fontFamily: "var(--font-potta-one)" };
const patua = { fontFamily: "var(--font-patua-one)" };

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
    // Hapus error field saat user mulai isi
    if (errorFields.includes(field)) {
      setErrorFields((prev) => prev.filter((f) => f !== field));
    }
  };

  const handleAnalisis = async () => {
    if (!usia || !beratBadan || !tinggiBadan || !jenisKelamin || !aktivitas) {
      alert("Lengkapi semua data diri terlebih dahulu!");
      return;
    }

    // Validasi field wajib per program
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

    const prompt = `
Kamu adalah ahli gizi yang menggunakan standar AKG (Angka Kecukupan Gizi) Kemenkes Indonesia.

Data pengguna:
- Usia: ${usia} tahun
- Berat Badan: ${beratBadan} kg
- Tinggi Badan: ${tinggiBadan} cm
- Jenis Kelamin: ${jenisKelamin}
- Intensitas Aktivitas: ${aktivitas} (${KETERANGAN_AKTIVITAS[aktivitas]})
- Program/Fitur: ${fitur}

Kandungan gizi makanan yang dikonsumsi (per porsi/kemasan):
- Kalori: ${gizi.kalori || 0} kcal
- Karbohidrat Total: ${gizi.karbohidratTotal || 0} g (Sederhana: ${gizi.karbohidratSederhana || 0}g, Kompleks: ${gizi.karbohidratKompleks || 0}g)
- Lemak Total: ${gizi.lemakTotal || 0} g (Jenuh: ${gizi.lemakJenuh || 0}g, Tak Jenuh: ${gizi.lemakTakJenuh || 0}g, Trans: ${gizi.lemakTrans || 0}g)
- Gula: ${gizi.gula || 0} g (Laktosa: ${gizi.gulaLaktosa || 0}g, Glukosa: ${gizi.gulaGlukosa || 0}g, Fruktosa: ${gizi.gulaFruktosa || 0}g)
- Protein: ${gizi.protein || 0} g (Hewani: ${gizi.proteinHewani || 0}g, Nabati: ${gizi.proteinNabati || 0}g, Kompleks: ${gizi.proteinKompleks || 0}g, Sederhana: ${gizi.proteinSederhana || 0}g)
- Serat: ${gizi.serat || 0} g (Hemiselulosa: ${gizi.seratHemiselulosa || 0}g, Selulosa: ${gizi.seratSelulosa || 0}g, Lignin: ${gizi.seratLignin || 0}g, Pektrim: ${gizi.seratPektrim || 0}g)
- Mineral: ${gizi.mineral || 0} g (Makro: ${gizi.mineralMakro || 0}g, Mikro: ${gizi.mineralMikro || 0}g)
- Natrium: ${gizi.natrium || 0} mg

Analisis apakah kandungan gizi ini sesuai untuk program "${fitur}" berdasarkan standar AKG Kemenkes Indonesia dan kondisi pengguna.

Berikan respons HANYA dalam format JSON berikut, tanpa teks lain:
{
  "status": "Makanan Sehat" atau "Perlu Perhatian" atau "Tidak Direkomendasikan",
  "skor": angka dari 1 sampai 10 dengan 1 desimal,
  "penjelasan": ["poin 1", "poin 2", "poin 3", "poin 4"],
  "kalkulasi": [
    {"label": "Kalori", "nilai": "${gizi.kalori || 0}", "satuan": "kcal"},
    {"label": "Karbohidrat Total", "nilai": "${gizi.karbohidratTotal || 0}", "satuan": "g", "sub": [{"label": "Sederhana", "nilai": "${gizi.karbohidratSederhana || 0}", "satuan": "g"}, {"label": "Kompleks", "nilai": "${gizi.karbohidratKompleks || 0}", "satuan": "g"}]},
    {"label": "Gula", "nilai": "${gizi.gula || 0}", "satuan": "g", "sub": [{"label": "Glukosa", "nilai": "${gizi.gulaGlukosa || 0}", "satuan": "g"}, {"label": "Fruktosa", "nilai": "${gizi.gulaFruktosa || 0}", "satuan": "g"}]},
    {"label": "Protein", "nilai": "${gizi.protein || 0}", "satuan": "g", "sub": [{"label": "Nabati", "nilai": "${gizi.proteinNabati || 0}", "satuan": "g"}, {"label": "Kompleks", "nilai": "${gizi.proteinKompleks || 0}", "satuan": "g"}]},
    {"label": "Mineral", "nilai": "${gizi.mineral || 0}", "satuan": "g", "sub": [{"label": "Makro", "nilai": "${gizi.mineralMakro || 0}", "satuan": "g"}, {"label": "Mikro", "nilai": "${gizi.mineralMikro || 0}", "satuan": "g"}]}
  ],
  "totalNilaiGizi": angka total kalkulasi gizi
}
    `.trim();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setHasil(parsed);
    } catch {
      setHasil({ status: "Error", skor: 0, penjelasan: ["Terjadi kesalahan saat menganalisis."], kalkulasi: [], totalNilaiGizi: 0 });
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
      <div className="px-6 lg:px-10 pt-6 pb-10">
        <div className="flex gap-6 items-start">
          <Sidebar />
          <div className="flex-1 flex flex-col gap-6">

            {/* HEADER */}
            <div className="bg-white rounded-2xl px-8 pt-8 pb-4 shadow-sm">
              <h1 className="text-3xl font-extrabold" style={potta}>Karkulator Gizi</h1>
              <p className="text-gray-500 mt-1" style={patua}>Isi data diri Anda untuk menghitung kebutuhan gizi harian</p>
            </div>

            {/* FORM AREA */}
            <div className="flex gap-6">
              {/* KIRI - DATA DIRI */}
              <div className="bg-white rounded-2xl p-6 shadow-sm w-72 flex flex-col gap-4">
                <div>
                  <p className="text-green-500 font-bold text-base flex items-center gap-2" style={potta}><span>❖</span> Data Diri</p>
                  <p className="text-xs text-gray-400 mt-1" style={patua}>Masukkan data diri Anda!</p>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700" style={patua}>Usia (thn)</label>
                  <input type="number" value={usia} onChange={(e) => setUsia(e.target.value)} placeholder="0"
                    style={patua} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700" style={patua}>Berat Badan (Kg)</label>
                  <input type="number" value={beratBadan} onChange={(e) => setBeratBadan(e.target.value)} placeholder="0"
                    style={patua} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700" style={patua}>Tinggi Badan (cm)</label>
                  <input type="number" value={tinggiBadan} onChange={(e) => setTinggiBadan(e.target.value)} placeholder="0"
                    style={patua} className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-green-400" />
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

              {/* KANAN - KANDUNGAN GIZI */}
              <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
                <div className="mb-4">
                  <p className="text-green-500 font-bold text-base flex items-center gap-2" style={potta}><span>❖</span> Kandungan Gizi Makanan</p>
                  <p className="text-xs text-gray-400 mt-1" style={patua}>
                    Masukkan kandungan gizi dari makanan yang ingin dianalisis (per porsi / kemasan)
                    {fitur !== "Umum" && <span className="text-red-400 ml-1">— Field bertanda * wajib diisi</span>}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
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
                    <GiziInput field="mineral" satuan="g" placeholder="100" gizi={gizi} onChange={handleGiziChange} isError={isError("mineral")} />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Makro</p><GiziInput field="mineralMakro" satuan="g" placeholder="100" gizi={gizi} onChange={handleGiziChange} /></div>
                      <div><p className="text-xs text-gray-500 mb-1" style={patua}>Mikro</p><GiziInput field="mineralMikro" satuan="g" placeholder="100" gizi={gizi} onChange={handleGiziChange} /></div>
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
                    <GiziInput field="natrium" satuan="g" placeholder="100" gizi={gizi} onChange={handleGiziChange} />
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
                <div className="flex gap-6">
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
                        <span className="text-5xl font-extrabold text-gray-800" style={potta}>{hasil.totalNilaiGizi}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`${statusConfig[hasil.status]?.bg || "bg-gray-50"} rounded-xl p-4 flex flex-col items-center justify-center gap-2`}>
                        <p className="text-xs text-gray-500 font-semibold" style={patua}>Status</p>
                        <span className="text-3xl">{statusConfig[hasil.status]?.icon || "✅"}</span>
                        <p className={`text-xs font-bold text-center ${statusConfig[hasil.status]?.color || "text-green-600"}`} style={patua}>{hasil.status}</p>
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
                    <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                      <span className="text-green-500 text-sm mt-0.5">ℹ️</span>
                      <p className="text-xs text-gray-500" style={patua}>Skor dihitung berdasarkan keseimbangan zat gizi sesuai kebutuhan tubuh dan pedoman gizi seimbang</p>
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