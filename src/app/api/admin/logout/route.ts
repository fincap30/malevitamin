import { NextResponse } from "next/server";

import { ADMIN_COOKIE } from "@/lib/admin/auth";

/**
 * POST /api/admin/logout
 *
 * Clears the admin session cookie and redirects to the login page.
 */
export async function POST(request: Request) {
  const url = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
