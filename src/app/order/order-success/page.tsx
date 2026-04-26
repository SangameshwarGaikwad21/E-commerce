"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, Home, PackageCheck } from "lucide-react";

type OrderSummary = {
  orderId?: string;
  paymentMethod?: "COD" | "RAZORPAY";
  amount?: number;
  productTitle?: string;
};

export default function OrderSuccessPage() {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-16 text-white sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30" />
        <div className="absolute top-[-100px] left-[-100px] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-120px] right-[-100px] h-[420px] w-[420px] rounded-full bg-pink-600/20 blur-[130px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 text-purple-400">
          <CheckCircle2 size={42} />
        </div>

        <p className="mt-8 text-sm font-medium uppercase tracking-[0.24em] text-purple-400">
          Order Confirmed
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Your order is locked in
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/60">
          We received your order and will start processing it now.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <PackageCheck className="text-purple-400" size={22} />
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">
              Product
            </p>
            <p className="mt-2 font-semibold">
              {summary?.productTitle || "Your product"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <CreditCard className="text-purple-400" size={22} />
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">
              Payment
            </p>
            <p className="mt-2 font-semibold">
              {summary?.paymentMethod === "RAZORPAY"
                ? "Paid Online"
                : "Cash on Delivery"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/60">
          <p>
            Order ID:{" "}
            <span className="font-semibold text-white">
              {summary?.orderId || "Generated successfully"}
            </span>
          </p>
          {summary?.amount ? (
            <p className="mt-2">
              Amount: <span className="font-semibold text-white">Rs. {summary.amount}</span>
            </p>
          ) : null}
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 font-bold text-white transition hover:opacity-90"
        >
          <Home size={18} />
          Continue Shopping
        </Link>
      </section>
    </main>
  );
}
