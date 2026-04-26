"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createProduct } from "@/redux/fetures/productSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function Page() {
  const dispatch = useAppDispatch();
  const { createLoading } = useAppSelector((state) => state.product);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    images: [] as File[],
  });

  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setForm({ ...form, images: files });
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("category", form.category);

    form.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product Created 🚀");
    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex justify-center items-start px-4 py-10">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl relative z-10"
      >

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">

          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-white">
              Create Product
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Add new product to your store 🚀
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* TITLE */}
            <div>
              <Label className="text-gray-300 text-sm">
                Product Title
              </Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-1 h-12 bg-gray-900 border border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label className="text-gray-300 text-sm">
                Description
              </Label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1 h-12 bg-gray-900 border border-white/10 text-white"
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <Label className="text-gray-300 text-sm">Price</Label>
                <Input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="mt-1 h-12 bg-gray-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300 text-sm">Category</Label>
                <Input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-1 h-12 bg-gray-900 border border-white/10 text-white"
                />
              </div>

            </div>

            {/* IMAGE */}
            <div>
              <Label className="text-gray-300 text-sm">
                Product Images
              </Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFile}
                className="mt-1 h-12 bg-gray-900 border border-white/10 text-gray-400 cursor-pointer"
              />
            </div>

            {/* PREVIEW */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-900 p-4 rounded-xl">
                {previews.map((preview) => (
                  <img
                    key={preview}
                    src={preview}
                    alt="Product preview"
                    className="h-28 w-full object-contain rounded-lg bg-black"
                  />
                ))}
              </div>
            )}

            {/* BUTTON */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              disabled={createLoading}
              className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-lg shadow-lg hover:opacity-90 transition-all"
            >
              {createLoading ? "Creating..." : "Create Product"}
            </motion.button>

          </form>
        </div>
      </motion.div>
    </div>
  );
}
