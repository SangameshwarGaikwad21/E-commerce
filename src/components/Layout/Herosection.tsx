"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function HeroSection({ products }: any) {
  const router = useRouter();

  return (
    <section className="relative w-full h-screen overflow-hidden text-white">
      
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src="/products.jpeg" // 👈 put your image in public folder
          className="w-full h-full object-cover"
          alt="hero"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full h-full flex items-center px-6 md:px-16">
        
        <div className="grid md:grid-cols-2 gap-10 w-full items-center">

          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover Premium <br />
              <span className="text-purple-400">Products</span>
            </h1>

            <p className="text-gray-300">
              Shop the latest collection with best quality and unbeatable prices.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => router.push("/product")}
                className="bg-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
              >
                Shop Now 🛒
              </button>

              <button className="border border-white/30 px-6 py-3 rounded-xl hover:bg-white/10 transition">
                Explore
              </button>
            </div>
          </motion.div>

          {/* RIGHT PRODUCT CARDS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {products?.slice(0, 4).map((product: any, index: number) => (
              <div
                key={product._id}
                className={`bg-white/10 backdrop-blur-md p-3 rounded-xl ${
                  index === 0 ? "col-span-2" : ""
                }`}
              >
                <img
                  src={product.images[0]}
                  className="w-full h-28 md:h-36 object-cover rounded-lg"
                />

                <h3 className="text-sm mt-2">{product.title}</h3>
                <p className="text-green-400 font-bold text-sm">
                  ₹{product.price}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;