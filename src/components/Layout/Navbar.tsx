"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { Search, Menu, X, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();

  // ✅ Get cart items from Redux
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalQuantity = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "bg-black/80 border-b border-white/10 py-2"
            : "bg-black/60 py-4"
        }`}
      >
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(true)}
            >
            <Menu size={26} />
          </button>

          <Link href="/">
            <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Store_App
            </h1>
            </Link>
          </div>

           
          <div className="hidden md:flex items-center w-[420px] relative">
            <Input
                placeholder="Search products..."
                className="py-5 rounded-full pr-16 pl-6 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition"
              />
              <Search size={20} className="absolute right-5 text-gray-400" />
            </div>

       
            <div className="flex items-center gap-5">

              
              <Link href="/cart" className="hidden md:block relative">
                <motion.div
                  animate={{ scale: totalQuantity ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-white p-2 relative hover:scale-110 transition-transform duration-200"
                >
                  <FaShoppingCart size={22} />

                  {totalQuantity > 0 && (
                    <motion.span
                      key={totalQuantity}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-[2px] rounded-full"
                    >
                      {totalQuantity}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <User className="text-white" size={22} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {session ? (
                        <>
                          <div className="px-4 py-3 text-sm text-gray-400 border-b border-white/10">
                            {session.user.username}
                          </div>

                          <Link
                            href="/profile"
                            className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition"
                          >
                            Profile
                          </Link>

                          {session.user.role === "admin" && (
                            <Link
                              href="/admin/dashboard"
                              className="block px-4 py-3 text-sm text-purple-400 hover:bg-white/10 transition"
                            >
                              Admin Dashboard
                            </Link>
                          )}

                           <Link
                            href="/orders"
                            className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition"
                          >
                            Orders
                          </Link>

                          <button
                            onClick={() =>
                              signOut({ callbackUrl: "/login" })
                            }
                            className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-4 py-3 text-sm text-white hover:bg-white/10 transition"
                          >
                            Login
                          </Link>

                          <Link
                            href="/register"
                            className="block px-4 py-3 text-sm text-yellow-400 hover:bg-white/10 transition"
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
    </>
  );
};

export default Navbar;