"use client";
import axiosInstance from "@/lib/axios";
import { addAddress } from "@/redux/fetures/addresSlice";
import { useAppDispatch } from "@/redux/hooks";
import { motion } from "framer-motion";
import {
  Building2,
  Hash,
  Home,
  Landmark,
  Loader2,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  Truck,
  User,
} from "lucide-react";
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

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const inputWrap =
  "relative flex items-center rounded-xl border border-slate-200 bg-indigo-50/60 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/15";
const inputClass =
  "h-12 w-full bg-transparent pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400";

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

  const setField = (key: keyof AddressForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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

    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      toast.error("Enter a valid 6-digit pincode");
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

  const hasPreview = form.fullName || form.street || form.city;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-slate-50 to-sky-100 px-4 py-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-900/10 md:grid-cols-[0.9fr_1.1fr]"
      >
        {/* ================= LEFT PANEL ================= */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-indigo-700 p-10 text-white md:flex">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[48px] border-indigo-500/40" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-500/30" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-700">
              <Truck size={24} />
            </div>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-amber-400">
              Delivery
            </p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight">
              Where should we send your order?
            </h2>
            <p className="mt-3 text-indigo-100">
              Save your address once and checkout in a single tap.
            </p>
          </div>

          {/* live address card */}
          <div className="relative mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Address preview
            </p>
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-900">
                  <MapPin size={18} />
                </span>
                {hasPreview ? (
                  <div className="min-w-0 text-sm leading-6">
                    <p className="truncate text-base font-bold">
                      {form.fullName || "Full name"}
                    </p>
                    <p className="text-indigo-100">
                      {form.street || "Street address"}
                    </p>
                    <p className="text-indigo-100">
                      {[form.city, form.state].filter(Boolean).join(", ") ||
                        "City, State"}
                      {form.pincode ? ` – ${form.pincode}` : ""}
                    </p>
                    {form.phone && (
                      <p className="mt-1 flex items-center gap-1.5 text-indigo-100">
                        <Phone size={13} /> {form.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-indigo-100">
                    Your address will appear here as you type.
                  </p>
                )}
              </div>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-indigo-100">
              <ShieldCheck size={15} className="text-amber-400" />
              Your details are only used for delivery.
            </p>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="p-6 sm:p-10">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-indigo-700">
                Delivery
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
                {form._id ? "Edit Address" : "Add Address"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {form._id
                  ? "Update your saved delivery details."
                  : "Enter the address where you want your orders delivered."}
              </p>
            </div>

            {form._id ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                title="Delete address"
                aria-label="Delete address"
              >
                {deleting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* full name */}
            <div>
              <label className={labelClass} htmlFor="fullName">
                Full name
              </label>
              <div className={inputWrap}>
                <User
                  size={18}
                  className="pointer-events-none absolute left-4 text-slate-400"
                />
                <input
                  id="fullName"
                  autoComplete="name"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* phone */}
            <div>
              <label className={labelClass} htmlFor="phone">
                Phone number
              </label>
              <div className={inputWrap}>
                <Phone
                  size={18}
                  className="pointer-events-none absolute left-4 text-slate-400"
                />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) =>
                    setField("phone", e.target.value.replace(/\D/g, ""))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* street */}
            <div>
              <label className={labelClass} htmlFor="street">
                Street address
              </label>
              <div className={inputWrap}>
                <Home
                  size={18}
                  className="pointer-events-none absolute left-4 text-slate-400"
                />
                <input
                  id="street"
                  autoComplete="street-address"
                  placeholder="House No / Area / Road"
                  value={form.street}
                  onChange={(e) => setField("street", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* city + state */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="city">
                  City
                </label>
                <div className={inputWrap}>
                  <Building2
                    size={18}
                    className="pointer-events-none absolute left-4 text-slate-400"
                  />
                  <input
                    id="city"
                    autoComplete="address-level2"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="state">
                  State
                </label>
                <div className={inputWrap}>
                  <Landmark
                    size={18}
                    className="pointer-events-none absolute left-4 text-slate-400"
                  />
                  <input
                    id="state"
                    autoComplete="address-level1"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* pincode */}
            <div>
              <label className={labelClass} htmlFor="pincode">
                Pincode
              </label>
              <div className={inputWrap}>
                <Hash
                  size={18}
                  className="pointer-events-none absolute left-4 text-slate-400"
                />
                <input
                  id="pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  placeholder="6-digit pincode"
                  value={form.pincode}
                  onChange={(e) =>
                    setField("pincode", e.target.value.replace(/\D/g, ""))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 font-semibold text-white shadow-lg shadow-indigo-700/30 transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {form._id ? "Update Address" : "Save Address"}
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}