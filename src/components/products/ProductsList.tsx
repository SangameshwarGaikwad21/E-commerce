"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { motion } from "framer-motion";

const ProductList = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { products, loading, error } =
    useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  // 🔹 Loading Skeleton UI
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400 text-lg animate-pulse">
          Loading premium products...
        </p>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 py-20">{error}</p>
    );

  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden">

      {/* 🔥 Gradient Glow Background */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-pink-600/20 blur-[140px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* 🔹 Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Featured Collection
          </h2>
          <p className="text-slate-400 mt-4 text-lg">
            Explore premium curated products ✨
          </p>
        </div>

        {/* 🔹 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {products.map((item: any) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              onClick={() => handleProductClick(item._id)}
              className="group cursor-pointer"
            >

              {/* 🔥 Glass Card */}
              <div className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-3">

                {/* IMAGE */}
                <div className="relative h-72 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">

                  <img
                    src={item?.images?.[0] || "/no-product.png"}
                    alt={item.title}
                    className="h-56 object-contain transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* DISCOUNT BADGE */}
                  {item.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-6 space-y-3">

                  {/* TITLE */}
                  <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-purple-400 transition">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {item.description}
                  </p>

                  {/* RATING */}
                  <div className="flex text-yellow-400 text-sm tracking-wide">
                    ★★★★☆
                  </div>

                  {/* PRICE */}
                  <div className="flex items-center gap-3 pt-2">

                    <span className="text-xl font-bold text-white">
                      ₹{item.price}
                    </span>

                    {item.discount > 0 && (
                      <span className="text-sm text-slate-500 line-through">
                        ₹{Math.round(
                          item.price / (1 - item.discount / 100)
                        )}
                      </span>
                    )}
                  </div>

                </div>

                {/* 🔥 Hover Gradient Border Effect */}
                <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-500/40 transition"></div>

              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;