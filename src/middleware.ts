import { NextResponse, NextRequest } from "next/server";
import { routes } from "./lib/constants/routes";
import { ACCESS_TOKEN } from "./lib/constants/variables";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const token = request.cookies.get(ACCESS_TOKEN)?.value;

  const publicRoutes = ["/login", "/signup"].includes(nextUrl.pathname);

  if (publicRoutes && token) {
    return NextResponse.redirect(new URL(routes.chatPage, nextUrl));
  }

  if (!publicRoutes && !token) {
    return NextResponse.redirect(new URL(routes.login, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Matches all pages except static assets
};
