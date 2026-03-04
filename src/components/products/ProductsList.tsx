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
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight">
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
              className="group"
            >
              <div className="relative rounded-3xl bg-slate-800 border border-slate-700 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-slate-500">
             
                <div className="relative h-72 flex items-center justify-center bg-slate-950 overflow-hidden">
                  <img
                     src={item?.images?.[0] || "/no-product.png"}
                      alt={item.title}
                      className="h-56 object-contain transition-transform duration-500 group-hover:scale-105"
                  />
              
                  {item.discount > 0 && (
                    <span className="absolute top-5 left-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-4 py-1 rounded-full shadow-lg tracking-wide">
                      {item.discount}% OFF
                    </span>
                  )}
                </div>  
                <div className="p-7 space-y-4">
                  <h3 className="text-xl font-semibold text-white line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-2xl font-semibold text-white">
                        ₹{item.price}
                      </span>
                      {item.discount > 0 && (
                        <div className="text-sm text-slate-500 line-through mt-1">
                          ₹{Math.round(
                            item.price / (1 - item.discount / 100)
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (!session) {
                        router.push("/login");
                        return;
                      }
                        dispatch(
                          addToCart({
                            id: item._id,
                            title: item.title,
                            price: Number(item.price),
                            image:
                              item.images?.[0] ||
                              "/placeholder.png",
                          })
                        );
                      }}
                      className="px-5 py-2 rounded-full bg-white text-slate-900 text-sm font-medium hover:bg-gray-200 transition-all duration-300 active:scale-95"
                    >
                      Add To Cart
                    </button>
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