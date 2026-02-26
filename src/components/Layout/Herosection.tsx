"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroProducts } from "@/utils/data";

const Herosection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroProducts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const product = heroProducts[index];

  return (
    <div className="relative w-full h-[400px] bg-white rounded-2xl overflow-hidden flex items-center justify-between px-10">

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="flex w-full items-center justify-between"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4">
              {product.name}
            </h2>

            <p className="text-2xl text-red-500 font-semibold mb-4">
              {product.discount}% OFF
            </p>

            <p className="text-xl mb-6">
              ₹{product.price}
            </p>

            <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800">
              Shop Now
            </button>
          </div>

          <img
            src={product.image}
            className="h-80 object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Herosection;