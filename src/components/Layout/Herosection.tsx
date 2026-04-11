"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-40"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Upgrade Your Style <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              Premium Products
            </span>
          </h1>

          <p className="text-gray-400 text-lg">
            Discover the best collection of high-quality products at unbeatable prices.
            Designed for performance. Built for you.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-lg"
            >
              Shop Now 🛒
            </button>

            <button
              onClick={() => router.push("/category")}
              className="border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Explore
            </button>
          </div>
          <div className="flex items-center gap-4 pt-4 text-sm text-gray-400">
            <span>⭐ 4.8 Rating</span>
            <span>•</span>
            <span>10k+ Customers</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <img
            src="/Watch.jpg"
            alt="Product"
            className="w-[350px] md:w-[500px] object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection