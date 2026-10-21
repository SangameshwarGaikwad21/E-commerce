"use client";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import {
  ChevronDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";

const menuItem =
  "flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const products = useAppSelector((state) => state.product.products);

  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    ) as string[];
  }, [products]);

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";

  const goToProducts = (search: string, category: string) => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category !== "all") params.set("category", category);

    const query = params.toString();
    setMobileOpen(false);
    setProfileOpen(false);
    router.push(query ? `/product?${query}` : "/product");
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") || "");
    const category = String(formData.get("category") || "all");

    goToProducts(search, category);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const form = event.currentTarget.form;
    const formData = form ? new FormData(form) : null;
    const search = formData ? String(formData.get("search") || "") : "";

    goToProducts(search, event.target.value);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl p-2 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-md shadow-indigo-700/30">
                <ShoppingBag size={20} />
              </span>
              <span className="text-xl font-extrabold text-slate-900">
                Your<span className="text-indigo-700">Store</span>
              </span>
            </Link>
          </div>

          {/* DESKTOP SEARCH */}
          <form
            key={`desktop-${currentSearch}-${currentCategory}`}
            onSubmit={handleSearch}
            className="hidden w-[560px] grid-cols-[1fr_190px] overflow-hidden rounded-full border border-slate-200 bg-indigo-50/60 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/15 md:grid"
          >
            <label className="relative flex items-center">
              <input
                ref={searchRef}
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search products..."
                className="h-11 w-full bg-transparent pl-5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 text-slate-400 transition hover:text-indigo-600"
              >
                <Search size={18} />
              </button>
            </label>

            <label className="relative flex items-center border-l border-slate-200">
              <select
                name="category"
                defaultValue={currentCategory}
                onChange={handleCategoryChange}
                className="h-11 w-full appearance-none bg-transparent pl-4 pr-9 text-sm text-slate-700 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 text-slate-400"
              />
            </label>
          </form>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            {/* CART */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative rounded-xl p-2.5 text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              <FaShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-bold text-slate-900 shadow">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Account menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white shadow-md shadow-indigo-700/30 transition hover:bg-indigo-800"
              >
                {session?.user?.username ? (
                  session.user.username.charAt(0).toUpperCase()
                ) : (
                  <User size={18} />
                )}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-2xl shadow-indigo-900/10"
                  >
                    {session ? (
                      <>
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="text-xs text-slate-500">Signed in as</p>
                          <p className="truncate text-sm font-bold text-slate-900">
                            {session.user.username}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className={menuItem}
                        >
                          <User size={16} /> Profile
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setProfileOpen(false)}
                          className={menuItem}
                        >
                          <Package size={16} /> My Orders
                        </Link>

                        {session.user.role === "admin" && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                          >
                            <LayoutDashboard size={16} /> Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setProfileOpen(false)}
                          className={menuItem}
                        >
                          <LogIn size={16} /> Login
                        </Link>

                        <Link
                          href="/register"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                        >
                          <UserPlus size={16} /> Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <form
          key={`mobile-${currentSearch}-${currentCategory}`}
          onSubmit={handleSearch}
          className="mt-3 grid gap-2 md:hidden"
        >
          <label className="relative flex h-11 items-center rounded-full border border-slate-200 bg-indigo-50/60 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/15">
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search products..."
              className="h-full w-full bg-transparent pl-4 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <Search
              size={17}
              className="pointer-events-none absolute right-3 text-slate-400"
            />
          </label>

          <label className="relative flex h-11 items-center rounded-full border border-slate-200 bg-indigo-50/60">
            <select
              name="category"
              defaultValue={currentCategory}
              onChange={handleCategoryChange}
              className="h-full w-full appearance-none bg-transparent pl-4 pr-10 text-sm text-slate-700 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 text-slate-400"
            />
          </label>
        </form>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-indigo-900/5 md:hidden"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid gap-1 text-sm">
                {[
                  { href: "/", label: "Home" },
                  { href: "/product", label: "Products" },
                  { href: "/cart", label: "Cart" },
                  { href: "/orders", label: "My Orders" },
                  { href: "/profile", label: "Profile" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-2.5 font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;