"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-semibold">
            {session.user?.username?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {session.user?.username}
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {session.user?.email}
          </p>  
        </div>

        <div className="my-8 border-t border-gray-200" />

        <div className="space-y-3">
          <button
            onClick={() => router.push("/forgotpassword")}
            className="w-full h-11 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Change Password
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full h-11 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}