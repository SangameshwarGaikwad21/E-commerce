"use client";

import { getProducts } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, PackageSearch, Search, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const slugify = (value?: string) =>
  value?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

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

  const shell = "relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-12 sm:px-6";
  const blobs = (
    <>
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
    </>
  );

  /* ---------- loading skeleton ---------- */
  if (loading) {
    return (
      <section className={shell}>
        {blobs}
        <div className="relative mx-auto max-w-7xl">
          <div className="h-44 animate-pulse rounded-3xl bg-indigo-200/60" />
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5"
              >
                <div className="h-64 bg-indigo-50" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------- error ---------- */
  if (error) {
    return (
      <section className={`${shell} flex items-center justify-center`}>
        {blobs}
        <div className="relative flex max-w-md flex-col items-center rounded-3xl bg-white p-10 text-center shadow-xl shadow-indigo-900/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={24} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Couldn&apos;t load this category
          </h3>
          <p className="mt-1 text-sm text-slate-500">{String(error)}</p>
          <button
            onClick={() => dispatch(getProducts())}
            className="mt-5 rounded-xl bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={shell}>
      {blobs}

      <div className="relative mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <button
                onClick={() => router.push("/product")}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-100 transition hover:text-amber-400"
              >
                <ArrowLeft size={16} /> All products
              </button>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
                Category
              </p>
              <h1 className="mt-2 text-4xl font-extrabold capitalize">
                {categoryName}
              </h1>
              <p className="mt-2 text-indigo-100">
                {categoryProducts.length} matching{" "}
                {categoryProducts.length === 1 ? "product" : "products"}
              </p>
            </div>

            <label className="relative flex h-12 w-full items-center md:w-96">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in this category..."
                className="h-full w-full rounded-2xl border border-transparent bg-white pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/30"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 rounded-md p-1 text-slate-400 transition hover:text-indigo-600"
                >
                  <X size={16} />
                </button>
              )}
            </label>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categoryProducts.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
              viewport={{ once: true }}
              onClick={() => router.push(`/products/${item._id}`)}
              className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5 ring-1 ring-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/15 hover:ring-indigo-200"
            >
              <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-5">
                <img
                  src={item.images?.[0] || "/no-product.png"}
                  alt={item.title}
                  className="h-48 w-full object-contain transition duration-500 group-hover:scale-110"
                />

                {item.images?.length > 1 ? (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {item.images.slice(0, 3).map((image, i) => (
                      <span
                        key={`${image}-${i}`}
                        className="h-9 w-9 overflow-hidden rounded-lg border-2 border-white bg-white shadow"
                      >
                        <img
                          src={image}
                          alt={`${item.title} ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    ))}
                  </div>
                ) : null}

                <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-indigo-700 text-white opacity-0 shadow-lg shadow-indigo-700/30 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowRight size={18} />
                </span>
              </div>

              <div className="p-5">
                <h2 className="truncate text-lg font-bold text-slate-900 transition group-hover:text-indigo-700">
                  {item.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {item.description}
                </p>
                <p className="mt-4 text-xl font-extrabold text-indigo-700">
                  {currency.format(item.price)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EMPTY */}
        {categoryProducts.length === 0 ? (
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center rounded-3xl bg-white p-12 text-center shadow-xl shadow-indigo-900/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <PackageSearch size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "There are no products in this category yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}