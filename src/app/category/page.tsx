"use client";

import { getProducts } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const Category = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; image?: string; count: number }>();

    products.forEach((product) => {
      const name = product.category || "Products";
      const key = slugify(name);
      const current = map.get(key);

      map.set(key, {
        name,
        image: current?.image || product.images?.[0],
        count: (current?.count || 0) + 1,
      });
    });

    return Array.from(map.entries()).map(([slug, value]) => ({
      slug,
      ...value,
    }));
  }, [products]);

  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-slate-950 py-12">
      <div className="absolute top-[-100px] left-[-100px] h-[360px] w-[360px] rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-400">
              Shop by
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">Categories</h2>
          </div>
          <Grid3X3 className="text-purple-400" size={26} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <motion.button
              key={cat.slug}
              whileHover={{ y: -5 }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:border-purple-500/40"
              onClick={() => router.push(`/category/${cat.slug}`)}
            >
              <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-950 p-3">
                <img
                  src={cat.image || "/no-product.png"}
                  alt={cat.name}
                  className="h-full w-full object-contain transition group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold text-white">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {cat.count} products
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
