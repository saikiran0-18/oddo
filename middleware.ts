import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const isPublicPath = path === '/login'
  
  const session = await getSession()

  // If trying to access a protected route without being logged in
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access login page while already logged in
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
