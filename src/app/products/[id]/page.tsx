"use client"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { getSingleProduct } from "@/redux/fetures/productSlice"
import { addToCart } from "@/redux/fetures/cartSlice"
import { useSession } from "next-auth/react"

const Page = () => {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const { product, loading, error } = useAppSelector((state) => state.product)

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id))
    }
  }, [dispatch, id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )

  if (error || !product) return (
    <div className="flex items-center justify-center min-h-screen text-red-500 font-medium">
      {error || "Product not found"}
    </div>
  )

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      {/* Main Card */}
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT SIDE: Image Section (Smaller and contained) */}
          <div className="md:w-1/2 bg-white p-6 flex items-center justify-center border-r border-gray-50">
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={product?.images?.[0] || "/placeholder.png"}
                alt={product?.title}
                className="max-h-[400px] w-full object-contain transform transition duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Product Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">
                Premium Product
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                {product?.title}
              </h1>
              <p className="text-2xl font-bold text-gray-800 mt-4">
                ₹{Number(product?.price).toLocaleString()}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {product?.description}
              </p>
            </div>

          
            <div className="flex gap-4 mt-4">

                <button
                  onClick={() => {
                    if (!session) return router.push("/login")
                    dispatch(addToCart({ 
                      id: product._id,
                      title: product.title,
                      price: Number(product.price),
                      image: product.images?.[0]
                    }))
                  }}
                  className="flex-1 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition duration-300 active:scale-[0.98]"
                >
                  Add to Cart
                </button>

                <button
                  className="flex-1 bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-500 transition duration-300 active:scale-[0.98]"
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

export default Page