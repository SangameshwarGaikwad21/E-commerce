"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/product/productlist" },
    { name: "Categories", path: "/admin/category" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <>
      {/* 🔹 Mobile Header */}
      <div className="md:hidden flex items-center gap-4 bg-gray-900 text-white px-4 py-3 sticky top-0 z-50 shadow-md">
        <button
          onClick={() => setIsOpen(true)}
          className="hover:scale-110 transition"
        >
          <Menu size={24} />
        </button>

        <h1 className="font-bold text-lg">Admin</h1>
      </div>

      {/* 🔹 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <span className="text-xl font-bold">Admin Dashboard</span>
          </Link>

          {/* Close Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col p-4 gap-2">
          {menu.map((item, index) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 
                  ${
                    isActive
                      ? "bg-blue-600"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;