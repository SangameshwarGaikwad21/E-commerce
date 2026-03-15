"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      if (session?.user?.role === "admin") {
        router.replace("/");
      } else {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Login successful");
  };

  if (status === "loading") return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black px-4 overflow-hidden">
      
      {/* Animated Background */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute w-[500px] h-[500px] bg-indigo-500/25 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

          <h2 className="text-3xl font-bold text-center text-white">
            Welcome Back
          </h2>

          <p className="text-center text-gray-400 text-sm mt-2">
            Login to continue shopping 🛒
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">

            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl h-11"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
            <div className="text-center text-sm text-gray-400 mt-4">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-400 font-medium underline-offset-4 hover:underline"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}