"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getSingleProduct } from "@/redux/fetures/productSlice"
import { addToCart } from "@/redux/fetures/cartSlice"
import { useSession } from "next-auth/react"

const page =()=> {

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


  // LOADING STATE
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Loading product...</p>
      </div>
    )


  // ERROR STATE
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )


  return (

    <section className="min-h-screen bg-gray-100 py-12">

      <div className="max-w-6xl mx-auto bg-white p-10 rounded-xl shadow-lg">

        <div className="grid md:grid-cols-2 gap-12 items-start">


          {/* PRODUCT IMAGE */}
          <div className="flex justify-center items-center bg-gray-50 rounded-lg p-6">

            <img
              src={product?.images?.[0] || "/placeholder.png"}
              alt={product?.title}
              className="w-full max-w-md object-contain"
            />

          </div>


          {/* PRODUCT DETAILS */}
          <div className="space-y-6">

            <h1 className="text-3xl font-semibold text-gray-900">
              {product?.title}
            </h1>


            <p className="text-2xl font-bold text-gray-900">
              ₹{Number(product?.price).toLocaleString()}
            </p>


            <p className="text-gray-600 leading-relaxed">
              {product?.description}
            </p>


            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">

              <button
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md transition"
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
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-md transition"
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

export default page