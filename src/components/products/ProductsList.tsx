"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, PackageSearch } from "lucide-react";
import type { Product } from "@/types/product";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const SectionShell = ({ children }: { children: React.ReactNode }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 py-16">
    <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
    <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
  </section>
);

const ProductList = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleProductClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  /* ---------- loading skeleton ---------- */
  if (loading)
    return (
      <SectionShell>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5"
            >
              <div className="h-64 bg-indigo-50" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-2/3 rounded bg-slate-200" />
                <div className="h-3 w-full rounded bg-slate-100" />
                <div className="h-3 w-4/5 rounded bg-slate-100" />
                <div className="h-5 w-1/3 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );

  /* ---------- error ---------- */
  if (error)
    return (
      <SectionShell>
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl bg-white p-10 text-center shadow-xl shadow-indigo-900/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={24} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Couldn&apos;t load products
          </h3>
          <p className="mt-1 text-sm text-slate-500">{String(error)}</p>
          <button
            onClick={() => dispatch(getProducts())}
            className="mt-5 rounded-xl bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
          >
            Try again
          </button>
        </div>
      </SectionShell>
    );

  const limitedProducts = products?.slice(0, 6) ?? [];

  return (
    <SectionShell>
      {/* Heading */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-700">
            Featured
          </p>
          <h2 className="mt-2 text-4xl font-extrabold text-slate-900 md:text-5xl">
            Featured Collection
          </h2>
          <p className="mt-2 text-slate-500">
            Explore premium curated products picked for you.
          </p>
        </div>

        <button
          onClick={() => router.push("/product")}
          className="group inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          View all
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Empty State */}
      {limitedProducts.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl bg-white p-12 text-center shadow-xl shadow-indigo-900/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <PackageSearch size={24} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No products available
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Check back soon for new arrivals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {limitedProducts.map((item: Product, index: number) => {
            const hasDiscount = Boolean(item.discountPrice);
            const percentOff =
              item.discountPrice && item.discountPrice > item.price
                ? Math.round(
                    ((item.discountPrice - item.price) / item.discountPrice) *
                      100
                  )
                : 0;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                viewport={{ once: true }}
                onClick={() => handleProductClick(item._id)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5 ring-1 ring-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-900/15 hover:ring-indigo-200">
                  {/* Image */}
                  <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
                    <img
                      src={item?.images?.[0] || "/no-product.png"}
                      alt={item.title}
                      className="h-52 object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Sale badge */}
                    {hasDiscount && (
                      <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                        {percentOff > 0 ? `${percentOff}% OFF` : "SALE"}
                      </span>
                    )}

                    {/* Thumbnails */}
                    {item.images?.length > 1 ? (
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {item.images.slice(0, 3).map((image, i) => (
                          <span
                            key={`${image}-${i}`}
                            className="h-9 w-9 overflow-hidden rounded-lg border-2 border-white bg-white shadow"
                          >
                            <img
                              src={image}
                              alt={`${item.title} ${i + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {/* hover arrow */}
                    <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-indigo-700 text-white opacity-0 shadow-lg shadow-indigo-700/30 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowRight size={18} />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition group-hover:text-indigo-700">
                      {item.title}
                    </h3>

                    <p className="line-clamp-2 text-sm text-slate-500">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xl font-extrabold text-indigo-700">
                        {currency.format(item.price)}
                      </span>

                      {hasDiscount && (
                        <span className="text-sm text-slate-400 line-through">
                          {currency.format(item.discountPrice as number)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
};

export default ProductList;