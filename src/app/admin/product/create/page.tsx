"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createProduct } from "@/redux/fetures/productSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Page() {
  const dispatch = useAppDispatch();
  const { createLoading } = useAppSelector((state) => state.product);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", String(form.price));
    formData.append("category", form.category);

    if (form.image) formData.append("image", form.image);

    try {
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product Created 🚀");
    } catch {
      toast.error("Failed ❌");
    }
  };

  return (
  <div className="min-h-screen flex justify-center items-start px-4 py-10 overflow-y-auto">

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="w-full max-w-2xl"   
  >

    {/* Card */}
    <div className="bg-gray-100 border border-gray-300 rounded-3xl shadow-2xl p-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Create Product
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Add new product to your store 🚀
        </p>
      </div>

      <form className="space-y-6">

        {/* Title */}
        <div>
          <Label className="text-gray-700 text-sm">Product Title</Label>
          <Input
            className="mt-1 h-12 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <Label className="text-gray-700 text-sm">Description</Label>
          <Input
            className="mt-1 h-12 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-700 text-sm">Price</Label>
            <Input className="mt-1 h-12 bg-white border-gray-300" />
          </div>

          <div>
            <Label className="text-gray-700 text-sm">Category</Label>
            <Input className="mt-1 h-12 bg-white border-gray-300" />
          </div>
        </div>

        {/* Image */}
        <div>
          <Label className="text-gray-700 text-sm">Product Image</Label>
          <Input
            type="file"
            className="mt-1 h-12 bg-white border-gray-300 cursor-pointer"
          />
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="w-full h-12 mt-4 rounded-xl bg-blue-600 
          text-white font-medium text-lg shadow-md hover:bg-blue-700 transition-all"
        >
          Create Product
        </motion.button>

      </form>

    </div>

  </motion.div>
</div>
  );
}