"use client";
import { getProducts } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 py-16">
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">
              Shop by
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 md:text-4xl">
              Categories
            </h2>
            <p className="mt-1 text-slate-500">
              Find exactly what you&apos;re looking for.
            </p>
          </div>

          <button
            onClick={() => router.push("/product")}
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            All products
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
              whileHover={{ y: -6 }}
              onClick={() => router.push(`/category/${cat.slug}`)}
              className="group overflow-hidden rounded-2xl bg-white text-left shadow-lg shadow-indigo-900/5 ring-1 ring-transparent transition hover:shadow-xl hover:shadow-indigo-900/10 hover:ring-indigo-300"
            >
              <div className="relative h-28 bg-gradient-to-br from-indigo-50 to-slate-100 p-3">
                <img
                  src={cat.image || "/no-product.png"}
                  alt={cat.name}
                  className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-slate-900 transition group-hover:text-indigo-700">
                    {cat.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {cat.count} {cat.count === 1 ? "product" : "products"}
                  </p>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-700 group-hover:text-white">
                  <ArrowRight size={14} />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;