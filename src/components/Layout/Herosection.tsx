"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroProducts } from "@/utils/data";

const Herosection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const product = heroProducts[index];

  return (
    <div className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-100 rounded-3xl overflow-hidden">

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl w-full px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12"
        >
          {/* LEFT CONTENT */}
          <div className="max-w-xl space-y-6 text-center md:text-left">

            {/* Discount Badge */}
            <span className="inline-block bg-black text-white text-xs tracking-wider px-4 py-1 rounded-full">
              {product.discount}% OFF
            </span>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg">
              Premium quality products designed to match
              your style and performance needs.
            </p>

            {/* Price + Button */}
            <div className="flex items-center gap-6 justify-center md:justify-start">

              <span className="text-3xl font-semibold text-gray-900">
                ₹{product.price}
              </span>

              <button className="px-7 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition-all duration-300">
                Shop Now
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-72 md:h-96 object-contain drop-shadow-xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
        {heroProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === i
                ? "bg-black scale-125"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Herosection;