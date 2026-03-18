import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest): NextResponse {
  const refreshToken = request.cookies.get("refreshToken");
  const isAuthenticated = refreshToken && true;

  console.log(
    "Middleware executed. isAuthenticated:",
    Boolean(isAuthenticated),
  );

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  if (pathname.startsWith("/home")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/home/:path*"],
};
