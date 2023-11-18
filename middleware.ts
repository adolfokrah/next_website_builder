import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwtToken } from "@/lib/auth";

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  if(nextUrl.pathname === "/"){
    return NextResponse.redirect(new URL('/index', request.url))
  }

  if(nextUrl.pathname.startsWith('/builder')){
     const { value: token } = cookies.get("token") ?? { value: null };
     const hasVerifiedToken = token && (await verifyJwtToken(token));
     if(!hasVerifiedToken && nextUrl.pathname != '/builder/sign-in'){
        return NextResponse.redirect(new URL(`/builder/sign-in?page=${nextUrl.pathname}`, url))
     }else if(hasVerifiedToken && nextUrl.pathname === '/builder/sign-in' ){
       return NextResponse.redirect(new URL(`/builder/index`, url))
     }
  }
}


 
export const config = {
  matcher: ['/:path*'],
}