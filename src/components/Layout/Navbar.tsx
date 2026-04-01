"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { Search, Menu, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();

  const cartItems = useAppSelector((state) => state.cart.items);

  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

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

          {/* SEARCH */}
         <div className="hidden md:flex items-center w-[450px] relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-10 rounded-full pl-5 pr-10 
                bg-slate-800 border border-slate-700 
                text-white placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Search
                size={18}
                className="absolute right-3 text-gray-400 pointer-events-none"
              />

            </div>
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
      </div>
    </motion.header>
  );
};

export default Navbar;