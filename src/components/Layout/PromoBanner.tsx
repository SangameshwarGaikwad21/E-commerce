"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PromoBanner() {
  const router = useRouter();

  return (
    <section className="bg-slate-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-7xl flex-col gap-5 overflow-hidden rounded-[2rem] border border-purple-500/30 bg-gradient-to-r from-purple-950 via-slate-950 to-pink-950 p-6 shadow-2xl shadow-purple-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-purple-300">
            <Tag size={22} />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-300">
              Limited Deal
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Premium picks at better prices
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Filter by your budget and find the best product without scrolling forever.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/product?max=1000")}
          className="h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 font-semibold text-white transition hover:opacity-90"
        >
          Shop Under Rs. 1000
        </button>
      </motion.div>
    </section>
  );
}
