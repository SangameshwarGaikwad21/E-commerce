"use client";

import { cancelOrder, getUserOrders } from "@/redux/fetures/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { PackageCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.order);
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const handleCancel = async (orderId: string) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      setCancellingId(orderId);
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success("Order cancelled");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Cancel failed");
    } finally {
      setCancellingId("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-12 text-white sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-purple-400">
          My Orders
        </p>
        <h1 className="mt-3 text-4xl font-bold">Order History</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track and cancel eligible orders from here.
        </p>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-slate-400">
              Loading orders...
            </div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-10 text-center text-slate-400">
              No orders yet.
            </div>
          ) : null}

          {orders.map((order) => {
            const canCancel = !["SHIPPED", "DELIVERED", "CANCELLED"].includes(
              order.orderStatus
            );

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      {currency.format(order.totalPrice)}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                      {order.orderStatus}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={`${order._id}-${item.product || item.id || index}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-purple-300">
                        <PackageCheck size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {item.name || item.title || "Product"}
                        </p>
                        <p className="text-sm text-slate-400">
                          Qty {item.quantity} • {currency.format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">
                    Delivery: {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>

                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={!canCancel || cancellingId === order._id}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <XCircle size={16} />
                    {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
