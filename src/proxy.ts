import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
];
const baseUrl = "https://prompt-bluebird-45.accounts.dev";

const isPublic = (path: string) =>
  publicRoutes.some(
    (route) => path === route || path.startsWith(route + "/")
  );

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  const path = req.nextUrl.pathname;
  if (!userId && !isPublic(path)) {
    return NextResponse.redirect(new URL(baseUrl + "/sign-in", req.url));
  }

  if (userId && (path.startsWith("/sign-in") || path.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/problems", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
