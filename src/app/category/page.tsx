"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Mobiles", icon: "📱", slug: "mobiles" },
  { name: "Laptops", icon: "💻", slug: "laptops" },
  { name: "Fashion", icon: "👕", slug: "fashion" },
  { name: "Electronics", icon: "🎧", slug: "electronics" },
  { name: "Home", icon: "🏠", slug: "home" },
  { name: "Appliances", icon: "🧊", slug: "appliances" },
];

const Category = () => {
  const router = useRouter(); 

  return (
    <section className="bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-purple-500/40 transition"
              onClick={() => router.push(`/category/${cat.slug}`)}
            >
              <div className="text-2xl mb-1">
                {cat.icon}
              </div>

              <h3 className="text-xs text-white font-medium">
                {cat.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;