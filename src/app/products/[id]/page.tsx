"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSingleProduct } from "@/redux/fetures/productSlice";
import { addToCart } from "@/redux/fetures/cartSlice";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // ✅ GET PRODUCT STATE
  const { product, loading, error } = useAppSelector(
    (state) => state.product
  );

  // ✅ GET CART ITEMS (IMPORTANT FIX)
  const cartItems = useAppSelector((state) => state.cart.items);

  // ✅ SAFE CHECK (important)
  const isInCart = product
    ? cartItems.some((item) => item.id === product._id)
    : false;

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id));
    }
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );

  if (error || !product)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error || "Product not found"}
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-16 flex items-center justify-center">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-6xl w-full relative z-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">

        <div className="flex flex-col md:flex-row">

          {/* IMAGE */}
          <div className="md:w-1/2 flex items-center justify-center p-10 bg-gradient-to-br from-gray-800 to-gray-900">
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.title}
              className="h-72 object-contain transition duration-500 hover:scale-110"
            />
          </div>

          {/* CONTENT */}
          <div className="md:w-1/2 p-10 space-y-6">

            <span className="text-xs font-semibold bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">
              Premium Product
            </span>

            <h1 className="text-4xl font-bold text-white">
              {product.title}
            </h1>

            <p className="text-gray-400">
              {product.description}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-white">
                ₹{Number(product.price).toLocaleString()}
              </span>
            </div>

            <p className="text-green-400 text-sm">✔ In Stock</p>
            <div className="flex gap-4 pt-4">

              <button
                onClick={() => {
                  if (!session) return router.push("/login");

                  if (!isInCart) {
                    dispatch(
                      addToCart({
                        id: product._id,
                        title: product.title,
                        price: Number(product.price),
                        image: product.images?.[0],
                      })
                    );
                  }
                }}
                disabled={isInCart}
                className={`flex-1 font-semibold py-4 rounded-xl transition transform shadow-lg
                  ${
                    isInCart
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-black border border-white/10 text-white hover:bg-gray-900 hover:scale-[1.03]"
                  }`}
              >
                {isInCart ? "Added to Cart ✅" : "Add to Cart"}
              </button>

              <button className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition transform hover:scale-[1.03] shadow-lg">
                <Link href="#">
                       Buy Now
                </Link>
              </button>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;