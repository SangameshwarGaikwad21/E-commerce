"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { motion } from "framer-motion";

const normalize = (value?: string) => value?.toLowerCase().trim() || "";

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";

  const filteredProducts = useMemo(() => {
    const query = normalize(search);

    return products.filter((product) => {
      const matchesSearch =
        normalize(product.title).includes(query) ||
        normalize(product.description).includes(query) ||
        normalize(product.category).includes(query);

      const matchesCategory =
        category === "all" || normalize(product.category) === normalize(category);

      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  const activeFilterLabel =
    category === "all" && !search
      ? "Browse every product in the store"
      : `${filteredProducts.length} results${
          search ? ` for "${search}"` : ""
        }${category !== "all" ? ` in ${category}` : ""}`;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <p className="text-slate-400 text-lg animate-pulse">
          Loading premium products...
        </p>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 py-20">
      <div className="absolute top-[-100px] left-[-100px] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px]" />
      <div className="absolute bottom-[-100px] right-[-100px] h-[500px] w-[500px] rounded-full bg-pink-600/20 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            All Products
          </h2>
          <p className="mt-3 text-slate-400">
            {activeFilterLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              onClick={() => router.push(`/products/${item._id}`)}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-purple-500/20">
                <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <img
                    src={item.images?.[0] || "/no-product.png"}
                    alt={item.title}
                    className="h-52 object-contain transition-transform duration-500 group-hover:scale-110"
                  />

                  {item.images?.length > 1 ? (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {item.images.slice(0, 3).map((image, index) => (
                        <span
                          key={`${image}-${index}`}
                          className="h-9 w-9 overflow-hidden rounded-lg border border-white/15 bg-black/40"
                        >
                          <img
                            src={image}
                            alt={`${item.title} ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {item.discountPrice ? (
                    <span className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white">
                      SALE
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                    {item.category || "Product"}
                  </p>
                  <h3 className="line-clamp-1 text-lg font-semibold text-white transition group-hover:text-purple-400">
                    {item.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-slate-400">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-lg font-bold text-white">
                      Rs. {item.price}
                    </span>
                    {item.discountPrice ? (
                      <span className="text-sm text-slate-500 line-through">
                        Rs. {item.discountPrice}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-purple-500/40" />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center text-slate-400">
            No products found.
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default Page;
