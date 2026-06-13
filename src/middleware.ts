import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    const isValid = await verifySession(sessionCookie);

    if (!isValid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
      }

      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
