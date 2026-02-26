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
    <div className="relative w-full min-h-[500px] bg-gradient-to-r from-indigo-5 via-white to-pink-50 rounded-3xl overflow-hidden flex items-center 
    justify-between px-6 md:px-16"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between w-full gap-10"
        >
          
          <div className="max-w-xl space-y-6 text-center md:text-left">

            <span className="inline-block bg-red-500 text-white text-sm px-4 py-1 rounded-full shadow-md">
              {product.discount}% OFF
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {product.name}
            </h2>

            <p className="text-gray-600 text-lg">
              Discover premium quality and best deals
              only for you.
            </p>

            <div className="flex items-center gap-6 justify-center md:justify-start">
              <span className="text-3xl font-bold text-green-600">
                ₹{product.price}
              </span>

              <button className="bg-black text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Shop Now
              </button>
            </div>
          </div>

         
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-72 md:h-96 object-contain drop-shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </AnimatePresence>

    
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {heroProducts.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
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