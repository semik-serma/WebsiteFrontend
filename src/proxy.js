import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;

  const protectedRoutes = [
    "/dashboard",
    "/create-article",
    "/update-article",
  ];

  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/create-article/:path*", "/update-article/:path*"],
};






