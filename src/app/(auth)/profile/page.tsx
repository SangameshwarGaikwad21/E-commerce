"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    toast.success("User logged out successfully");
    router.replace("/login");
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          My Profile 👤
        </h2>

        {/* User Info */}
        <div className="space-y-4 mb-8">
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-white font-semibold">
              {session.user?.username}
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-white font-semibold">
              {session.user?.email}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleChangePassword}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl h-11 shadow-lg shadow-blue-600/30"
          >
            🔐 Change Password
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded-xl h-11 shadow-lg shadow-red-600/30 disabled:opacity-50"
          >
            {loading ? "Logging out..." : "🚪 Logout"}
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}