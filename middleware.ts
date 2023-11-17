import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from "@clerk/nextjs";

 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if(request.nextUrl.pathname === "/"){
    return NextResponse.redirect(new URL('/index', request.url))
  }
}

export default authMiddleware({
   publicRoutes: ['/:builder/sign-in','/:builder/sign-up','/']
});

 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc|builder)(.*)'],
}