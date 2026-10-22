"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createProduct } from "@/redux/fetures/productSlice";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  IndianRupee,
  Loader2,
  PackagePlus,
  Tag,
  Type,
  UploadCloud,
  X,
} from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const inputWrap =
  "relative flex items-center rounded-xl border border-slate-200 bg-indigo-50/60 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/15";
const inputClass =
  "h-12 w-full bg-transparent pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400";

type FormState = {
  title: string;
  description: string;
  price: string;
  category: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  price: "",
  category: "",
};

export default function Page() {
  const dispatch = useAppDispatch();
  const { createLoading, products } = useAppSelector((state) => state.product);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // existing categories as suggestions
  const categorySuggestions = useMemo(
    () =>
      Array.from(
        new Set((products || []).map((p) => p.category).filter(Boolean))
      ) as string[],
    [products]
  );

  // free object URLs on unmount
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (incoming: File[]) => {
    const valid = incoming.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) return;

    setImages((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setForm(emptyForm);
    setImages([]);
    setPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(form.price);

    if (!form.title.trim() || !form.category.trim()) {
      toast.error("Title and category are required");
      return;
    }
    if (!form.price || Number.isNaN(price) || price <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    if (images.length === 0) {
      toast.error("Add at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", String(price));
    formData.append("category", form.category);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product created");
      resetAll();
    } catch {
      toast.error("Failed to create product");
    }
  };

  const previewPrice = Number(form.price) > 0 ? currency.format(Number(form.price)) : "₹0";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative">
            <Link
              href="/admin/product/productlist"
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-100 transition hover:text-amber-400"
            >
              <ArrowLeft size={16} /> Back to products
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Admin Products
            </p>
            <h1 className="mt-2 flex items-center gap-3 text-4xl font-extrabold">
              Create Product
            </h1>
            <p className="mt-2 text-indigo-100">
              Add a new product to your store. The preview updates as you type.
            </p>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* ================= FORM ================= */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="space-y-6 rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 sm:p-8"
          >
            {/* TITLE */}
            <div>
              <label className={labelClass} htmlFor="title">
                Product title
              </label>
              <div className={inputWrap}>
                <Type
                  size={18}
                  className="pointer-events-none absolute left-4 text-slate-400"
                />
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  className={inputClass}
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelClass} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the product — features, materials, what's in the box..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-indigo-50/60 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15"
              />
            </div>

            {/* PRICE + CATEGORY */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="price">
                  Price
                </label>
                <div className={inputWrap}>
                  <IndianRupee
                    size={18}
                    className="pointer-events-none absolute left-4 text-slate-400"
                  />
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="category">
                  Category
                </label>
                <div className={inputWrap}>
                  <Tag
                    size={18}
                    className="pointer-events-none absolute left-4 text-slate-400"
                  />
                  <input
                    id="category"
                    name="category"
                    list="category-options"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Electronics"
                    className={inputClass}
                  />
                  <datalist id="category-options">
                    {categorySuggestions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* IMAGES */}
            <div>
              <label className={labelClass}>Product images</label>

              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  addFiles(Array.from(e.dataTransfer.files));
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                  dragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-300 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/60"
                }`}
              >
                <motion.span
                  animate={dragging ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700"
                >
                  <UploadCloud size={26} />
                </motion.span>
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  Drag &amp; drop images here, or{" "}
                  <span className="text-indigo-700 underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  PNG, JPG or WEBP · you can add multiple images
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>

              {/* thumbnails */}
              {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  <AnimatePresence>
                    {previews.map((preview, index) => (
                      <motion.div
                        key={preview}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-slate-100"
                      >
                        <img
                          src={preview}
                          alt={`Product preview ${index + 1}`}
                          className="h-full w-full object-contain p-1"
                        />
                        {index === 0 && (
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          aria-label="Remove image"
                          className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-red-600 shadow transition hover:bg-red-600 hover:text-white"
                        >
                          <X size={13} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetAll}
                disabled={createLoading}
                className="h-12 rounded-xl border border-slate-200 px-6 font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
              >
                Reset
              </button>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                disabled={createLoading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-8 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <PackagePlus size={18} /> Create Product
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* ================= LIVE PREVIEW ================= */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="h-fit lg:sticky lg:top-6"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">
              Live preview
            </p>

            <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5">
              <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-5">
                {previews[0] ? (
                  <img
                    src={previews[0]}
                    alt="Cover preview"
                    className="h-52 w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImagePlus size={40} />
                    <p className="mt-2 text-xs font-medium">
                      Cover image appears here
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {form.title || "Product title"}
                    </h3>
                    <span className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                      {form.category || "Category"}
                    </span>
                  </div>
                  <span className="shrink-0 text-lg font-extrabold text-indigo-700">
                    {previewPrice}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {form.description || "Your product description will show here."}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
              This is how the product card looks in your store. The first image
              is used as the cover.
            </p>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}