"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { createOrder } from "@/redux/fetures/orderSlice";
import toast from "react-hot-toast";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const [product, setProduct] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dispatch: any = useDispatch();

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) return;

    const storedProduct = localStorage.getItem("buyNowItem");
    const storedAddress = localStorage.getItem(`address_${userId}`);

    if (!storedProduct) {
      router.push("/");
      return;
    }

    setProduct(JSON.parse(storedProduct));

    if (storedAddress) {
      setAddress(JSON.parse(storedAddress));
    } else {
      router.push("/userAddress");
    }
  }, [userId, status, router]);

  if (!product || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        user:userId,
      orderItems: [{
        product: product._id ?? product.id,
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

     paymentMethod: "COD",
    };
      await dispatch(createOrder(orderPayload)).unwrap();

      toast.success("Order placed successfully 🎉");

      localStorage.removeItem("buyNowItem");

      router.push("/order/order-success");
    } catch (err: any) {
      alert(err || "Order failed ❌");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-16 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Checkout
        </h1>

        {/* Product */}
        <div className="border border-white/10 bg-white/5 p-4 rounded-xl mb-4">
          <h2 className="text-lg font-semibold text-purple-400 mb-2">
            Product
          </h2>
          <p className="text-white">{product.title}</p>
          <p className="text-white font-bold mt-1">₹{product.price}</p>
        </div>

        {/* Address */}
        <div className="border border-white/10 bg-white/5 p-4 rounded-xl mb-6">
          <h2 className="text-lg font-semibold text-purple-400 mb-2">
            Delivery Address
          </h2>
          <p className="text-white font-semibold">{address.fullName}</p>
          <p className="text-gray-400">{address.street}</p>
          <p className="text-gray-400">
            {address.city}, {address.state}
          </p>
          <p className="text-gray-400">{address.pincode}</p>
          <p className="text-gray-400">{address.phone}</p>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition transform shadow-lg ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 hover:scale-[1.02]"
          } text-white`}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

      </div>
    </section>
  );
}