"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/redux/fetures/cartSlice";

export default function Page() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-10">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-white mb-8">
          Your Cart 🛒
        </h1>

        {items.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <>
            {/* ITEMS */}
            <div className="space-y-6">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg"
                >

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-contain rounded-lg bg-gray-900 p-2"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white">
                      {item.title}
                    </h2>

                    <p className="text-gray-400">
                      ₹{item.price}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-3">

                      <button
                        onClick={() =>
                          dispatch(decreaseQuantity(item.id))
                        }
                        className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        -
                      </button>

                      <span className="text-white font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          dispatch(increaseQuantity(item.id))
                        }
                        className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      dispatch(removeFromCart(item.id))
                    }
                    className="text-red-400 hover:text-red-500 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL CARD */}
            <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg flex justify-between items-center">

              <h2 className="text-xl font-semibold text-white">
                Total: ₹{total.toLocaleString()}
              </h2>

              <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                Checkout
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}