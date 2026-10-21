"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShoppingBag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Edit these to match your store
const BRAND = "YourStore";
const stats = [
  { value: "10k+", label: "Products" },
  { value: "50+", label: "Categories" },
  { value: "25k", label: "Customers" },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const Logo = ({ light = false }: { light?: boolean }) => (
  <Link href="/" className="flex items-center gap-3">
    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${light ? "bg-white text-indigo-700" : "bg-indigo-700 text-white"}`}>
      <ShoppingBag size={22} />
    </span>
    <span className={`text-xl font-semibold ${light ? "text-white" : "text-slate-900"}`}>{BRAND}</span>
  </Link>
);

const fieldClass =
  "h-12 rounded-xl border-slate-300 bg-white pl-11 text-[15px] text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-600/15";
const iconClass = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400";

export default function LoginPage() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      router.replace("/");
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Login successful");
      router.replace("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      await signIn("google", { callbackUrl: "/" });
    } catch {
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  if (status === "loading") return null;

  const busy = loading || googleLoading;

  return (
    <MotionConfig reducedMotion="user">
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-slate-100 to-sky-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-indigo-900/15 md:grid-cols-2"
        >
          {/* LEFT: text panel */}
          <section className="relative hidden flex-col justify-between overflow-hidden bg-indigo-700 p-12 text-white md:flex">
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full border-[48px] border-indigo-600/50" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-indigo-600/40" aria-hidden="true" />

            <div className="relative">
              <Logo light />
            </div>

            <div className="relative">
              <h1 className="text-4xl font-bold leading-tight">Good to see you again.</h1>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-indigo-100">
                Log in to check your orders, pick up your cart and shop where you left off.
              </p>
            </div>

            <dl className="relative flex gap-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-2xl font-bold text-amber-300">{s.value}</dd>
                  <p className="text-sm text-indigo-200" aria-hidden="true">
                    {s.label}
                  </p>
                </div>
              ))}
            </dl>
          </section>

          {/* RIGHT: login form */}
          <section className="flex flex-col justify-center p-6 sm:p-10 md:p-12">
            <div className="mb-8 md:hidden">
              <Logo />
            </div>

            <h2 className="text-3xl font-bold text-slate-900">Login</h2>
            <p className="mt-1.5 text-slate-600">Pick up right where you left off.</p>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={busy}
              className="mt-7 h-12 w-full gap-2 rounded-xl border-slate-300 bg-white font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-60"
            >
              <GoogleIcon />
              {googleLoading ? "Connecting to Google..." : "Continue with Google"}
            </Button>

            <div className="my-6 flex items-center gap-4 text-sm text-slate-500">
              <span className="h-px flex-1 bg-slate-200" />
              or continue with email
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail size={18} className={iconClass} />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock size={18} className={iconClass} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${fieldClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-3 flex items-center rounded-md px-1 text-slate-500 transition hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={busy}
                className="h-12 w-full gap-2 rounded-xl bg-indigo-700 font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight size={18} />}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New here?{" "}
              <Link href="/register" className="font-semibold text-indigo-700 underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </section>
        </motion.div>
      </main>
    </MotionConfig>
  );
}