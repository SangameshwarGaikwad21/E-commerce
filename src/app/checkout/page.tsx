"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    const storedProduct = localStorage.getItem("buyNowItem");
    const storedAddress = localStorage.getItem("address");

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
  }, []);

  if (!product || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        body: JSON.stringify({
          product,
          address,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully 🎉");
        localStorage.removeItem("buyNowItem");
        router.push("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6 py-16 flex items-center justify-center">

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Checkout
        </h1>

        {/* PRODUCT */}
        <div className="border border-white/10 bg-white/5 p-4 rounded-xl mb-4">
          <h2 className="text-lg font-semibold text-purple-400 mb-2">
            Product
          </h2>
          <p className="text-white">{product.title}</p>
          <p className="text-white font-bold mt-1">
            ₹{product.price}
          </p>
        </div>

        {/* ADDRESS */}
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
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition transform hover:scale-[1.02] shadow-lg"
        >
          Place Order
        </button>

      </div>
    </section>
  );
}