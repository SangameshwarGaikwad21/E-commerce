"use client"

import { useState } from "react"
import CreateProduct from "../product/create/page"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { motion } from "framer-motion"

const Page = () => {

  const dispatch = useAppDispatch()
  const [activePage, setActivePage] = useState("dashboard")

  const { products } = useAppSelector((state) => state.product)

  return (

    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">

      {/* SIDEBAR */}

      <aside className="w-64 bg-slate-950 text-white flex flex-col p-6 shadow-2xl">

        <h2 className="text-2xl font-bold text-indigo-400 mb-10 tracking-wide">
          <Link href="/">Admin Panel</Link>
        </h2>

        <nav className="flex flex-col gap-3">

          <button
            onClick={() => setActivePage("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activePage === "dashboard"
                ? "bg-indigo-600 shadow-lg"
                : "hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("create")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activePage === "create"
                ? "bg-indigo-600 shadow-lg"
                : "hover:bg-slate-800"
            }`}
          >
            <Plus size={18} />
            Create Product
          </button>

          <button
            onClick={() => setActivePage("product")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activePage === "product"
                ? "bg-indigo-600 shadow-lg"
                : "hover:bg-slate-800"
            }`}
          >
            <Package size={18} />
            Products
          </button>

          <button
            onClick={() => setActivePage("order")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activePage === "order"
                ? "bg-indigo-600 shadow-lg"
                : "hover:bg-slate-800"
            }`}
          >
            <ShoppingCart size={18} />
            Orders
          </button>

        </nav>
      </aside>


      <main className="flex-1 p-10">
        {activePage === "dashboard" && (

          <div>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h3 className="text-gray-500 text-sm">Total Products</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {products.length}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h3 className="text-gray-500 text-sm">Total Orders</h3>
                <p className="text-3xl font-bold text-green-600">
                  0
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md border">
                <h3 className="text-gray-500 text-sm">Revenue</h3>
                <p className="text-3xl font-bold text-purple-600">
                  ₹0
                </p>
              </div>

            </div>

          </div>

        )}


        {activePage === "create" && <CreateProduct />}


        {activePage === "product" && (

        <div className="space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-slate-800">
              Products
            </h2>

            <span className="text-sm bg-white border px-4 py-2 rounded-lg shadow-sm">
              {products.length} Products
            </span>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {products.map((item: any) => (

            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >

              <div className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition overflow-hidden group">

        
                <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">

                  <img
                    src={item?.images?.[0] || "/no-product.png"}
                    alt={item.title}
                    className="h-36 object-contain transition duration-300 group-hover:scale-110"
                  />

                </div>
                <div className="p-5 space-y-3">

                  <h3 className="font-semibold text-slate-800 line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    ★ ★ ★ ★ <span className="text-gray-300">★</span>
                    <span className="text-xs text-gray-400 ml-2">(4.0)</span>
                  </div>


                  <div className="flex items-center justify-between pt-2">

                    <span className="text-xl font-bold text-slate-900">
                      ₹{item.price}
                    </span>

                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition">
                      View
                    </button>

                  </div>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    )}

  </main>

</div>

  )
}

export default Page