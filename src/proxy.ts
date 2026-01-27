import { clerkMiddleware } from '@clerk/nextjs/server'
import {  NextRequest, NextResponse } from 'next/server'

const publicRoutes: Array<string> = ["/login", "/signup", "/"]
const authRoutes: Array<string> = ["/login", "/signup"]

export default clerkMiddleware(
  async(auth, req:NextRequest) => {
    const {userId} = await auth();

    const path:string = req.nextUrl.pathname;

    //not auth
    if(!userId && !publicRoutes.includes(path)){
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
    
    //autheticated
    if(userId){
      if(authRoutes.includes(path)){
        return NextResponse.redirect(
          new URL("/problems" ,req.url)
        )
      }
    }

    return NextResponse.next();
  }
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}