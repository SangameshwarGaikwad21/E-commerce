"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { User, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {

  const isLoggedIn = true
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

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

            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-white p-2"
                onClick={() => setOpen(true)}
              >
                <Menu size={26} />
              </button>

              <Link href="/">
                <h1 className="text-2xl md:text-2xl font-bold text-white">
                  Store_App
                </h1>
              </Link>
            </div>
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
    
            <div className="flex items-center gap-5">
          
              <Link href="/cart">
                <div className="relative text-white p-2">
                  <FaShoppingCart size={22} />
                </div>
              </Link>
              {isLoggedIn ? (
                    <Link href="/profile">
                      <div className="bg-white/10 p-2 rounded-full">
                        <User size={18} className="text-white" />
                      </div>
                    </Link>
                  ) : (
                    <Link href="/register">
                      <Button className="bg-yellow-500 text-black hover:bg-yellow-400 rounded-full">
                        Register
                      </Button>
                    </Link>
                  )}
            </div>
          </div>
          <div className="mt-3 md:hidden relative">
            <Input
              placeholder="Search for products, brands..."
              className="py-2 pl-4 pr-10 rounded-full bg-white text-black"
            />
            <Search
              size={16}
              className="absolute right-3 top-2.5 text-gray-600"
            />
          </div>

        </div>
      </motion.header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-zinc-900 z-50 p-6 md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">Menu</h2>
                <X
                  className="text-white cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>

              <div className="flex flex-col gap-5 text-white text-lg">
                <Link href="/cart">Cart</Link>

                <Link href="/orders">Orders</Link>

                <Link href="/profile">Profile</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;