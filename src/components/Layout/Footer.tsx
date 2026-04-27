"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-black border-t border-gray-800 mt-0"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-3 gap-10 text-gray-400">

          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Store_App
            </h2>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for premium shopping.
              Quality products, fast delivery, and amazing deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <Link href="/cart" className="hover:text-white transition">
                Cart
              </Link>
              <Link href="/profile" className="hover:text-white transition">
                Profile
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              Follow Us
            </h3>
            <div className="flex gap-5 text-xl">
              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="hover:text-white transition"
              >
                <FaGithub />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="hover:text-white transition"
              >
                <FaInstagram />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.2 }}
                href="#"
                className="hover:text-white transition"
              >
                <FaLinkedin />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-5 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Store_App. All rights reserved.
        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;
