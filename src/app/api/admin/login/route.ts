import { NextRequest, NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  computeSessionToken,
  getAdminPassword,
  verifyPassword,
} from "@/lib/admin/auth";

/**
 * POST /api/admin/login
 *
 * Body: { password: string }
 * On success sets an httpOnly session cookie and returns { ok: true }.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyPassword(password)) {
      // Small delay to slow brute-force attempts.
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { ok: false, error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = await computeSessionToken(getAdminPassword());
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("[Admin Login] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
