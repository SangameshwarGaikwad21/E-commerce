"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronRight,
  ClipboardList,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  Store,
  Users,
  X,
} from "lucide-react";

const sections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manage",
    items: [
      { name: "Products", path: "/admin/product/productlist", icon: Package },
      { name: "Categories", path: "/admin/category", icon: Layers },
      { name: "Orders", path: "/admin/orders", icon: ClipboardList },
      { name: "Users", path: "/admin/users", icon: Users },
    ],
  },
];

const allItems = sections.flatMap((s) => s.items);

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // active when on the exact page or any nested page under it
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const currentTitle =
    allItems.find((i) => isActive(i.path))?.name ?? "Admin";

  // close on Escape + lock body scroll while mobile drawer is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // close drawer after navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const username = session?.user?.username || "Admin";

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="rounded-xl p-2 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Menu size={24} />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-indigo-700">
              Admin
            </p>
            <h1 className="-mt-0.5 text-base font-extrabold text-slate-900">
              {currentTitle}
            </h1>
          </div>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* ================= OVERLAY ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 transform flex-col overflow-hidden bg-indigo-700 text-white shadow-2xl transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-[40px] border-indigo-500/40" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-500/30" />

        {/* Brand */}
        <div className="relative flex items-center justify-between px-5 py-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-700 shadow-lg">
              <ShieldCheck size={22} />
            </span>
            <div className="leading-tight">
              <p className="text-lg font-extrabold">YourStore</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                Admin Panel
              </p>
            </div>
          </Link>

          <button
            className="rounded-lg p-1.5 text-indigo-100 transition hover:bg-white/15 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="relative flex-1 overflow-y-auto px-4 pb-4">
          {sections.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-200/70">
                {section.label}
              </p>

              <div className="flex flex-col gap-1">
                {section.items.map(({ name, path, icon: Icon }) => {
                  const active = isActive(path);

                  return (
                    <Link
                      key={path}
                      href={path}
                      aria-current={active ? "page" : undefined}
                      className="group relative"
                    >
                      {active && (
                        <motion.span
                          layoutId="admin-active-pill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute inset-0 rounded-xl bg-white shadow-lg"
                        />
                      )}

                      <div
                        className={`relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
                          active
                            ? "text-indigo-700"
                            : "text-indigo-100 group-hover:bg-white/10 group-hover:text-white"
                        }`}
                      >
                        <Icon
                          size={19}
                          className={active ? "text-indigo-700" : "text-indigo-200 group-hover:text-amber-400"}
                        />
                        <span className="flex-1">{name}</span>
                        <ChevronRight
                          size={15}
                          className={`transition ${
                            active
                              ? "text-indigo-400"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: back to store + user card */}
        <div className="relative space-y-3 border-t border-white/15 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-indigo-100 transition hover:bg-white/10 hover:text-white"
          >
            <Store size={18} className="text-amber-400" />
            Back to store
          </Link>

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-extrabold text-slate-900">
              {username.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{username}</p>
              <p className="text-xs capitalize text-indigo-200">
                {session?.user?.role || "admin"}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              aria-label="Logout"
              title="Logout"
              className="rounded-lg p-2 text-indigo-100 transition hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;