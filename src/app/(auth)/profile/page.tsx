"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion, MotionConfig } from "framer-motion";
import { LockKeyhole, LogOut, MapPin, Mail, Pencil, Plus, User } from "lucide-react";

type SavedAddress = {
  fullName?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  street?: string;
};

const getSavedAddress = (userId?: string): SavedAddress | null => {
  if (!userId || typeof window === "undefined") return null;

  const storedAddress = localStorage.getItem(`address_${userId}`);
  if (!storedAddress) return null;

  try {
    return JSON.parse(storedAddress);
  } catch {
    return null;
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-sky-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-4 border-indigo-700 border-t-transparent"
        />
      </div>
    );
  }

  if (!session) return null;

  const address = getSavedAddress(session.user?.id);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-sky-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-900/15 lg:grid-cols-[0.9fr_1.1fr]"
        >
          {/* LEFT: profile summary */}
          <section className="relative overflow-hidden bg-indigo-700 p-8 text-white sm:p-10">
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-[48px] border-indigo-600/50" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-indigo-600/40" aria-hidden="true" />

            <div className="relative">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-4xl font-bold text-indigo-700 shadow-xl shadow-indigo-950/20">
                {session.user?.username?.charAt(0).toUpperCase()}
              </div>

              <p className="mt-8 text-sm font-medium text-indigo-200">My profile</p>
              <h1 className="mt-1 break-words text-4xl font-bold">{session.user?.username}</h1>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-300">
                    <Mail size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-indigo-200">Email</p>
                    <p className="truncate text-sm font-medium">{session.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-300">
                    <User size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-indigo-200">Role</p>
                    <p className="text-sm font-medium capitalize">{session.user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: address and actions */}
          <section className="p-8 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Saved address</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">Delivery details</h2>
              </div>

              <button
                type="button"
                onClick={() => router.push("/userAddress")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {address ? <Pencil size={16} /> : <Plus size={16} />}
                {address ? "Edit address" : "Add address"}
              </button>
            </div>

            <div className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              {address ? (
                <div>
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <MapPin size={22} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-slate-900">{address.fullName}</p>
                      <p className="mt-2 leading-7 text-slate-600">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">{address.phone}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Country</p>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900">India</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                    <MapPin size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">No address saved yet</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
                    Add your delivery address to make checkout faster.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => router.push("/forgotpassword")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <LockKeyhole size={17} />
                Change password
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                <LogOut size={17} />
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </section>
        </motion.div>
      </main>
    </MotionConfig>
  );
}