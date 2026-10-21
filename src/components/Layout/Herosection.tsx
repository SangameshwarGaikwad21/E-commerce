"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  Variants,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  ChevronLeft,
  ChevronRight,
  Clock,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const perks = [
  { icon: Truck, title: "Free Delivery", text: "On orders above ₹499" },
  { icon: ShieldCheck, title: "Secure Payments", text: "100% protected checkout" },
  { icon: RotateCcw, title: "Easy Returns", text: "7-day hassle-free returns" },
  { icon: Headphones, title: "24/7 Support", text: "We're here to help" },
];

const rotatingWords = ["products", "fashion", "gadgets", "essentials"];
const fallbackCategories = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Sports",
  "Books",
  "Toys",
  "Grocery",
];

/* ---------- animation variants ---------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ---------- helpers ---------- */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

function useCountdown() {
  const [left, setLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      setLeft({
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return left;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* ---------- component ---------- */
function HeroSection({ products }: any) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const countdown = useCountdown();

  const featured = useMemo(() => products?.slice(0, 5) ?? [], [products]);
  const [active, setActive] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const categories = useMemo(() => {
    const fromProducts = Array.from(
      new Set((products ?? []).map((p: any) => p.category).filter(Boolean))
    ) as string[];
    return fromProducts.length ? fromProducts : fallbackCategories;
  }, [products]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % rotatingWords.length),
      2400
    );
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (paused || featured.length < 2 || reduce) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % featured.length),
      4000
    );
    return () => clearInterval(id);
  }, [paused, featured.length, reduce]);

  const current = featured[active];
  const others = featured.filter((_: any, i: number) => i !== active).slice(0, 3);

  const next = () => setActive((i) => (i + 1) % featured.length);
  const prev = () =>
    setActive((i) => (i - 1 + featured.length) % featured.length);

  const openProduct = (id: string) => router.push(`/product/${id}`);

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100">
      {/* ================= MAIN (full-bleed split) ================= */}
      <div className="relative grid flex-1 lg:grid-cols-2">
        {/* ---------- LEFT ---------- */}
        <div className="relative flex items-center overflow-hidden">
          {/* animated blobs */}
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl"
          />
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { x: [0, -50, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-10 right-0 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl"
          />

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative w-full px-6 py-14 sm:px-10 lg:px-16 xl:px-24"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 shadow-sm"
            >
              <motion.span
                animate={reduce ? undefined : { rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="inline-flex"
              >
                <BadgePercent size={14} />
              </motion.span>
              New season · Up to 40% off
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-5xl font-extrabold leading-[1.05] text-slate-900 sm:text-6xl xl:text-7xl"
            >
              Discover premium
              <span className="relative block h-[1.15em] overflow-hidden text-indigo-700">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingWords[wordIndex]}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="absolute left-0"
                  >
                    {rotatingWords[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              delivered fast.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-lg text-lg text-slate-500"
            >
              Shop the latest collection with best quality and unbeatable
              prices. Everything you need, one click away.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/product")}
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-8 py-4 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
              >
                Shop Now
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/product")}
                className="rounded-xl border border-slate-200 bg-white px-8 py-4 font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Browse Categories
              </motion.button>
            </motion.div>

            {/* countdown */}
            <motion.div
              variants={fadeUp}
              className="mt-8 inline-flex w-fit flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
            >
              <Clock size={18} className="text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                Deal of the day ends in
              </span>
              <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-900">
                {[countdown.h, countdown.m, countdown.s].map((v, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="rounded-md bg-white px-2 py-1 shadow-sm">
                      {pad(v)}
                    </span>
                    {i < 2 && <span className="text-amber-600">:</span>}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* stats */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-wrap gap-x-12 gap-y-4"
            >
              {[
                { to: 10, suffix: "k+", label: "Products" },
                { to: 50, suffix: "+", label: "Categories" },
                { to: 25, suffix: "k", label: "Customers" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-extrabold text-indigo-700">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- RIGHT (full-bleed indigo panel) ---------- */}
        <div
          className="relative flex items-center overflow-hidden bg-indigo-700"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[56px] border-indigo-500/40"
          />
          <motion.div
            aria-hidden
            animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-indigo-500/40"
          />

          <div className="relative mx-auto w-full max-w-xl px-6 py-14 sm:px-10">
            <div className="mb-5 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                <Sparkles size={16} /> Trending now
              </p>

              {featured.length > 1 && (
                <div className="flex gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous product"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next product"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {featured.length === 0 ? (
              <div className="rounded-2xl bg-white/10 p-10 text-center text-indigo-100">
                Products will appear here.
              </div>
            ) : (
              <>
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={current?._id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      onClick={() => openProduct(current._id)}
                      className="group block w-full overflow-hidden rounded-3xl bg-white text-left shadow-2xl"
                    >
                      <div className="relative h-56 overflow-hidden bg-slate-100 sm:h-72">
                        <img
                          src={current?.images?.[0]}
                          alt={current?.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">
                          Best Seller
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 p-5">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-slate-900">
                            {current?.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} fill="currentColor" />
                            ))}
                          </div>
                        </div>
                        <p className="shrink-0 text-xl font-extrabold text-indigo-700">
                          {currency.format(current?.price ?? 0)}
                        </p>
                      </div>
                    </motion.button>
                  </AnimatePresence>

                  <motion.div
                    animate={reduce ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-xl sm:flex"
                  >
                    <Truck size={16} className="text-indigo-700" />
                    <span className="text-xs font-bold text-slate-800">
                      Free delivery
                    </span>
                  </motion.div>

                  <motion.div
                    animate={reduce ? undefined : { y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-4 -left-3 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-xl sm:flex"
                  >
                    <Star size={16} className="text-amber-500" fill="currentColor" />
                    <span className="text-xs font-bold text-slate-800">
                      4.8 · 12k reviews
                    </span>
                  </motion.div>
                </div>

                {featured.length > 1 && (
                  <div className="mt-6 flex justify-center gap-2">
                    {featured.map((p: any, i: number) => (
                      <button
                        key={p._id}
                        onClick={() => setActive(i)}
                        aria-label={`Show product ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === active
                            ? "w-6 bg-amber-400"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="mt-6 grid grid-cols-3 gap-4"
                >
                  {others.map((product: any, i: number) => (
                    <motion.button
                      key={product._id}
                      variants={fadeUp}
                      whileHover={{ y: -6 }}
                      onClick={() => openProduct(product._id)}
                      className="group overflow-hidden rounded-2xl bg-white text-left shadow-lg"
                    >
                      <motion.div
                        animate={
                          reduce
                            ? undefined
                            : {
                                y: [0, -4, 0],
                                transition: {
                                  duration: 3 + i * 0.6,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                },
                              }
                        }
                      >
                        <div className="h-20 overflow-hidden bg-slate-100 sm:h-24">
                          <img
                            src={product.images?.[0]}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="truncate text-xs font-semibold text-slate-900 sm:text-sm">
                            {product.title}
                          </h3>
                          <p className="mt-0.5 text-sm font-extrabold text-indigo-700">
                            {currency.format(product.price)}
                          </p>
                        </div>
                      </motion.div>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= CATEGORY MARQUEE (full width) ================= */}
      <div className="relative overflow-hidden border-y border-slate-200 bg-white py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <motion.div
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex w-max gap-3 px-3"
        >
          {[...categories, ...categories].map((cat, i) => (
            <button
              key={`${cat}-${i}`}
              onClick={() =>
                router.push(`/product?category=${encodeURIComponent(cat)}`)
              }
              className="whitespace-nowrap rounded-full border border-slate-200 bg-indigo-50/60 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-700 hover:text-white"
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ================= PERKS BAR (full width) ================= */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-2 bg-white lg:grid-cols-4"
      >
        {perks.map(({ icon: Icon, title, text }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className="flex items-center justify-center gap-3 border-slate-100 px-4 py-5 lg:border-r lg:last:border-r-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="truncate text-xs text-slate-500">{text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default HeroSection;