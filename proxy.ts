import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy function for Next.js 16.2.4
 * This replaces the deprecated middleware convention.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRole = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  // 1. Public Routes (Auth)
  if (pathname.startsWith("/auth")) {
    if (token) {
      const role = userRole?.toUpperCase();
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      if (role === "COURIER") {
        return NextResponse.redirect(new URL("/dashboard/courier", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
    return NextResponse.next();
  }

  // 2. Protected Routes (Dashboard & Admin)
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const role = userRole?.toUpperCase();

    // Admin Routes Protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      if (role === "COURIER") {
        return NextResponse.redirect(new URL("/dashboard/courier", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    // Role-based Access Control for Dashboards
    if (pathname.startsWith("/dashboard/courier") && role !== "COURIER" && role !== "ADMIN") {
      if (role === "USER") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard/user") && role !== "USER" && role !== "ADMIN") {
      if (role === "COURIER") {
        return NextResponse.redirect(new URL("/dashboard/courier", request.url));
      }
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
