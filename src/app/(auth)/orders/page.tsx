"use client";

import { cancelOrder, getUserOrders } from "@/redux/fetures/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { MapPin, PackageCheck, ShoppingBag, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  SHIPPED: "bg-sky-50 text-sky-700 ring-sky-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

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
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-12 sm:px-6">
      <section className="mx-auto max-w-5xl">
        {/* Header card */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              My Orders
            </p>
            <h1 className="mt-3 text-4xl font-extrabold">Order History</h1>
            <p className="mt-2 text-indigo-100">
              Track and cancel eligible orders from here.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {loading ? (
            <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-xl shadow-indigo-900/5">
              Loading orders...
            </div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl bg-white p-12 text-center shadow-xl shadow-indigo-900/5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShoppingBag size={24} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No orders yet
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your placed orders will show up here.
              </p>
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
                className="rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                      {currency.format(order.totalPrice)}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusStyles[order.orderStatus] ??
                        "bg-indigo-50 text-indigo-700 ring-indigo-200"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={`${order._id}-${item.product || item.id || index}`}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <PackageCheck size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {item.name || item.title || "Product"}
                        </p>
                        <p className="text-sm text-slate-500">
                          Qty {item.quantity} • {currency.format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} className="shrink-0 text-indigo-500" />
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>

                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={!canCancel || cancellingId === order._id}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
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