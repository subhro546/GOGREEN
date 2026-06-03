import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    if (isAdminPage && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true, // We handle the logic in the middleware function above
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/login", "/register"],
};
