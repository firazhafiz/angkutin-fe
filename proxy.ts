import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Proxy function for Next.js 16.2.4
 * This replaces the deprecated middleware convention.
 */
export function proxy(request: NextRequest) {
  // Add your proxy/middleware logic here
  return NextResponse.next()
}

// Optionally, add a matcher to target specific paths
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
