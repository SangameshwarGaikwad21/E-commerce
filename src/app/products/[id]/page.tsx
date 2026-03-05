"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getSingleProduct } from "@/redux/fetures/productSlice"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { addToCart } from "@/redux/fetures/cartSlice"
import { useSession } from "next-auth/react"

export default function SingleProduct() {

  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const { product, loading, error } =
    useAppSelector((state) => state.product)

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id))
    }
  }, [dispatch, id])

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground animate-pulse">
          Loading product...
        </p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Card className="relative p-12 rounded-3xl bg-white shadow-xl border w-full max-w-lg">

              <motion.img
                src={product?.images?.[0] || "/placeholder.png"}
                alt={product?.title}
                className="w-full max-h-[420px] object-contain mx-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

            </Card>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >

            <span className="text-sm uppercase tracking-widest text-gray-500">
              Premium Collection
            </span>

            <h1 className="text-4xl font-bold text-gray-900">
              {product?.title}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              {product?.description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-4xl font-bold text-black">
                ₹{product?.price}
              </span>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                In Stock
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">

              <Button
                size="lg"
                className="px-8 py-6 rounded-full shadow-md"
                onClick={() => {
                  if (!product) return

                  if (!session) {
                    router.push("/login")
                    return
                  }

                  dispatch(
                    addToCart({
                      id: product._id,
                      title: product.title,
                      price: Number(product.price),
                      image:
                        product.images?.[0] || "/placeholder.png",
                    })
                  )
                }}
              >
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 rounded-full"
              >
                Buy Now
              </Button>

            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 text-sm text-gray-500">

              <div>🚚 Free Shipping</div>
              <div>🔒 Secure Payment</div>
              <div>↩ 30-Day Returns</div>
              <div>⭐ Top Rated</div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}