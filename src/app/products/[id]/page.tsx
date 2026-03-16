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
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-16 px-6">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-white p-6 flex items-center justify-center border-r border-gray-50">
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={product?.images?.[0] || "/placeholder.png"}
                alt={product?.title}
                className="max-h-[220px] w-full object-contain transform transition duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">

        
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full w-fit">
            Premium Product
          </span>

          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {product?.title}
          </h1>

         
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400 text-lg">
              ★★★★★
            </div>
            <span className="text-gray-500 text-sm">(120 Reviews)</span>
          </div>

      
          <p className="text-gray-600 leading-relaxed">
            {product?.description}
          </p>

        
          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold text-gray-900">
              ₹{Number(product?.price).toLocaleString()}
            </span>

            <span className="line-through text-gray-400 text-lg">
              ₹{Number(product?.price + 5000).toLocaleString()}
            </span>

            <span className="text-green-600 font-semibold text-sm">
              10% OFF
            </span>
          </div>

        
          <p className="text-sm text-green-600 font-medium">
            ✔ In Stock
          </p>

       
          <div className="flex gap-4 pt-4">

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
              className="flex-1 bg-black text-white font-semibold py-4 rounded-xl hover:bg-gray-800 transition transform hover:scale-[1.02]"
            >
              Add to Cart
            </button>

            <button className="flex-1 bg-yellow-400 text-black font-semibold py-4 rounded-xl hover:bg-yellow-500 transition transform hover:scale-[1.02]">
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