"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import { ArrowRight, Percent, Sparkles, Tag, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const budgets = [500, 1000, 2000];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function PromoBanner() {
  const router = useRouter();
  const reduce = useReducedMotion();

  return (
    <section className="bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-indigo-700 shadow-2xl shadow-indigo-900/20"
      >
        {/* ---------- animated background ---------- */}
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[56px] border-indigo-500/40"
        />
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-indigo-500/40"
        />
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { x: ["-120%", "320%"] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* floating sparkles */}
        {[
          { top: "14%", left: "46%", d: 0, s: 18 },
          { top: "70%", left: "58%", d: 1, s: 14 },
          { top: "25%", left: "88%", d: 2, s: 16 },
        ].map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            animate={
              reduce
                ? undefined
                : { y: [0, -14, 0], opacity: [0.4, 1, 0.4], rotate: [0, 90, 0] }
            }
            transition={{ duration: 4, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
            style={{ top: p.top, left: p.left }}
            className="pointer-events-none absolute hidden text-amber-300 sm:block"
          >
            <Sparkles size={p.s} />
          </motion.span>
        ))}

        {/* ---------- content ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12"
        >
          <div className="flex items-start gap-5">
            {/* floating icon tile */}
            <motion.span
              variants={fadeUp}
              animate={reduce ? undefined : { y: [0, -8, 0], rotate: [0, -6, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-xl sm:flex"
            >
              <Tag size={28} />
              <motion.span
                animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-900 shadow"
              >
                <Percent size={13} />
              </motion.span>
            </motion.span>

            <div>
              <motion.p
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300"
              >
                <motion.span
                  animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-amber-300"
                />
                Limited Deal
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl"
              >
                Premium picks at{" "}
                <span className="relative inline-block text-amber-300">
                  better prices
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-amber-300/70"
                  />
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-3 max-w-xl text-indigo-100"
              >
                Filter by your budget and find the best product without
                scrolling forever.
              </motion.p>

              {/* budget chips */}
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                {budgets.map((b, i) => (
                  <motion.button
                    key={b}
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      reduce
                        ? undefined
                        : {
                            y: [0, -3, 0],
                            transition: {
                              duration: 3 + i * 0.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }
                    }
                    onClick={() => router.push(`/product?max=${b}`)}
                    className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:border-amber-300 hover:bg-amber-300 hover:text-slate-900"
                  >
                    Under ₹{b.toLocaleString("en-IN")}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="relative flex justify-start lg:justify-end">
            {/* pulsing ring behind button */}
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { scale: [1, 1.18], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-2xl bg-amber-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/product?max=1000")}
              className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-2xl bg-amber-400 px-8 text-base font-bold text-slate-900 shadow-xl shadow-black/20 transition hover:bg-amber-300"
            >
              {/* shimmer */}
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { x: ["-150%", "250%"] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 -skew-x-12 bg-white/50"
              />
              <Zap size={18} className="relative" fill="currentColor" />
              <span className="relative">Shop Under ₹1,000</span>
              <ArrowRight
                size={18}
                className="relative transition-transform group-hover:translate-x-1"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}