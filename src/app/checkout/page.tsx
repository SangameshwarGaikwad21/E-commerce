"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { createOrder } from "@/redux/fetures/orderSlice";
import type { AppDispatch } from "@/redux/store";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import {
  Check,
  CreditCard,
  Home,
  Loader2,
  Lock,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

type ProductItem = {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  images?: string[];
  image?: string;
};

type SavedAddress = {
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  street: string;
};

type PaymentMethod = "RAZORPAY" | "COD";

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal: {
    ondismiss: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: { error?: { description?: string } }) => void
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const readStoredJson = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const paymentOptions: {
  key: PaymentMethod;
  title: string;
  text: string;
  icon: typeof CreditCard;
}[] = [
  {
    key: "RAZORPAY",
    title: "Online Payment",
    text: "Pay securely with Razorpay.",
    icon: CreditCard,
  },
  {
    key: "COD",
    title: "Cash on Delivery",
    text: "Pay when your order arrives.",
    icon: Home,
  },
];

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const userId = session?.user?.id;
  const product = readStoredJson<ProductItem>("buyNowItem");
  const address = userId
    ? readStoredJson<SavedAddress>(`address_${userId}`)
    : null;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("RAZORPAY");
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState("Ready for checkout");

  useEffect(() => {
    if (status === "loading") return;

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!product) {
      router.push("/");
      return;
    }

    if (!address) {
      router.push("/userAddress");
    }
  }, [address, product, userId, status, router]);

  const finishOrder = (orderId: string, method: PaymentMethod) => {
    localStorage.setItem(
      "lastOrderSummary",
      JSON.stringify({
        orderId,
        paymentMethod: method,
        amount: product?.price,
        productTitle: product?.title,
      })
    );
    localStorage.removeItem("buyNowItem");
    router.push("/order/order-success");
  };

  const handlePlaceOrder = async () => {
    if (!userId || !product || !address) {
      toast.error("Please login and add your address first");
      return;
    }

    const productId = product._id ?? product.id;

    if (!productId) {
      toast.error("Product details are missing");
      return;
    }

    try {
      setLoading(true);
      setPaymentStep("Creating secure order");

      const orderPayload = {
        user: userId,
        orderItems: [
          {
            product: productId,
            quantity: 1,
          },
        ],
        totalAmount: product.price,
        shippingAddress: {
          fullName: address.fullName,
          address: address.street,
          city: address.city,
          postalCode: address.pincode,
          country: "India",
          phone: address.phone,
        },
        paymentMethod,
      };

      const order = await dispatch(createOrder(orderPayload)).unwrap();

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully");
        finishOrder(order._id, "COD");
        return;
      }

      setPaymentStep("Opening payment gateway");

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        toast.error("Payment gateway failed to load");
        return;
      }

      const razorpayOrder = await axiosInstance.post("/order/create-razorpay-order", {
        orderId: order._id,
      });

      const paymentObject = new window.Razorpay({
        key: razorpayOrder.data.key,
        amount: razorpayOrder.data.amount,
        currency: razorpayOrder.data.currency,
        name: "E-Commerce",
        description: product.title,
        order_id: razorpayOrder.data.razorpayOrderId,
        prefill: {
          name: address.fullName,
          email: session?.user?.email,
          contact: address.phone,
        },
        notes: {
          address: `${address.street}, ${address.city}, ${address.state}`,
        },
        theme: {
          color: "#4338ca",
        },
        handler: async (response) => {
          try {
            setPaymentStep("Verifying payment");

            await axiosInstance.post("/payment", response);

            toast.success("Payment verified. Order confirmed");
            finishOrder(order._id, "RAZORPAY");
          } catch {
            setLoading(false);
            setPaymentStep("Payment verification failed");
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStep("Payment cancelled");
            toast.error("Payment was cancelled");
          },
        },
      });

      paymentObject.on("payment.failed", (response) => {
        setLoading(false);
        setPaymentStep("Payment failed");
        toast.error(response.error?.description || "Payment failed");
      });

      paymentObject.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Order failed";
      toast.error(message);
      setPaymentStep("Payment failed");
      setLoading(false);
    }
  };

  const shell =
    "relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-10 sm:px-6";
  const blobs = (
    <>
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
    </>
  );

  /* ---------- loading skeleton ---------- */
  if (!product || !address) {
    return (
      <section className={shell}>
        {blobs}
        <div className="relative mx-auto max-w-6xl">
          <div className="h-40 animate-pulse rounded-3xl bg-indigo-200/60" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="h-96 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
            <div className="h-80 animate-pulse rounded-3xl bg-white shadow-xl shadow-indigo-900/5" />
          </div>
          <p className="mt-6 text-center text-sm font-medium text-slate-500">
            Loading checkout...
          </p>
        </div>
      </section>
    );
  }

  const productImage = product.images?.[0] || product.image;

  const steps = [
    { label: "Address", done: true },
    { label: "Payment", done: false, active: true },
    { label: "Confirmation", done: false },
  ];

  const statusIsError = /fail|cancel/i.test(paymentStep);

  return (
    <section className={shell}>
      {blobs}

      <div className="relative mx-auto max-w-6xl">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-indigo-700 p-8 text-white shadow-2xl shadow-indigo-900/10 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/30" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
                <Lock size={14} /> Secure Checkout
              </p>
              <h1 className="mt-3 text-4xl font-extrabold">
                Complete your order
              </h1>
              <p className="mt-2 text-indigo-100">
                Review your item, confirm the address and choose how to pay.
              </p>
            </div>

            {/* steps */}
            <ol className="flex items-center gap-2 text-xs font-semibold">
              {steps.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      s.done
                        ? "bg-amber-400 text-slate-900"
                        : s.active
                          ? "bg-white text-indigo-700"
                          : "bg-white/20 text-indigo-100"
                    }`}
                  >
                    {s.done ? <Check size={14} /> : i + 1}
                  </span>
                  <span
                    className={
                      s.done || s.active ? "text-white" : "text-indigo-200"
                    }
                  >
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mx-1 h-px w-6 bg-white/30" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* ================= LEFT ================= */}
          <div className="space-y-5">
            {/* product */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/5"
            >
              <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                <PackageCheck size={15} /> Your item
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 p-2">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <PackageCheck size={28} className="text-indigo-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-lg font-bold text-slate-900">
                    {product.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Qty 1</p>
                </div>
                <p className="text-xl font-extrabold text-indigo-700">
                  {currency.format(product.price)}
                </p>
              </div>
            </motion.div>

            {/* address */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/5"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                  <MapPin size={15} /> Delivering to
                </p>
                <Link
                  href="/userAddress"
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Change
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-indigo-50/50 p-4">
                <p className="font-bold text-slate-900">{address.fullName}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {address.street}
                  <br />
                  {address.city}, {address.state} – {address.pincode}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={14} /> {address.phone}
                </p>
              </div>
            </motion.div>

            {/* payment */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/5"
            >
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
                <CreditCard size={15} /> Payment method
              </p>

              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                {paymentOptions.map(({ key, title, text, icon: Icon }) => {
                  const selected = paymentMethod === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={loading}
                      onClick={() => setPaymentMethod(key)}
                      className={`relative rounded-2xl border-2 p-4 text-left transition disabled:cursor-not-allowed ${
                        selected
                          ? "border-indigo-700 bg-indigo-50 shadow-md shadow-indigo-700/10"
                          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                      }`}
                    >
                      <span
                        className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? "border-indigo-700 bg-indigo-700 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {selected && <Check size={13} />}
                      </span>

                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                          selected
                            ? "bg-indigo-700 text-white"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        <Icon size={21} />
                      </span>
                      <p className="mt-3 font-bold text-slate-900">{title}</p>
                      <p className="mt-1 text-sm text-slate-500">{text}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* ================= SUMMARY ================= */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-fit rounded-3xl bg-white p-6 shadow-xl shadow-indigo-900/5 lg:sticky lg:top-24"
          >
            <h2 className="text-xl font-extrabold text-slate-900">
              Order summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">
                  {currency.format(product.price)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
            </div>

            <div className="my-5 border-t border-dashed border-slate-200" />

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-2xl font-extrabold text-indigo-700">
                {currency.format(product.price)}
              </span>
            </div>

            {/* status */}
            <div
              className={`mt-6 flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${
                statusIsError
                  ? "bg-red-50 text-red-700"
                  : loading
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-slate-50 text-slate-600"
              }`}
            >
              {loading ? (
                <Loader2 size={20} className="shrink-0 animate-spin" />
              ) : (
                <ShieldCheck
                  size={20}
                  className={`shrink-0 ${statusIsError ? "text-red-500" : "text-indigo-600"}`}
                />
              )}
              <span>{paymentStep}</span>
            </div>

            <motion.button
              onClick={handlePlaceOrder}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 py-4 text-base font-bold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {paymentMethod === "RAZORPAY"
                    ? "Processing Payment..."
                    : "Placing Order..."}
                </>
              ) : (
                <>
                  <Lock size={17} />
                  {paymentMethod === "RAZORPAY"
                    ? `Pay ${currency.format(product.price)}`
                    : "Place COD Order"}
                </>
              )}
            </motion.button>

            <div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-indigo-600" /> Payments
                are encrypted and secure
              </p>
              <p className="flex items-center gap-2">
                <Truck size={15} className="text-indigo-600" /> Free delivery
                on this order
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}