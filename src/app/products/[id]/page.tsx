"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getSingleProduct } from "@/redux/fetures/productSlice"
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
        <p className="text-gray-500">Loading product...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )

  return (

    <section className="min-h-screen bg-gray-100 py-12">

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">

      <div className="grid md:grid-cols-2 gap-10 items-start">


{/* PRODUCT IMAGE */}

              <div className="flex justify-center">

              <img
              src={product?.images?.[0] || "/placeholder.png"}
              alt={product?.title}
              className="max-h-[400px] object-contain"
              />

              </div>


{/* PRODUCT DETAILS */}

            <div className="space-y-6">

            <h1 className="text-3xl font-semibold text-gray-900">
            {product?.title}
            </h1>


            <p className="text-2xl font-bold text-gray-900">
            ₹{product?.price}
            </p>


            <p className="text-gray-600 leading-relaxed">
            {product?.description}
            </p>


            {/* BUTTONS */}

            <div className="flex gap-4 pt-4">

            <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md"
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
            image: product.images?.[0] || "/placeholder.png",
            })
            )

            }}
            >

            Add to Cart

            </button>


            <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-md"
            >

            Buy Now

            </button>


            </div>

            </div>


        </div>

      </div>

  </section>

  )

}