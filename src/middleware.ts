import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('youssef_auth_token')?.value;
  const isMyMemories = request.nextUrl.pathname.startsWith('/my-memories');
  const isLogin = request.nextUrl.pathname.startsWith('/login');

  const sessionSecret = process.env.SESSION_SECRET || 'authenticated_youssef_2026';

  if (isMyMemories) {
    if (token !== sessionSecret) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLogin) {
    if (token === sessionSecret) {
      const dashboardUrl = new URL('/my-memories', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-memories', '/login'],
};
