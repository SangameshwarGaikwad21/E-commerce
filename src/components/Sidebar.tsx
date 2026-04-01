"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menu = [
    {name:"Dashboard",path:"/admin/dashboard"},
    { name: "Products", path: "/admin/product/productlist" },
    { name: "Create Product", path: "/admin/product/create" },
    { name: "Categories", path: "/admin/category" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <aside className="bg-gray-900 h-screen w-64 text-white flex flex-col shadow-lg fixed">
      
      <div className="text-2xl font-bold px-6 py-5 border-b border-gray-700">
        <Link href="/">Admin Dashboard</Link>
      </div>

      <div className="flex flex-col p-4 gap-2">
        {menu.map((item, index) => {
          const isActive = pathname === item.path;

          return (
            <Link key={index} href={item.path}>
              <div
                className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 
                ${isActive ? "bg-blue-600" : "hover:bg-gray-800"}`}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

    </aside>
  );
};

export default Sidebar;