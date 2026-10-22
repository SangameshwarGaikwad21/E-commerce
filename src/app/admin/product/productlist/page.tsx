"use client";

import { deleteProduct, getProducts } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Product } from "@/types/product";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpDown,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const normalize = (value?: string) => value?.toLowerCase().trim() || "";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

type ProductWithStock = Product & { stock?: number };
type SortKey = "newest" | "price-asc" | "price-desc" | "title";

const fieldWrap =
  "flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-indigo-50/60 px-4 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/15";

export default function Page() {
  const dispatch = useAppDispatch();
  const { loading, error, products } = useAppSelector((state) => state.product);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ) as string[];
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

      return matchesSearch && matchesCategory;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [category, products, search, sort]);

  const filtersActive = search !== "" || category !== "all" || sort !== "newest";

  const handleDelete = async (item: Product) => {
    const confirmDelete = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(item._id);
      await dispatch(deleteProduct(item._id)).unwrap();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("newest");
  };

  const shell =
    "relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-8 sm:px-6";
  const blobs = (
    <>
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
    </>
  );

  /* ---------- loading skeleton ---------- */
  if (loading) {
    return (
      <main className={shell}>
        {blobs}
        <div className="relative mx-auto max-w-7xl">
          <div className="h-40 animate-pulse rounded-3xl bg-indigo-200/60" />
          <div className="mt-6 h-20 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ---------- error ---------- */
  if (error) {
    return (
      <main className={`${shell} flex items-center justify-center`}>
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
      </main>
    );
  }

  return (
    <main className={shell}>
      {blobs}

      <section className="relative mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
                Admin Products
              </p>
              <h1 className="mt-3 text-4xl font-extrabold">Product List</h1>
              <p className="mt-2 text-indigo-100">
                Search, filter and manage every product in your catalog.
              </p>
              <p className="mt-4 inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-indigo-50">
                {products.length} total · {categories.length} categories
              </p>
            </div>

            <Link
              href="/admin/product/create"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 font-bold text-slate-900 shadow-lg shadow-black/10 transition hover:bg-amber-300"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </motion.div>

        {/* ================= TOOLBAR ================= */}
        <div className="mt-6 rounded-3xl bg-white p-4 shadow-xl shadow-indigo-900/5">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_200px_auto]">
            <label className={fieldWrap}>
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, description, category..."
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-slate-400 transition hover:text-indigo-600"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <label className={fieldWrap}>
              <Filter size={18} className="shrink-0 text-slate-400" />
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldWrap}>
              <ArrowUpDown size={18} className="shrink-0 text-slate-400" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="newest">Default order</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="title">Name: A to Z</option>
              </select>
            </label>

            {/* view toggle */}
            <div className="inline-flex h-12 items-center rounded-2xl bg-indigo-50 p-1">
              {(
                [
                  { key: "grid", icon: LayoutGrid, label: "Grid view" },
                  { key: "list", icon: List, label: "List view" },
                ] as const
              ).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  aria-label={label}
                  title={label}
                  className="relative flex h-10 w-11 items-center justify-center rounded-xl"
                >
                  {view === key && (
                    <motion.span
                      layoutId="view-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-white shadow"
                    />
                  )}
                  <Icon
                    size={18}
                    className={`relative ${
                      view === key ? "text-indigo-700" : "text-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-sm text-slate-500">
            <span>
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              of {products.length} products
            </span>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="font-semibold text-indigo-700 transition hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ================= GRID VIEW ================= */}
        {view === "grid" && filteredProducts.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredProducts.map((item: Product, index) => {
                const stock = (item as ProductWithStock).stock;
                const low = typeof stock === "number" && stock <= 5;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5 ring-1 ring-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/15 hover:ring-indigo-200">
                      <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-slate-100 p-5">
                        <img
                          src={item.images?.[0] || "/no-product.png"}
                          alt={item.title}
                          className="mx-auto h-48 w-full object-contain transition duration-500 group-hover:scale-105"
                        />

                        {item.images?.length > 1 ? (
                          <div className="absolute bottom-4 left-4 flex gap-2">
                            {item.images.slice(0, 4).map((image, i) => (
                              <div
                                key={`${image}-${i}`}
                                className="h-10 w-10 overflow-hidden rounded-xl border-2 border-white bg-white shadow"
                              >
                                <img
                                  src={image}
                                  alt={`${item.title} ${i + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {/* actions: always visible */}
                        <div className="absolute right-4 top-4 flex gap-2">
                          <Link
                            href={`/admin/product/update/${item._id}`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-700 shadow-lg transition hover:bg-indigo-700 hover:text-white"
                            title="Edit product"
                            aria-label="Edit product"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item._id}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 shadow-lg transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                            title="Delete product"
                            aria-label="Delete product"
                          >
                            {deletingId === item._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold text-slate-900">
                              {item.title}
                            </h3>
                            <span className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                              {item.category || "Product"}
                            </span>
                          </div>
                          <span className="shrink-0 text-lg font-extrabold text-indigo-700">
                            {currency.format(item.price)}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                          {item.description}
                        </p>

                        {typeof stock === "number" && (
                          <span
                            className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                              low
                                ? "bg-red-50 text-red-700 ring-red-200"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            }`}
                          >
                            {low ? `Low stock: ${stock}` : `In stock: ${stock}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* ================= LIST VIEW ================= */}
        {view === "list" && filteredProducts.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-indigo-50 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item: Product) => {
                    const stock = (item as ProductWithStock).stock;
                    const low = typeof stock === "number" && stock <= 5;

                    return (
                      <tr
                        key={item._id}
                        className="border-t border-slate-100 transition hover:bg-indigo-50/40"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-slate-100">
                              <img
                                src={item.images?.[0] || "/no-product.png"}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold text-slate-900">
                                {item.title}
                              </p>
                              <p className="line-clamp-1 max-w-xs text-xs text-slate-500">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {item.category || "Product"}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-extrabold text-slate-900">
                          {currency.format(item.price)}
                        </td>
                        <td className="px-5 py-3">
                          {typeof stock === "number" ? (
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                                low
                                  ? "bg-red-50 text-red-700 ring-red-200"
                                  : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                              }`}
                            >
                              {stock}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/product/update/${item._id}`}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50"
                            >
                              <Pencil size={14} /> Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item._id}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === item._id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {filteredProducts.length === 0 ? (
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center rounded-3xl bg-white p-12 text-center shadow-xl shadow-indigo-900/5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <PackageSearch size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No products match your filters
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search, or add a new product.
            </p>
            <div className="mt-5 flex gap-3">
              {filtersActive && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Clear filters
                </button>
              )}
              <Link
                href="/admin/product/create"
                className="rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
              >
                Add product
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}