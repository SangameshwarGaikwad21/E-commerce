"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSingleProduct, editProduct } from "@/redux/fetures/productSlice";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

const EditProductPage = () => {
  const params = useParams();
  const productId =
    typeof params.id === "string" ? params.id : params.id?.[0];

  const router = useRouter();
  const dispatch = useAppDispatch();

  const { product, loading } = useAppSelector(
    (state) => state.product
  );

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);

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
    }
  }, [product]);

  const handleUpdate = async () => {
    if (!productId) {
      toast.error("Invalid product ID");
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
      await dispatch(
        editProduct({
          productId,
          productData: formData,
        })
      ).unwrap();

      toast.success("Product updated 🚀");
      router.push("/admin/product/productlist");
    } catch (err: any) {
      console.log("UPDATE ERROR:", err);
      toast.error(err?.message || "Update failed ❌");
    }
  };

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-gray-400 animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  // 🎨 UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-gray-900/80 backdrop-blur border border-white/10 shadow-xl rounded-3xl">
          <CardContent className="p-8 space-y-6">

            <h2 className="text-2xl font-bold text-white text-center">
              ✏️ Edit Product
            </h2>

            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                className="bg-black border-white/10 text-white"
              />
            </div>

            {/* PRICE */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Price</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="bg-black border-white/10 text-white"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="bg-black border-white/10 text-white"
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Category</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="bg-black border-white/10 text-white"
              />
            </div>

            {/* IMAGE */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
                className="text-white"
              />
            </div>

            {/* BUTTON */}
            <Button
              onClick={handleUpdate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl transition"
            >
              Update Product 🚀
            </Button>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditProductPage;