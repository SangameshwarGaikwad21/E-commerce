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
   <section className="bg-slate-50 py-28">
  <div className="max-w-7xl mx-auto px-6">

    {/* HEADER */}
    <div className="mb-20 text-center">
      <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
        Featured Collection
      </h2>

      <p className="text-slate-500 mt-4 text-lg">
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

        
          <div className="relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">

          
            <div className="relative h-72 flex items-center justify-center bg-slate-100 overflow-hidden">

              <img
                src={item?.images?.[0] || "/no-product.png"}
                alt={item.title}
                className="h-56 object-contain transition-transform duration-500 group-hover:scale-110"
              />

             
              {item.discount > 0 && (
                <span className="absolute top-5 left-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-4 py-1 rounded-full shadow-md tracking-wide">
                  {item.discount}% OFF
                </span>
              )}

              {/* HOVER ACTIONS */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">

                <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium shadow hover:scale-105 transition">
                  View
                </button>

              </div>

            </div>

           
            <div className="p-7 space-y-4">

              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 line-clamp-2">
                {item.description}
              </p>

            
              <div className="flex text-yellow-400 text-sm">
                ★★★★☆
              </div>
              <div className="flex items-center justify-between pt-2">

                <div className="flex items-center gap-3">

                  <span className="text-2xl font-semibold text-gray-900">
                    ₹{item.price}
                  </span>

                  {item.discount > 0 && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{Math.round(
                        item.price / (1 - item.discount / 100)
                      )}
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