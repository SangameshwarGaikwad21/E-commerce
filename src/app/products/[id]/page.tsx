"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSingleProduct } from "@/redux/fetures/productSlice";
import { addToCart } from "@/redux/fetures/cartSlice";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Check,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [zoomed, setZoomed] = useState(false);

  const { product, loading, error } = useAppSelector((state) => state.product);

  const cartItems = useAppSelector((state) => state.cart.items);

  const isInCart = product
    ? cartItems.some((item) => item.id === product._id)
    : false;

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id));
    }
  }, [dispatch, id]);

  // reset gallery when a different product loads
  useEffect(() => {
    setSelectedImage("");
  }, [product?._id]);

  const shell =
    "relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-10 sm:px-6";
  const blobs = (
    <>
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
    </>
  );

  /* ---------- loading skeleton ---------- */
  if (loading)
    return (
      <section className={shell}>
        {blobs}
        <div className="relative mx-auto max-w-6xl">
          <div className="h-5 w-64 animate-pulse rounded bg-indigo-200/60" />
          <div className="mt-6 grid animate-pulse gap-8 rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 md:grid-cols-2 md:p-8">
            <div>
              <div className="h-96 rounded-3xl bg-indigo-50" />
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-indigo-50" />
                ))}
              </div>
            </div>
            <div className="space-y-5 py-4">
              <div className="h-6 w-32 rounded-full bg-slate-200" />
              <div className="h-10 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-10 w-40 rounded bg-slate-200" />
              <div className="h-14 w-full rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );

  /* ---------- error ---------- */
  if (error || !product)
    return (
      <section className={`${shell} flex items-center justify-center`}>
        {blobs}
        <div className="relative flex max-w-md flex-col items-center rounded-3xl bg-white p-10 text-center shadow-xl shadow-indigo-900/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={24} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900">
            {error ? "Something went wrong" : "Product not found"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {String(error || "This product may have been removed.")}
          </p>
          <Link
            href="/product"
            className="mt-5 rounded-xl bg-indigo-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800"
          >
            Back to products
          </Link>
        </div>
      </section>
    );

  const mainImage = selectedImage || product.images?.[0] || "/placeholder.png";
  const price = Number(product.price);
  const discountPrice = product.discountPrice
    ? Number(product.discountPrice)
    : 0;
  const percentOff =
    discountPrice > price
      ? Math.round(((discountPrice - price) / discountPrice) * 100)
      : 0;

 // const stock = (product as typeof product & { stock?: number }).stock;
//  const outOfStock = typeof stock === "number" && stock <= 0;

 // const lowStock = typeof stock === "number" && stock > 0 && stock <= 5;
   const stock = (product as typeof product & { stock?: number }).stock;  const outOfStock = false;   // was: typeof stock === "number" && stock <= 0
   const lowStock = false; 

  const handleAddToCart = () => {
    if (!session) return router.push("/login");

    if (!isInCart) {
      dispatch(
        addToCart({
          id: product._id,
          title: product.title,
          price: Number(product.price),
          image: product.images?.[0],
        })
      );
      toast.success("Added to cart");
    }
  };

  const handleBuyNow = () => {
    if (status === "loading") {
      return; // wait for session
    }

    if (!session || !session.user?.id) {
      return router.push("/login");
    }

    const userId = session.user.id;

    const buyNowProduct = {
      id: product._id,
      title: product.title,
      price: Number(product.price),
      image: product.images?.[0],
      images: product.images,
    };

    localStorage.setItem("buyNowItem", JSON.stringify(buyNowProduct));

    const address = localStorage.getItem(`address_${userId}`);

    if (!address) {
      router.push("/userAddress");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <section className={shell}>
      {blobs}

      <div className="relative mx-auto max-w-6xl">
        {/* BREADCRUMB */}
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-indigo-700">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/product" className="transition hover:text-indigo-700">
            Products
          </Link>
          {product.category && (
            <>
              <ChevronRight size={14} />
              <Link
                href={`/product?category=${encodeURIComponent(product.category)}`}
                className="transition hover:text-indigo-700"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="max-w-[200px] truncate font-semibold text-slate-800">
            {product.title}
          </span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-900/10"
        >
          <div className="grid md:grid-cols-2">
            {/* ================= GALLERY ================= */}
            <div className="bg-gradient-to-br from-indigo-50 to-slate-100 p-6 md:p-8">
              <div
                className="relative flex h-80 cursor-zoom-in items-center justify-center overflow-hidden rounded-3xl bg-white shadow-inner sm:h-96"
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomOrigin(`${x}% ${y}%`);
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt={product.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      transformOrigin: zoomOrigin,
                      transform: zoomed ? "scale(1.8)" : "scale(1)",
                      transition: "transform 0.25s ease-out",
                    }}
                    className="h-full max-w-full object-contain p-6"
                  />
                </AnimatePresence>

                {percentOff > 0 && (
                  <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900 shadow">
                    {percentOff}% OFF
                  </span>
                )}
              </div>

              {product.images?.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => {
                    const active = mainImage === image;
                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        aria-label={`Show image ${index + 1}`}
                        className={`h-20 rounded-2xl border-2 bg-white p-2 transition ${
                          active
                            ? "border-indigo-700 shadow-md shadow-indigo-700/20"
                            : "border-transparent hover:border-indigo-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="h-full w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* ================= INFO ================= */}
            <div className="flex flex-col p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
                  {product.category || "Premium Product"}
                </span>
                {outOfStock ? (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                    Out of stock
                  </span>
                ) : lowStock ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                    Only {stock} left
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <Check size={12} /> In stock
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                {product.title}
              </h1>

              <div className="mt-3 flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
                <span className="ml-2 text-sm text-slate-500">
                  Customer favourite
                </span>
              </div>

              {/* price */}
              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-extrabold text-indigo-700">
                  {currency.format(price)}
                </span>
                {discountPrice > 0 && (
                  <span className="pb-1 text-lg text-slate-400 line-through">
                    {currency.format(discountPrice)}
                  </span>
                )}
                {percentOff > 0 && (
                  <span className="mb-1 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-bold text-emerald-700">
                    Save {percentOff}%
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Inclusive of all taxes
              </p>

              <div className="my-6 border-t border-slate-100" />

              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-700">
                About this product
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {product.description}
              </p>

              {/* actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {isInCart ? (
                  <Link
                    href="/cart"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
                  >
                    <Check size={18} /> Added · Go to cart
                  </Link>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={outOfStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-indigo-700 bg-white py-4 font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-700 py-4 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Zap size={18} fill="currentColor" /> Buy Now
                </motion.button>
              </div>

              {/* trust */}
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, title: "Free delivery", text: "Above ₹499" },
                  { icon: RotateCcw, title: "Easy returns", text: "7-day policy" },
                  { icon: ShieldCheck, title: "Secure payment", text: "100% protected" },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-2xl bg-indigo-50/60 p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-sm">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">{title}</p>
                      <p className="truncate text-xs text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Page;