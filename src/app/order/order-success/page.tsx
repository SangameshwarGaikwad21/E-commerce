"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Home,
  PackageCheck,
  Truck,
} from "lucide-react";

type OrderSummary = {
  orderId?: string;
  paymentMethod?: "COD" | "RAZORPAY";
  amount?: number;
  productTitle?: string;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const confettiColors = ["#4338ca", "#fbbf24", "#6366f1", "#0ea5e9", "#10b981"];

// deterministic "random" values so server and client render the same markup
const confetti = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 6 + ((i * 5) % 7),
  delay: (i % 9) * 0.12,
  duration: 2.6 + ((i * 3) % 8) * 0.25,
  drift: ((i * 53) % 80) - 40,
  rotate: 180 + ((i * 71) % 360),
  color: confettiColors[i % confettiColors.length],
  round: i % 3 === 0,
}));

const steps = [
  { label: "Order placed", icon: Check, done: true },
  { label: "Processing", icon: PackageCheck, done: false },
  { label: "Shipped", icon: Truck, done: false },
  { label: "Delivered", icon: Home, done: false },
];

export default function OrderSuccessPage() {
  const reduce = useReducedMotion();

  const [summary] = useState<OrderSummary | null>(() => {
    if (typeof window === "undefined") return null;

    const storedSummary = localStorage.getItem("lastOrderSummary");

    if (!storedSummary) return null;

    try {
      return JSON.parse(storedSummary) as OrderSummary;
    } catch {
      return null;
    }
  });

  const shortId = summary?.orderId
    ? `#${summary.orderId.slice(-8).toUpperCase()}`
    : null;

  const copyId = async () => {
    if (!summary?.orderId) return;
    try {
      await navigator.clipboard.writeText(summary.orderId);
      toast.success("Order ID copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      {/* confetti */}
      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{
                y: ["-5vh", "105vh"],
                x: [0, c.drift],
                opacity: [0, 1, 1, 0],
                rotate: c.rotate,
              }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                ease: "easeIn",
              }}
              style={{
                left: `${c.left}%`,
                width: c.size,
                height: c.size * (c.round ? 1 : 1.8),
                background: c.color,
                borderRadius: c.round ? "9999px" : "2px",
              }}
              className="absolute top-0"
            />
          ))}
        </div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-900/10"
      >
        {/* top banner */}
        <div className="relative overflow-hidden bg-indigo-700 px-8 pb-14 pt-10 text-center text-white sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative">
            {/* animated check */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              {!reduce && (
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-amber-300"
                />
              )}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
                className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-emerald-500 shadow-xl"
              >
                <CheckCircle2 size={56} />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-7 text-sm font-semibold uppercase tracking-[0.24em] text-amber-400"
            >
              Order Confirmed
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-3xl font-extrabold sm:text-4xl"
            >
              Thank you! Your order is locked in
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mx-auto mt-3 max-w-md text-indigo-100"
            >
              We received your order and will start processing it now.
            </motion.p>
          </div>
        </div>

        <div className="-mt-6 space-y-5 rounded-t-3xl bg-white px-6 pb-8 pt-8 sm:px-10">
          {/* details */}
          <div className="grid gap-3 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="rounded-2xl border border-slate-200 bg-indigo-50/50 p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm">
                <PackageCheck size={20} />
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Product
              </p>
              <p className="mt-1 line-clamp-2 font-bold text-slate-900">
                {summary?.productTitle || "Your product"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="rounded-2xl border border-slate-200 bg-indigo-50/50 p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm">
                <CreditCard size={20} />
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Payment
              </p>
              <p className="mt-1 font-bold text-slate-900">
                {summary?.paymentMethod === "RAZORPAY"
                  ? "Paid Online"
                  : "Cash on Delivery"}
              </p>
            </motion.div>
          </div>

          {/* order id + amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="flex flex-col gap-3 rounded-2xl border border-dashed border-indigo-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Order ID
              </p>
              <p className="mt-1 flex items-center gap-2 font-mono text-base font-bold text-slate-900">
                {shortId || "Generated successfully"}
                {summary?.orderId && (
                  <button
                    onClick={copyId}
                    aria-label="Copy order ID"
                    title="Copy full order ID"
                    className="rounded-md p-1 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Copy size={15} />
                  </button>
                )}
              </p>
            </div>

            {summary?.amount ? (
              <div className="sm:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  Amount
                </p>
                <p className="mt-1 text-2xl font-extrabold text-indigo-700">
                  {currency.format(summary.amount)}
                </p>
              </div>
            ) : null}
          </motion.div>

          {/* tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="rounded-2xl bg-slate-50 p-5"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
              What happens next
            </p>
            <ol className="grid grid-cols-4 gap-2">
              {steps.map(({ label, icon: Icon, done }, i) => (
                <li key={label} className="relative flex flex-col items-center text-center">
                  {i < steps.length - 1 && (
                    <span
                      className={`absolute left-1/2 top-5 h-0.5 w-full ${
                        done ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                      done
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "bg-white text-slate-400 ring-2 ring-slate-200"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span
                    className={`mt-2 text-[11px] font-semibold sm:text-xs ${
                      done ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="flex flex-col gap-3 pt-2 sm:flex-row"
          >
            <Link
              href="/orders"
              className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-6 font-bold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
            >
              View my orders
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Home size={18} />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}