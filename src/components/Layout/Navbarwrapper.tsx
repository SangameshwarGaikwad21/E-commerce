"use client";

import Navbar from "./Navbar";
import { usePathname } from "next/navigation";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/register") ||
    pathname.startsWith("/login") || 
    pathname.startsWith("/forgotpassword") ||
    pathname.startsWith("/admin/dashboard")

  if (hideNavbar) return null;

  return <Navbar />;
}