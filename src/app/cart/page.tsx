"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "@/redux/fetures/cartSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Page() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);

  const [loading, setloading] = useState(false);

  const router = useRouter();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Shopping Cart
            </p>
            <h1 className="mt-3 text-4xl font-extrabold">Your Cart</h1>
            <p className="mt-2 text-indigo-100">
              {items.length === 0
                ? "Nothing here yet."
                : `${totalQuantity} item${totalQuantity > 1 ? "s" : ""} ready for checkout.`}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-3xl bg-white p-14 text-center shadow-xl shadow-indigo-900/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <ShoppingBag size={28} />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/product"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-7 py-3 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
            >
              Start shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* ITEMS */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/5 sm:flex-row sm:items-center sm:gap-6"
                  >
                    {/* IMAGE */}
                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 p-3 sm:w-28">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {currency.format(item.price)} each
                      </p>

                      {/* QUANTITY */}
                      <div className="mt-3 inline-flex items-center rounded-xl border border-slate-200 bg-indigo-50/60">
                        <button
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          aria-label="Decrease quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-l-xl text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-10 text-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => dispatch(increaseQuantity(item.id))}
                          aria-label="Increase quantity"
                          className="flex h-9 w-9 items-center justify-center rounded-r-xl text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* PRICE + REMOVE */}
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-between sm:self-stretch">
                      <p className="text-xl font-extrabold text-indigo-700">
                        {currency.format(item.price * item.quantity)}
                      </p>

                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SUMMARY */}
            <aside className="h-fit rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 lg:sticky lg:top-24">
              <h2 className="text-xl font-extrabold text-slate-900">
                Order summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Items ({totalQuantity})</span>
                  <span className="font-semibold text-slate-700">
                    {currency.format(total)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery</span>
                  <span className="font-semibold text-slate-700">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-slate-200" />

              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-2xl font-extrabold text-indigo-700">
                  {currency.format(total)}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                disabled={loading}
                onClick={() => {
                  setloading(true);
                  router.push("/checkout");
                }}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 py-3.5 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Redirecting..."
                ) : (
                  <>
                    Checkout <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

              <Link
                href="/product"
                className="mt-3 block text-center text-sm font-semibold text-indigo-700 transition hover:underline"
              >
                Continue shopping
              </Link>

              <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-indigo-600" /> Secure
                  checkout
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={15} className="text-indigo-600" /> Fast delivery
                  to your door
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}