"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { Search, Menu, X, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();

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

            {/* Left */}
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

            {/* Search */}
            <div className="hidden md:flex items-center w-[420px] relative">
              <Input
                placeholder="Search products..."
                className="py-5 rounded-full pr-16 pl-6 bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 transition"
              />
              <Search
                size={20}
                className="absolute right-5 text-gray-400"
              />
            </div>

            <div className="flex items-center gap-5">
              <Link href="/cart" className="hidden md:block">
                <div className="text-white p-2 hover:scale-110 transition-transform duration-200">
                  <FaShoppingCart size={22} />
                </div>
              </Link>
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

    
          <div className="mt-3 md:hidden relative">
            <Input
              placeholder="Search products..."
              className="py-3 pl-4 pr-10 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400"
            />
            <Search
              size={16}
              className="absolute right-3 top-3 text-gray-400"
            />
          </div>
        </div>
      </motion.header>

<AnimatePresence>
  {mobileOpen && (
    <>
     
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40 md:hidden"
        onClick={() => setMobileOpen(false)}
      />

     
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl z-50 p-6 md:hidden flex flex-col"
      >
    
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-xl font-bold">
            Menu
          </h2>
          <X
            className="text-white cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
        </div>

     
        <div className="mb-6">
          {session ? (
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-white font-medium">
                {session.user.username}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {session.user.role.toUpperCase()}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="bg-white/10 py-2 rounded-lg text-center text-white hover:bg-white/20 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-yellow-500 py-2 rounded-lg text-center text-black font-medium hover:bg-yellow-400 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

     
        <div className="border-t border-white/10 mb-6"></div>

       
        <div className="flex flex-col gap-4 text-white text-lg">

          <Link
            href="/cart"
            className="hover:text-blue-400 transition"
          >
            Cart
          </Link>

          <Link
            href="/orders"
            className="hover:text-blue-400 transition"
          >
            Orders
          </Link>

          {session?.user?.role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Admin Dashboard
            </Link>
          )}
        </div>

     
        {session && (
          <div className="mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() =>
                signOut({ callbackUrl: "/login" })
              }
              className="w-full bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        )}
      </motion.div>
    </>
  )}
</AnimatePresence>
    </>
  );
};

export default Navbar;