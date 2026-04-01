"use client";

import { getProducts, deleteProduct } from "@/redux/fetures/productSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

const Page = () => {
  const dispatch = useAppDispatch();
  const { loading, error, products } = useAppSelector(
    (state) => state.product
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // ✅ DELETE HANDLER (FIXED)
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await dispatch(deleteProduct(id)).unwrap();

      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ LOADING UI
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 animate-pulse">
          Loading products...
        </p>
      </div>
    );

  // ✅ ERROR UI
  if (error)
    return (
      <p className="text-center text-red-500 py-20">{error}</p>
    );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-10">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-white">Products</h2>

        <Link
          href="/admin/product/create"
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full font-semibold shadow-md hover:bg-gray-900 hover:scale-105 transition border border-white/10"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {products?.map((item: any) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative rounded-3xl bg-gradient-to-b from-gray-900 via-gray-950 to-black border border-white/10 overflow-hidden shadow-lg hover:-translate-y-2 transition">

              {/* IMAGE */}
              <div className="relative h-72 flex items-center justify-center bg-gray-900">
                <img
                  src={item?.images?.[0] || "/no-product.png"}
                  alt={item.title}
                  className="h-56 object-contain transition group-hover:scale-110"
                />

                {/* DISCOUNT */}
                {item.discount > 0 && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    {item.discount}% OFF
                  </span>
                )}

                {/* ACTION BUTTONS */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">

                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                  >
                    {deletingId === item._id ? "..." : "🗑"}
                  </button>

                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-semibold text-blue-400">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xl font-bold text-white">
                    ₹{item.price}
                  </span>

                  {item.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{Math.round(item.price / (1 - item.discount / 100))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default Page;