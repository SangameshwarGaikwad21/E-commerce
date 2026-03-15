"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { addToCart } from "@/redux/fetures/cartSlice";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const { products, loading, error } =
    useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  if (loading)
    return (
      <p className="text-center text-lg">
        Loading products...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );

  return (
  <section className="relative py-28 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">

  {/* Background Glow Effects */}
  <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full"></div>
  <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500/20 blur-[120px] rounded-full"></div>

  <div className="max-w-7xl mx-auto px-6 relative z-10">

    {/* HEADER */}
    <div className="mb-20 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
        Featured Collection
      </h2>

      <p className="text-slate-400 mt-4 text-lg">
        Premium products crafted for performance.
      </p>
    </div>


   
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

      {products.map((item: any) => (

        <motion.div
  key={item._id}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  viewport={{ once: true }}
  className="group cursor-pointer"
  onClick={() => handleProductClick(item._id)}
>
  <div className="relative rounded-3xl bg-white/80 backdrop-blur border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">

    {/* IMAGE AREA */}
    <div className="relative h-72 flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden">

      <img
        src={item?.images?.[0] || "/no-product.png"}
        alt={item.title}
        className="h-56 object-contain transition-transform duration-500 group-hover:scale-110"
      />

      {/* DISCOUNT BADGE */}
      {item.discount > 0 && (
        <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow">
          {item.discount}% OFF
        </span>
      )}

      {/* HOVER ACTION */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">

        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold shadow hover:scale-105 transition">
          View Product
        </button>

      </div>
    </div>

    {/* CONTENT */}
    <div className="p-6 space-y-4">

      <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
        {item.title}
      </h3>

      <p className="text-sm text-slate-500 line-clamp-2">
        {item.description}
      </p>

    
      <div className="flex text-yellow-400 text-sm">
        ★★★★☆
      </div>

      {/* PRICE */}
      <div className="flex items-center justify-between pt-2">

        <div className="flex items-center gap-3">

          <span className="text-xl font-bold text-slate-900">
            ₹{item.price}
          </span>

          {item.discount > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ₹{Math.round(item.price / (1 - item.discount / 100))}
            </span>
          )}

        </div>

      </div>
    </div>
  </div>
</motion.div>
      ))}
    </div>
  </div>
</section>
  );
};

export default ProductList;