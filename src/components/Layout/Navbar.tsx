"use client";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { ChevronDown, Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProducts } from "@/redux/fetures/productSlice";
import { useEffect } from "react";

const Navbar = () => {
  const [, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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
      className="sticky top-0 z-50 bg-slate-900 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            <Link href="/">
              <h1 className="text-2xl font-bold text-white">
                Store<span className="text-blue-500">_App</span>
              </h1>
            </Link>
          </div>

          <form
            key={`desktop-${currentSearch}-${currentCategory}`}
            onSubmit={handleSearch}
            className="hidden md:grid w-[560px] grid-cols-[1fr_190px] overflow-hidden rounded-full border border-slate-700 bg-slate-800"
          >
            <label className="relative flex items-center">
              <input
                ref={searchRef}
                type="text"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search products..."
                className="h-10 w-full bg-transparent pl-5 pr-10 text-sm text-white placeholder:text-gray-400 focus:outline-none"
              />

              <Search
                size={18}
                className="absolute right-3 text-gray-400 pointer-events-none"
              />
            </label>

            <label className="relative flex items-center border-l border-slate-700">
              <select
                name="category"
                defaultValue={currentCategory}
                onChange={handleCategoryChange}
                className="h-10 w-full appearance-none bg-transparent pl-4 pr-9 text-sm text-white outline-none"
              >
                <option className="bg-slate-950" value="all">
                  All Categories
                </option>
                {categories.map((category) => (
                  <option className="bg-slate-950" key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 text-gray-400"
              />
            </label>
          </form>
          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* CART */}
            <Link href="/cart" className="relative">
              <div className="text-white p-2 hover:scale-110 transition">
                <FaShoppingCart size={22} />

                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-[2px] rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </Link>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <User className="text-white" size={20} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {session ? (
                      <>
                        <div className="px-4 py-3 text-sm text-gray-400 border-b border-white/10">
                          {session.user.username}
                        </div>

                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-white hover:bg-white/10"
                        >
                          Profile
                        </Link>

                        {session.user.role === "admin" && (
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-purple-400 hover:bg-white/10"
                          >
                            Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-white hover:bg-white/10"
                        >
                          Login
                        </Link>

                        <Link
                          href="/register"
                          className="block px-4 py-2 text-blue-400 hover:bg-white/10"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        <form
          key={`mobile-${currentSearch}-${currentCategory}`}
          onSubmit={handleSearch}
          className="mt-3 grid gap-2 md:hidden"
        >
          <label className="relative flex h-10 items-center rounded-full border border-slate-700 bg-slate-800">
            <input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search products..."
              className="h-full w-full bg-transparent pl-4 pr-10 text-sm text-white outline-none placeholder:text-gray-400"
            />
            <Search
              size={17}
              className="pointer-events-none absolute right-3 text-gray-400"
            />
          </label>

          <label className="relative flex h-10 items-center rounded-full border border-slate-700 bg-slate-800">
            <select
              name="category"
              defaultValue={currentCategory}
              onChange={handleCategoryChange}
              className="h-full w-full appearance-none bg-transparent pl-4 pr-10 text-sm text-white outline-none"
            >
              <option className="bg-slate-950" value="all">
                All Categories
              </option>
              {categories.map((category) => (
                <option className="bg-slate-950" key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 text-gray-400"
            />
          </label>
        </form>
      </div>
    </motion.header>
  );
};

export default Navbar;
