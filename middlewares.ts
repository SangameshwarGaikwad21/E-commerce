import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    if (
      pathname.startsWith("/api/auth/register") ||
      pathname.startsWith("/api/auth/login")
    ) {
      return NextResponse.next();
    }
   
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (pathname.startsWith("/api/products")) {
      if (!token || token.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access only" },
          { status: 403 }
        );
      }
    }

    if (pathname.startsWith("/api/order")) {
      if (!token) {
        return NextResponse.json(
          { message: "Login required" },
          { status: 401 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};