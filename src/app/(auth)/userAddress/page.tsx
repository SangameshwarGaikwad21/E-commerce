"use client";

import axiosInstance from "@/lib/axios";
import { addAddress } from "@/redux/fetures/addresSlice";
import { useAppDispatch } from "@/redux/hooks";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

type AddressForm = {
  _id?: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  street: string;
};

const emptyForm: AddressForm = {
  fullName: "",
  phone: "",
  city: "",
  state: "",
  pincode: "",
  street: "",
};

export default function Page() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!userId) {
      router.push("/login");
      return;
    }

    const loadAddress = async () => {
      try {
        const res = await axiosInstance.get("/address/get");
        if (res.data.address) {
          setForm(res.data.address);
          localStorage.setItem(`address_${userId}`, JSON.stringify(res.data.address));
        }
      } catch {
        const stored = localStorage.getItem(`address_${userId}`);
        if (stored) setForm(JSON.parse(stored));
      }
    };

    loadAddress();
  }, [router, status, userId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Please login first");
      return;
    }

    if (!form.fullName || !form.phone || !form.city || !form.state || !form.pincode || !form.street) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const savedAddress = form._id
        ? await axiosInstance.patch("/address/update", form).then((res) => res.data.data)
        : await dispatch(addAddress({ ...form, userId })).unwrap();

      localStorage.setItem(`address_${userId}`, JSON.stringify(savedAddress));
      setForm(savedAddress);
      toast.success(form._id ? "Address updated" : "Address saved");
    } catch {
      toast.error("Address save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !form._id) return;
    if (!window.confirm("Delete saved address?")) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(`/address/delete?id=${form._id}`);
      localStorage.removeItem(`address_${userId}`);
      setForm(emptyForm);
      toast.success("Address deleted");
    } catch {
      toast.error("Address delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30 pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-400">
              Delivery
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white">
              {form._id ? "Edit Address" : "Add Address"}
            </h1>
          </div>

          {form._id ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
              title="Delete address"
            >
              <Trash2 size={18} />
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { key: "fullName", placeholder: "Full Name" },
            { key: "phone", placeholder: "Phone Number" },
            { key: "city", placeholder: "City" },
            { key: "state", placeholder: "State" },
            { key: "pincode", placeholder: "Pincode" },
            { key: "street", placeholder: "Street (House No / Area / Road)" },
          ].map((field) => (
            <input
              key={field.key}
              placeholder={field.placeholder}
              value={form[field.key as keyof AddressForm] || ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  [field.key]: event.target.value,
                })
              }
              className="bg-white/10 border border-white/10 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : form._id ? "Update Address" : "Save Address"}
          </button>
        </form>
      </div>
    </section>
  );
}
