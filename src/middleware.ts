import { NextResponse, NextRequest } from "next/server";
import { routes } from "./lib/constants/routes";
import { ACCESS_TOKEN } from "./lib/constants/variables";

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const token = request.cookies.get(ACCESS_TOKEN)?.value;

  const publicRoutes =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  if (publicRoutes) {
    if (token) {
      return NextResponse.redirect(new URL(routes.chatPage, nextUrl));
    }
  } else {
    if (!token) {
      return NextResponse.redirect(new URL(routes.login, nextUrl));
    }
  }
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
