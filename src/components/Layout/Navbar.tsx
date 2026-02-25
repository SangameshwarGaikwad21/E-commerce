"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart } from "react-icons/fa";
import { User, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-gradient-to-r from-zinc-900 via-gray-900 to-black shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">

            <button
              className="md:hidden text-white"
              onClick={() => setOpen(true)}
            >
              <Menu size={26} />
            </button>

            <Link href="/">
              <h1 className="text-xl md:text-2xl font-bold text-white cursor-pointer">
                StoreApp
              </h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center w-[380px] relative">
            <Input
              placeholder="Search products..."
              className="py-3 rounded-full pr-12 pl-6 bg-white text-black"
            />
            <Search
              size={18}
              className="absolute right-5 text-gray-600"
            />
          </div>
          <div className="flex items-center gap-6">
            <Link href="/cart">
              <div className="relative text-white cursor-pointer">
                <FaShoppingCart size={22} />
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-white/20 p-2 rounded-full cursor-pointer">
                <User size={18} className="text-white" />
              </div>
            </Link>

            <Button className="hidden lg:flex bg-white text-black rounded-full">
              Sign Up
            </Button>

          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
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
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-black z-50 p-6 md:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-xl font-bold">
                  Menu
                </h2>

                <X
                  className="text-white cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <Input
                placeholder="Search..."
                className="mb-6 bg-white text-black"
              />

              <div className="flex flex-col gap-5 text-white">
                <Link href="/cart" onClick={() => setOpen(false)}>
                  Cart
                </Link>

                <Link href="/orders" onClick={() => setOpen(false)}>
                  Orders
                </Link>

                <Button
                  onClick={() => setOpen(false)}
                  className="mt-4 bg-pink-500"
                >
                  Sign Up
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;