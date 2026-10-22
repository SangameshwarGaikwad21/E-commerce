"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import {
  ArrowRight,
  ArrowUp,
  Headphones,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

const perks = [
  { icon: Truck, title: "Free Delivery", text: "On orders above ₹499" },
  { icon: ShieldCheck, title: "Secure Payments", text: "100% protected checkout" },
  { icon: RotateCcw, title: "Easy Returns", text: "7-day hassle-free returns" },
  { icon: Headphones, title: "24/7 Support", text: "We're here to help" },
];

const shopLinks = [
  { href: "/", label: "Home" },
  { href: "/product", label: "All Products" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "My Orders" },
];

const accountLinks = [
  { href: "/profile", label: "My Profile" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Create Account" },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaGithub, label: "GitHub", href: "#" },
];

const linkClass =
  "text-indigo-100/80 transition hover:translate-x-1 hover:text-amber-400";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-indigo-700 text-white"
    >
      {/* decorative circles */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[56px] border-indigo-500/40" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-indigo-500/30" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* PERKS */}
        <div className="grid grid-cols-2 gap-4 border-b border-white/15 py-8 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-amber-400">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold">{title}</p>
                <p className="truncate text-xs text-indigo-100/80">{text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-700">
                <ShoppingBag size={22} />
              </span>
              <span className="text-2xl font-extrabold">YourStore</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-indigo-100/80">
              Your one-stop destination for premium shopping. Quality products,
              fast delivery, and amazing deals.
            </p>

            <div className="mt-6 flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -4, scale: 1.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-amber-400 hover:text-slate-900"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-amber-400">
              Shop
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              {shopLinks.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-amber-400">
              Account
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              {accountLinks.map((l) => (
                <Link key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter + contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-amber-400">
              Stay in the loop
            </h3>
            <p className="text-sm text-indigo-100/80">
              Get offers and new arrivals straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-200"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-11 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-3 text-sm text-white placeholder:text-indigo-200/70 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20"
                />
              </div>
              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                aria-label="Subscribe"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-900 transition hover:bg-amber-300"
              >
                <ArrowRight size={18} />
              </motion.button>
            </form>

            <div className="mt-5 space-y-2 text-sm text-indigo-100/80">
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-amber-400" /> +91 00000 00000
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={15} className="text-amber-400" /> Maharashtra, India
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 py-6 text-sm text-indigo-100/70 sm:flex-row">
          <p>© {new Date().getFullYear()} YourStore. All rights reserved.</p>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-semibold text-white transition hover:bg-amber-400 hover:text-slate-900"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;