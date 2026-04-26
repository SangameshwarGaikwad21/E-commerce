"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { createOrder } from "@/redux/fetures/orderSlice";
import type { AppDispatch } from "@/redux/store";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import { CreditCard, Home, MapPin, PackageCheck, ShieldCheck } from "lucide-react";

type ProductItem = {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  images?: string[];
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
          color: "#10b981",
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

  if (!product || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading checkout...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-12 text-white sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30" />
        <div className="absolute top-[-100px] left-[-100px] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-120px] right-[-100px] h-[420px] w-[420px] rounded-full bg-pink-600/20 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-purple-400">
            Secure Checkout
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Complete your order
          </h1>

          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                  <PackageCheck size={22} />
                </span>
                <div>
                  <p className="text-lg font-semibold">{product.title}</p>
                  <p className="mt-1 text-2xl font-bold text-purple-400">
                    Rs. {product.price}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-300">
                  <MapPin size={22} />
                </span>
                <div>
                  <p className="font-semibold">{address.fullName}</p>
                  <p className="mt-2 leading-7 text-white/65">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.pincode}
                    <br />
                    {address.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <h2 className="text-lg font-semibold">Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("RAZORPAY")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "RAZORPAY"
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <CreditCard className="text-purple-400" size={22} />
                  <p className="mt-3 font-semibold">Online Payment</p>
                  <p className="mt-1 text-sm text-white/55">
                    Pay securely with Razorpay.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    paymentMethod === "COD"
                      ? "border-purple-500/50 bg-purple-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <Home className="text-purple-400" size={22} />
                  <p className="mt-3 font-semibold">Cash on Delivery</p>
                  <p className="mt-1 text-sm text-white/55">
                    Pay when your order arrives.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-8">
          <h2 className="text-2xl font-semibold">Order Summary</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-white/65">
              <span>Subtotal</span>
              <span>Rs. {product.price}</span>
            </div>
            <div className="flex justify-between text-white/65">
              <span>Delivery</span>
              <span className="text-purple-400">Free</span>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>Rs. {product.price}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
            <ShieldCheck className="shrink-0 text-purple-400" size={21} />
            <span>{paymentStep}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-base font-bold text-white shadow-xl shadow-purple-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/20 disabled:text-white/50"
          >
            {loading
              ? paymentMethod === "RAZORPAY"
                ? "Processing Payment..."
                : "Placing Order..."
              : paymentMethod === "RAZORPAY"
                ? "Pay and Place Order"
                : "Place COD Order"}
          </button>
        </aside>
      </div>
    </section>
  );
}
