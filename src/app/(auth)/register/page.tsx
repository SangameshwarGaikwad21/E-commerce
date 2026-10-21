"use client";

import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

import { AppDispatch, RootState } from "@/redux/store";
import { registerUser } from "@/redux/fetures/authSlice";
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

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
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

const RegisterPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(registerUser(form)).unwrap();
      toast.success("Account created successfully");

      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (!result?.error) {
        router.push("/");
      } else {
        toast.error("Account created, but sign in failed. Please log in.");
        router.push("/login");
      }
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Registration failed");
    }
  };

  // Works only if the provider is set up in your NextAuth config
  const handleSocial = (provider: "google" | "github") => signIn(provider, { callbackUrl: "/" });

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
              <h1 className="text-4xl font-bold leading-tight">Welcome to your new favourite store.</h1>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-indigo-100">
                Create an account to track orders, save addresses and check out in a few taps.
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

          {/* RIGHT: register form */}
          <section className="p-6 sm:p-10 md:p-12">
            <div className="mb-8 md:hidden">
              <Logo />
            </div>

            <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-slate-700">
                  Name
                </Label>
                <div className="relative">
                  <User size={18} className={iconClass} />
                  <Input id="username" name="username" autoComplete="name" required placeholder="Enter your name" value={form.username} onChange={handleChange} className={fieldClass} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail size={18} className={iconClass} />
                  <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} className={fieldClass} />
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
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

              <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm text-slate-600">
                <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-indigo-700" />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="font-medium text-indigo-700 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-medium text-indigo-700 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full gap-2 rounded-xl bg-indigo-700 font-semibold text-white shadow-lg shadow-indigo-700/25 transition hover:bg-indigo-800 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight size={18} />}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-700 underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </section>
        </motion.div>
      </main>
    </MotionConfig>
  );
};

export default RegisterPage;