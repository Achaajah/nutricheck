import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";

export default function InformasiPage() {
  const manfaatGizi = [
    "Memberikan energi untuk aktivitas sehari-hari",
    "Mendukung pertumbuhan dan perkembangan tubuh",
    "Membantu menjaga daya tahan tubuh",
    "Menjaga fungsi organ tetap optimal",
  ];

  const nutrisi = [
    {
      nama: "Karbohidrat",
      icon: "🌾",
      deskripsi: "Sumber energi utama yang digunakan tubuh untuk beraktivitas",
    },
    {
      nama: "Protein",
      icon: "🥩",
      deskripsi: "Membantu pembentukan dan perbaikan jaringan tubuh.",
    },
    {
      nama: "Lemak",
      icon: "🥑",
      deskripsi: "Cadangan energi dan membantu penyerapan vitamin",
    },
    {
      nama: "Serat",
      icon: "🥦",
      deskripsi: "Membantu menjaga kesehatan sistem pencernaan.",
    },
  ];

  const tips = [
    "Konsumsi makanan bergizi seimbang",
    "Perbanyak sayur dan buah",
    "Batasi makanan tinggi gula dan garam",
    "Minum air putih yang cukup",
    "Lakukan aktivitas fisik secara teratur",
  ];

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTAINER */}
      <div className="px-6 lg:px-10 pt-6">
        <div className="flex gap-6 items-start">
          {/* SIDEBAR */}
          <Sidebar />

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-8">

            {/* APA ITU GIZI */}
            <section>
              <h2 className="text-green-500 font-bold text-lg mb-3">
                Apa Itu Gizi ?
              </h2>
              <p className="text-gray-800 font-semibold text-base leading-relaxed">
                Gizi adalah zat yang terkandung dalam makanan dan minuman yang
                dibutuhkan tubuh untuk menghasilkan energi, mendukung pertumbuhan,
                <br />
                memperbaiki jaringan tubuh, serta menjaga kesehatan.
              </p>
            </section>

            {/* MANFAAT GIZI */}
            <section className="bg-[#f0faf3] rounded-2xl p-6 flex gap-8 items-start">
              <div className="min-w-[140px]">
                <p className="text-green-500 font-bold text-base leading-snug">
                  Manfaat Gizi
                  <br />
                  Bagi Tubuh
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-4 flex-1">
                {manfaatGizi.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 text-xl mt-0.5">💙</span>
                    <p className="text-gray-800 font-semibold text-sm leading-snug">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* KARTU NUTRISI */}
            <section className="grid grid-cols-4 gap-4">
              {nutrisi.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex flex-col items-center text-center gap-3"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <p className="font-bold text-gray-800 text-sm">{item.nama}</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    {item.deskripsi}
                  </p>
                </div>
              ))}
            </section>

            {/* TIPS + MOTIVASI */}
            <section className="flex gap-6 items-stretch">
              {/* Tips */}
              <div className="bg-green-500 rounded-2xl p-6 flex-1 text-white">
                <p className="font-bold text-base mb-3">Tips Pola Makan Sehat</p>
                <ul className="flex flex-col gap-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Motivasi */}
              <div className="flex-1 flex flex-col justify-center items-start gap-4 px-2">
                <span className="text-4xl">💙</span>
                <p className="text-gray-800 font-bold text-xl leading-snug">
                  Mulailah memilih makanan dengan kandungan gizi yang baik untuk
                  mendukung kesehatan tubuh
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}