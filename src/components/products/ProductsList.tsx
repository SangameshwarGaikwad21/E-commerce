"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const ProductList = () => {
  const dispatch = useAppDispatch();

  const { products, loading, error } =
    useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (loading)
    return (
      <p className="text-center text-lg">
        Loading products...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500">
        {error}
      </p>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6">

      {products.map((item) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          className="group"
        >
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
            <div className="relative bg-gray-100">

              <motion.img
                src={
                  item.images?.[0] ||
                  "/placeholder.png"
                }
                alt={item.title}
                className="h-56 w-full object-contain p-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              {item.discount > 0 && (
                <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                  {item.discount}% OFF
                </Badge>
              )}
            </div>

            <CardContent className="p-4 space-y-2">

              <h2 className="font-semibold text-lg line-clamp-1">
                {item.title}
              </h2>

              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between pt-2">

                <p className="text-xl font-bold text-green-600">
                  ₹{item.price}
                </p>

                <Button
                  size="sm"
                  className="rounded-xl"
                >
                  Add To Cart
                </Button>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductList;