"use client";

import { deleteProduct, getProducts } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import { Filter, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const normalize = (value?: string) => value?.toLowerCase().trim() || "";

export default function Page() {
  const dispatch = useAppDispatch();
  const { loading, error, products } = useAppSelector((state) => state.product);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 animate-pulse">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-20">{error}</p>;
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-10 text-white sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30" />
        <div className="absolute top-[-120px] left-[-120px] h-[440px] w-[440px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-140px] right-[-120px] h-[440px] w-[440px] rounded-full bg-pink-600/20 blur-[140px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-400">
              Admin Products
            </p>
            <h1 className="mt-3 text-4xl font-bold">Product List</h1>
            <p className="mt-2 text-sm text-slate-400">
              Search, filter and manage every product in your catalog.
            </p>
          </div>

          <Link
            href="/admin/product/create"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:opacity-90"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        <div className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-2xl md:grid-cols-[1fr_260px]">
          <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, description, category..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          <label className="flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4">
            <Filter size={18} className="text-slate-400" />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              <option className="bg-slate-950" value="all">
                All Categories
              </option>
              {categories.map((item) => (
                <option className="bg-slate-950" key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-slate-400">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
            }}
            className="text-purple-300 transition hover:text-purple-200"
          >
            Clear filters
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((item: Product) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-lg transition hover:-translate-y-2 hover:shadow-purple-500/20">
                <div className="relative h-72 bg-gradient-to-br from-slate-800 to-slate-950 p-5">
                  <img
                    src={item.images?.[0] || "/no-product.png"}
                    alt={item.title}
                    className="mx-auto h-52 w-full object-contain transition duration-500 group-hover:scale-105"
                  />

                  {item.images?.length > 1 ? (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {item.images.slice(0, 4).map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="h-10 w-10 overflow-hidden rounded-xl border border-white/15 bg-black/40"
                        >
                          <img
                            src={image}
                            alt={`${item.title} ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <Link
                      href={`/admin/product/update/${item._id}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                      title="Edit product"
                    >
                      <Pencil size={16} />
                    </Link>

                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50"
                      title="Delete product"
                    >
                      {deletingId === item._id ? "..." : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-purple-300">
                        {item.category || "Product"}
                      </p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-white">
                      Rs. {item.price}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-10 text-center text-slate-400">
            No products match your filters.
          </div>
        ) : null}
      </section>
    </main>
  );
}
