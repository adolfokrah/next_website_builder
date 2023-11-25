import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptApiKey, verifyJwtToken } from '@/lib/auth';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies, headers, body } = request;
  if (nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/index', request.url));
  }

  if (nextUrl.pathname.startsWith('/builder')) {
    const { value: token } = cookies.get('token') ?? { value: null };
    const hasVerifiedToken = token && (await verifyJwtToken(token));
    if (!hasVerifiedToken && nextUrl.pathname != '/builder/sign-in') {
      return NextResponse.redirect(new URL(`/builder/sign-in?page=${nextUrl.pathname}`, url));
    } else if (hasVerifiedToken && nextUrl.pathname === '/builder/sign-in') {
      return NextResponse.redirect(new URL(`/builder/index`, url));
    }
  }

  if (
    nextUrl.pathname.startsWith('/api') &&
    nextUrl.pathname != '/api/users' &&
    !nextUrl.pathname.startsWith('/api/auth')
  ) {
    const apiKey = headers.get('authorization')?.split('Bearer ').at(1);
    if (apiKey) {
      const isValidToken = decryptApiKey(apiKey);
      if (!isValidToken) {
        return NextResponse.json({ error: 'Api key is invalid' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Api key is needed' }, { status: 500 });
    }
  }
}

export const config = {
  matcher: ['/:path*'],
};
