"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Lock scroll only for sidebar
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-black border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">

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
                <h1 className="text-2xl font-bold text-white">
                  Store_App
                </h1>
              </Link>
            </div>

            {/* Search (Desktop) */}
            <div className="hidden md:flex items-center w-[380px] relative">
              <Input
                placeholder="Search products..."
                className="py-5 rounded-full pr-16 pl-6 bg-white text-black"
              />
              <Search
                size={20}
                className="absolute right-5 text-gray-600"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-5">

              <Link href="/cart">
                <div className="text-white p-2">
                  <FaShoppingCart size={22} />
                </div>
              </Link>

              {session ? (
                <div className="relative">
                  <button
                    onClick={() =>
                      setProfileOpen((prev) => !prev)
                    }
                    className="bg-white/10 px-4 py-2 rounded-full text-white hover:bg-white/20 transition"
                  >
                    {session.user.username}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-44 bg-zinc-900 border border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                      >
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-white hover:bg-zinc-800"
                        >
                          Profile
                        </Link>

                        <button
                          onClick={() =>
                            signOut({
                              callbackUrl: "/register",
                            })
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/register">
                  <Button className="bg-yellow-500 text-black hover:bg-yellow-400 rounded-full">
                    Register
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-3 md:hidden relative">
            <Input
              placeholder="Search for products..."
              className="py-2 pl-4 pr-10 rounded-full bg-white text-black"
            />
            <Search
              size={16}
              className="absolute right-3 top-2.5 text-gray-600"
            />
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-zinc-900 z-50 p-6 md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">
                  Menu
                </h2>
                <X
                  className="text-white cursor-pointer"
                  onClick={() => setMobileOpen(false)}
                />
              </div>

              <div className="flex flex-col gap-5 text-white text-lg">
                <Link href="/cart">Cart</Link>
                <Link href="/orders">Orders</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;