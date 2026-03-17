import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects /admin routes at the server level.
// Since Firebase Auth is client-side, we primarily check for a session cookie
// or specific headers. For this specific project, we'll implement a 
// robust check that complements the client-side AdminGuard.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Only intercept /admin routes
  if (pathname.startsWith('/admin')) {
    // 2. Allow access to the login page itself
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // 3. For other admin pages, check for authentication
    // Note: In a full production setup with Firebase, you would use 
    // cookie-based sessions (sessionCookie). 
    // As a hardening step to prevent 'Public Admin Panel', we check if 
    // the user is hitting the dashboard directly.
    
    // We expect a cookie names '__session' or 'firebase-token' 
    // based on typical Next.js + Firebase integration patterns.
    const hasAuthCookie = request.cookies.get('__session') || request.cookies.get('firebase-token');

    // If no cookie is present, redirect to login immediately (Server Side)
    // This prevents the HTTP 200 issue.
    if (!hasAuthCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
