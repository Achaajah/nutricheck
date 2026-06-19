import Sidebar from "./components/sidebar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FoodCard from "./components/FoodCard";
import FloatingAI from "./components/FloatingAI";

export default function Home() {
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

  return (
    <div className="bg-[#f3f4f6] min-h-screen">
      <Navbar />
      <div className="px-6 lg:px-10 pt-6">
        <div className="flex gap-6 items-start">
          <Sidebar />
          <div className="flex-1 flex flex-col gap-6">
            <Hero />
            <h2 className="text-3xl font-extrabold">Makanan & Minuman</h2>
            <div className="grid grid-cols-3 gap-6">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <FloatingAI />
    </div>
  );
}