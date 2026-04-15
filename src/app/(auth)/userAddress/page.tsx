"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addAddress } from "@/redux/fetures/addresSlice";

export default function Page() {
  const dispatch: any = useDispatch();
  const userId = "507f1f77bcf86cd799439011";

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    street: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.phone ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.street
    ) {
      alert("Please fill all fields bro 😅");
      return;
    }

    dispatch(addAddress({ ...form, userId }))
      .unwrap()
      .then((res: any) => {
        alert("Address added ✅");
        localStorage.setItem("address", JSON.stringify(res));

        setForm({
          fullName: "",
          phone: "",
          city: "",
          state: "",
          pincode: "",
          street: "",
        });
      })
      .catch((err: any) => {
        alert(err?.message || "Something went wrong ❌");
      });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4">

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Add Address
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* INPUT STYLE */}
          {[
            { key: "fullName", placeholder: "Full Name" },
            { key: "phone", placeholder: "Phone Number" },
            { key: "city", placeholder: "City" },
            { key: "state", placeholder: "State" },
            { key: "pincode", placeholder: "Pincode" },
            { key: "street", placeholder: "Street (House No / Area / Road)" },
          ].map((field: any) => (
            <input
              key={field.key}
              placeholder={field.placeholder}
              value={(form as any)[field.key]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [field.key]: e.target.value,
                })
              }
              className="bg-white/10 border border-white/10 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          ))}

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition transform hover:scale-[1.02] shadow-lg"
          >
            Save Address
          </button>

        </form>
      </div>
    </section>
  );
}