import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects /admin routes at the server level.
// Since Firebase Auth is client-side, we primarily check for a session cookie
// or specific headers. For this specific project, we'll implement a 
// robust check that complements the client-side AdminGuard.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 0. Block direct directory listing for static assets
  if (pathname === '/_next/static' || pathname === '/_next/static/') {
    return new NextResponse(null, { status: 404 });
  }

  let response = NextResponse.next();

  // 1. Admin Authentication Logic
  const SECURE_ADMIN_PATH = '/secure-terminal-access';

  if (pathname.startsWith('/admin')) {
    // Obfuscate existing /admin/login path by returning 404
    if (pathname === '/admin/login') {
      return new NextResponse(null, { status: 404 });
    }

    const hasAuthCookie = request.cookies.get('__session') || request.cookies.get('firebase-token');
    if (!hasAuthCookie) {
      return new NextResponse(null, { status: 404 });
    }
  }

  if (pathname === SECURE_ADMIN_PATH) {
    const hasAuthCookie = request.cookies.get('__session') || request.cookies.get('firebase-token');
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // 2. Inject Security Headers (More reliable than next.config.js in some dev environments)
  const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' apis.google.com www.gstatic.com; connect-src 'self' *.firebaseio.com *.googleapis.com securetoken.googleapis.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; frame-src 'self' *.firebaseapp.com; object-src 'none'; base-uri 'self';";

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Harden infrastructure headers by overwriting with generic values
  // This is often more effective than deletion on some PaaS like Railway
  response.headers.set('X-Powered-By', 'WebServer');
  response.headers.set('Server', 'WebServer');
  response.headers.set('X-Railway-Edge', 'Protected');

  return response;
}

// Ensure the middleware applies to all routes except static assets
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
