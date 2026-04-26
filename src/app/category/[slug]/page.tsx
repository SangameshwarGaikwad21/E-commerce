"use client";

import { getProducts } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const slugify = (value?: string) =>
  value?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);
  const [search, setSearch] = useState("");

  const slug = params?.slug as string;

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const categoryProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesCategory = slugify(product.category) === slug;
      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, slug]);

  const categoryName = categoryProducts[0]?.category || slug.replace(/-/g, " ");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading category...
      </div>
    );
  }

  if (error) return <p className="py-20 text-center text-red-500">{error}</p>;

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-14 text-white sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-400">
              Category
            </p>
            <h1 className="mt-3 text-4xl font-bold capitalize">
              {categoryName}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {categoryProducts.length} matching products
            </p>
          </div>

          <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 md:w-96">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search in this category..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              onClick={() => router.push(`/products/${item._id}`)}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] transition hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-950 p-5">
                <img
                  src={item.images?.[0] || "/no-product.png"}
                  alt={item.title}
                  className="h-48 w-full object-contain transition group-hover:scale-105"
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
              </div>

              <div className="p-5">
                <h2 className="truncate text-lg font-semibold group-hover:text-purple-400">
                  {item.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                  {item.description}
                </p>
                <p className="mt-4 text-xl font-bold">Rs. {item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {categoryProducts.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center text-slate-400">
            No products found in this category.
          </div>
        ) : null}
      </div>
    </section>
  );
}
