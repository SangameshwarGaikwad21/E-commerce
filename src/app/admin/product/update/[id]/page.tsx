"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSingleProduct, editProduct } from "@/redux/fetures/productSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ImagePlus,
  IndianRupee,
  Loader2,
  Save,
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

const EditProductPage = () => {
  const params = useParams();
  const productId = typeof params.id === "string" ? params.id : params.id?.[0];

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { product, loading } = useAppSelector((state) => state.product);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productId) {
      dispatch(getSingleProduct(productId));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setPrice(product.price?.toString() || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
    }
  }, [product]);

  // free the object URL when it changes / on unmount
  useEffect(() => {
    return () => {
      if (newPreview) URL.revokeObjectURL(newPreview);
    };
  }, [newPreview]);

  const pickFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setNewPreview(URL.createObjectURL(file));
  };

  const clearNewImage = () => {
    setImage(null);
    setNewPreview(null);
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!productId) {
      toast.error("Invalid product ID");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Enter a valid price");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);

    if (image) {
      formData.append("image", image);
    }

    try {
      setSaving(true);
      await dispatch(
        editProduct({
          productId,
          productData: formData,
        })
      ).unwrap();

      toast.success("Product updated");
      router.push("/admin/product/productlist");
    } catch (err: any) {
      console.log("UPDATE ERROR:", err);
      toast.error(err?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const shell =
    "relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-8 sm:px-6";
  const blobs = (
    <>
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
    </>
  );

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className={shell}>
        {blobs}
        <div className="relative mx-auto max-w-5xl">
          <div className="h-40 animate-pulse rounded-3xl bg-indigo-200/60" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="h-[520px] animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
            <div className="h-80 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
          </div>
        </div>
      </div>
    );
  }

  const currentImage = product?.images?.[0];
  const shownImage = newPreview || currentImage;
  const previewPrice =
    Number(price) > 0 ? currency.format(Number(price)) : "₹0";

  return (
    <div className={shell}>
      {blobs}

      <div className="relative mx-auto max-w-5xl">
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
            <h1 className="mt-2 text-4xl font-extrabold">Edit Product</h1>
            <p className="mt-2 text-indigo-100">
              Update the details below and save your changes.
            </p>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* ================= FORM ================= */}
          <motion.form
            onSubmit={handleUpdate}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="space-y-6 rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 sm:p-8"
          >
            {/* TITLE */}
            <div>
              <label className={labelClass} htmlFor="title">
                Title
              </label>
              <div className={inputWrap}>
                <Type
                  size={18}
                  className="pointer-events-none absolute left-4 text-slate-400"
                />
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  className={inputClass}
                />
              </div>
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
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
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
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelClass} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Enter description"
                className="w-full resize-none rounded-xl border border-slate-200 bg-indigo-50/60 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15"
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className={labelClass}>Replace image (optional)</label>

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
                  pickFile(e.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition ${
                  dragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-slate-300 bg-slate-50/70 hover:border-indigo-400 hover:bg-indigo-50/60"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <UploadCloud size={24} />
                </span>
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  Drag &amp; drop a new image, or{" "}
                  <span className="text-indigo-700 underline">browse</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Leave empty to keep the current image
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    pickFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </div>

              {image && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm">
                  <span className="truncate font-medium text-indigo-800">
                    {image.name}
                  </span>
                  <button
                    type="button"
                    onClick={clearNewImage}
                    className="flex shrink-0 items-center gap-1 font-semibold text-red-600 transition hover:underline"
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/admin/product/productlist"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-6 font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                Cancel
              </Link>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-8 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Update Product
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* ================= PREVIEW ================= */}
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
              <div className="relative flex h-60 items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-5">
                {shownImage ? (
                  <img
                    src={shownImage}
                    alt="Product preview"
                    className="h-48 w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImagePlus size={40} />
                    <p className="mt-2 text-xs font-medium">No image</p>
                  </div>
                )}
                {newPreview && (
                  <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
                    New image
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {title || "Product title"}
                    </h3>
                    <span className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                      {category || "Category"}
                    </span>
                  </div>
                  <span className="shrink-0 text-lg font-extrabold text-indigo-700">
                    {previewPrice}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                  {description || "Your product description will show here."}
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;