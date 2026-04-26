"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-16 text-white sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-blue-900/20 blur-3xl opacity-30" />
        <div className="absolute top-[-100px] left-[-100px] h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[130px]" />
        <div className="absolute bottom-[-120px] right-[-100px] h-[420px] w-[420px] rounded-full bg-pink-600/20 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/40 backdrop-blur-2xl"
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-white/10 bg-white/[0.04] p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-4xl font-bold shadow-2xl shadow-black/30">
              {session.user?.username?.charAt(0).toUpperCase()}
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-purple-400">
                My Profile
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                {session.user?.username}
              </h1>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-purple-400">
                  <Mail size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Email
                  </p>
                  <p className="truncate text-sm font-medium text-white/90">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                  <User size={18} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Role
                  </p>
                  <p className="text-sm font-medium capitalize text-white/90">
                    {session.user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/40">
                  Saved Address
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Delivery Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => router.push("/userAddress")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-950/20 transition hover:opacity-90"
              >
                {address ? <Pencil size={16} /> : <Plus size={16} />}
                {address ? "Edit Address" : "Add Address"}
              </button>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-6 shadow-inner shadow-black/30">
              {address ? (
                <div>
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                      <MapPin size={22} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-white">
                        {address.fullName}
                      </p>
                      <p className="mt-2 leading-7 text-white/65">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Phone
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {address.phone}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                        Country
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        India
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-purple-400">
                    <MapPin size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">
                    No address saved yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">
                    Add your delivery address to make checkout faster.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => router.push("/forgotpassword")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <LockKeyhole size={17} />
                Change Password
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                <LogOut size={17} />
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
