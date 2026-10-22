"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  PackageSearch,
  SlidersHorizontal,
  X,
} from "lucide-react";

const normalize = (value?: string) => value?.toLowerCase().trim() || "";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const PAGE_SIZE = 12;

const quickRanges = [
  { label: "Under ₹500", min: "", max: "500" },
  { label: "₹500 – ₹1,000", min: "500", max: "1000" },
  { label: "₹1,000 – ₹5,000", min: "1000", max: "5000" },
  { label: "Above ₹5,000", min: "5000", max: "" },
];

type SortKey = "default" | "price-asc" | "price-desc" | "title";

const Page = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading, error } = useAppSelector((state) => state.product);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const minParam = searchParams.get("min") || "";
  const maxParam = searchParams.get("max") || "";
  const sort = (searchParams.get("sort") as SortKey) || "default";
  const minPrice = Number(minParam || 0);
  const maxPrice = Number(maxParam || 0);

  // reset pagination whenever filters change
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [search, category, minParam, maxParam, sort]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (p.category) counts.set(p.category, (counts.get(p.category) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = normalize(search);

    const list = products.filter((product) => {
      const matchesSearch =
        normalize(product.title).includes(query) ||
        normalize(product.description).includes(query) ||
        normalize(product.category).includes(query);

      const matchesCategory =
        category === "all" || normalize(product.category) === normalize(category);
      const matchesPrice =
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice);

      return matchesSearch && matchesCategory && matchesPrice;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [category, maxPrice, minPrice, products, search, sort]);

  /* ---------- URL helpers ---------- */
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const query = params.toString();
    router.push(query ? `/product?${query}` : "/product");
  };

  const applyPriceFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateParams({
      min: String(formData.get("min") || "").trim() || null,
      max: String(formData.get("max") || "").trim() || null,
    });
  };

  const clearAll = () => router.push("/product");

  const chips = [
    search && { label: `"${search}"`, clear: () => updateParams({ search: null }) },
    category !== "all" && {
      label: category,
      clear: () => updateParams({ category: null }),
    },
    (minParam || maxParam) && {
      label: `${minParam ? currency.format(minPrice) : "₹0"} – ${
        maxParam ? currency.format(maxPrice) : "any"
      }`,
      clear: () => updateParams({ min: null, max: null }),
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const shell =
    "relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-10 sm:px-6";
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
          <div className="h-36 animate-pulse rounded-3xl bg-indigo-200/60" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="hidden h-96 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5 lg:block" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5"
                >
                  <div className="h-56 bg-indigo-50" />
                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-5 w-1/3 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
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
            Couldn&apos;t load products
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

  /* ---------- filters panel (shared by desktop + mobile) ---------- */
  const filtersPanel = (
    <div className="space-y-7">
      {/* categories */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-indigo-700">
          Categories
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParams({ category: null })}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              category === "all"
                ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/30"
                : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            <span>All products</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                category === "all" ? "bg-white/20" : "bg-slate-100 text-slate-500"
              }`}
            >
              {products.length}
            </span>
          </button>

          {categories.map((c) => {
            const active = normalize(category) === normalize(c.name);
            return (
              <button
                key={c.name}
                onClick={() => updateParams({ category: c.name })}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/30"
                    : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-white/20" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* price */}
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-indigo-700">
          Price
        </h3>

        <div className="mb-3 flex flex-wrap gap-2">
          {quickRanges.map((r) => {
            const active = minParam === r.min && maxParam === r.max;
            return (
              <button
                key={r.label}
                onClick={() =>
                  updateParams({ min: r.min || null, max: r.max || null })
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-indigo-700 bg-indigo-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        <form
          key={`${minParam}-${maxParam}`}
          onSubmit={applyPriceFilter}
          className="grid grid-cols-2 gap-2"
        >
          <input
            name="min"
            type="number"
            min="0"
            defaultValue={minParam}
            placeholder="Min ₹"
            className="h-11 rounded-xl border border-slate-200 bg-indigo-50/60 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15"
          />
          <input
            name="max"
            type="number"
            min="0"
            defaultValue={maxParam}
            placeholder="Max ₹"
            className="h-11 rounded-xl border border-slate-200 bg-indigo-50/60 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15"
          />
          <button
            type="submit"
            className="col-span-2 h-11 rounded-xl bg-indigo-700 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
          >
            Apply price
          </button>
        </form>
      </div>

      {chips.length > 0 && (
        <button
          onClick={clearAll}
          className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <section className={shell}>
      {blobs}

      <div className="relative mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Shop
            </p>
            <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
              All Products
            </h1>
            <p className="mt-2 text-indigo-100">
              {chips.length === 0
                ? "Browse every product in the store."
                : `${filteredProducts.length} ${
                    filteredProducts.length === 1 ? "result" : "results"
                  }${search ? ` for "${search}"` : ""}${
                    category !== "all" ? ` in ${category}` : ""
                  }`}
            </p>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* ================= SIDEBAR (desktop) ================= */}
          <aside className="hidden h-fit rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 lg:sticky lg:top-24 lg:block">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <SlidersHorizontal size={18} className="text-indigo-700" /> Filters
            </h2>
            {filtersPanel}
          </aside>

          {/* ================= RESULTS ================= */}
          <div>
            {/* toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-xl shadow-indigo-900/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen((o) => !o)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 lg:hidden"
                >
                  <SlidersHorizontal size={16} /> Filters
                  {chips.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-700 text-[11px] text-white">
                      {chips.length}
                    </span>
                  )}
                </button>

                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-900">
                    {Math.min(visible, filteredProducts.length)}
                  </span>{" "}
                  of {filteredProducts.length} products
                </p>
              </div>

              <label className="relative flex h-11 items-center rounded-xl border border-slate-200 bg-indigo-50/60 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/15">
                <ArrowUpDown
                  size={16}
                  className="pointer-events-none absolute left-3.5 text-slate-400"
                />
                <select
                  value={sort}
                  onChange={(e) =>
                    updateParams({
                      sort: e.target.value === "default" ? null : e.target.value,
                    })
                  }
                  className="h-full appearance-none bg-transparent pl-10 pr-9 text-sm font-medium text-slate-700 outline-none"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="title">Name: A to Z</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 text-slate-400"
                />
              </label>
            </div>

            {/* mobile filters */}
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="mt-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/5">
                    {filtersPanel}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* active chips */}
            {chips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {chips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-indigo-800"
                  >
                    {chip.label} <X size={13} />
                  </button>
                ))}
                <button
                  onClick={clearAll}
                  className="px-2 text-xs font-semibold text-indigo-700 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.slice(0, visible).map((item, index) => {
                const hasDiscount = Boolean(item.discountPrice);
                const percentOff =
                  item.discountPrice && item.discountPrice > item.price
                    ? Math.round(
                        ((item.discountPrice - item.price) / item.discountPrice) *
                          100
                      )
                    : 0;

                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index % 3) * 0.07 }}
                    viewport={{ once: true }}
                    onClick={() => router.push(`/products/${item._id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5 ring-1 ring-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/15 hover:ring-indigo-200">
                      <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
                        <img
                          src={item.images?.[0] || "/no-product.png"}
                          alt={item.title}
                          className="h-44 object-contain transition-transform duration-500 group-hover:scale-110"
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

                        {hasDiscount ? (
                          <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                            {percentOff > 0 ? `${percentOff}% OFF` : "SALE"}
                          </span>
                        ) : null}

                        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-indigo-700 text-white opacity-0 shadow-lg shadow-indigo-700/30 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <ArrowRight size={18} />
                        </span>
                      </div>

                      <div className="space-y-2 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                          {item.category || "Product"}
                        </p>
                        <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-indigo-700">
                          {item.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-slate-500">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <span className="text-xl font-extrabold text-indigo-700">
                            {currency.format(item.price)}
                          </span>
                          {hasDiscount ? (
                            <span className="text-sm text-slate-400 line-through">
                              {currency.format(item.discountPrice as number)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* load more */}
            {filteredProducts.length > visible && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
                >
                  Load more products
                  <ChevronDown size={18} />
                </button>
              </div>
            )}

            {/* empty */}
            {filteredProducts.length === 0 ? (
              <div className="mx-auto mt-4 flex max-w-md flex-col items-center rounded-3xl bg-white p-12 text-center shadow-xl shadow-indigo-900/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <PackageSearch size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing or clearing your filters.
                </p>
                {chips.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="mt-5 rounded-xl bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;