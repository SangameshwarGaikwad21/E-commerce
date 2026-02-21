import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api/products")) {
      if (token?.role !== "admin") {
        return NextResponse.json(
          { message: "Admin access only" },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, 
    },
  }
);

export const config = {
  matcher: [
    "/api/products/:path*",
    "/api/order/:path*",
  ],
};