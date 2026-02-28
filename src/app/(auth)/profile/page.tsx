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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl text-center w-96"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to Leave?
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Click below to securely log out of your account.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold rounded-xl h-11"
        >
          {loading ? "Logging out..." : "Logout"}
        </motion.button>
      </motion.div>
    </div>
  );
}