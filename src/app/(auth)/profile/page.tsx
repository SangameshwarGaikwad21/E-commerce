"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    toast.success("User logged out successfully");
    router.replace("/login");
  };

  const handleChangePassword = () => {
    router.push("/forgotpassword");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-3">
          Account Settings ⚙️
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          Manage your account security or logout safely.
        </p>

        <div className="space-y-4">

          {/* Change Password Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleChangePassword}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl h-11 shadow-lg shadow-blue-600/30"
          >
            🔐 Change Password
          </motion.button>

          {/* Logout Button */}
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