import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isLoginPage = req.nextUrl.pathname === '/admin/login';

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  if (!isLoginPage && req.nextUrl.pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
