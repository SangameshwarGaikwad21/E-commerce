"use client";
import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") || 
    pathname.startsWith("/admin/dashboard")  ||
    pathname.startsWith("/admin/product/create") ||
    pathname.startsWith("/admin/product/productlist") 

  if (hideNavbar) return null;

  return <Navbar />;
}