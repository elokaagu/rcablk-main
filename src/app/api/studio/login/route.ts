import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME, signStudioToken } from "@/lib/studio/jwt";

function normEmail(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const expectedPassword = process.env.STUDIO_PASSWORD;
    if (!expectedPassword) {
      return NextResponse.json({ error: "STUDIO_PASSWORD is not set on the server." }, { status: 503 });
    }
    if (!process.env.STUDIO_JWT_SECRET || process.env.STUDIO_JWT_SECRET.length < 16) {
      return NextResponse.json({ error: "STUDIO_JWT_SECRET must be at least 16 characters." }, { status: 503 });
    }

    const expectedEmail = process.env.STUDIO_EMAIL?.trim();
    if (expectedEmail) {
      if (normEmail(body.email) !== normEmail(expectedEmail) || body.password !== expectedPassword) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    } else if (body.password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    let token: string;
    try {
      token = await signStudioToken();
    } catch {
      return NextResponse.json({ error: "STUDIO_JWT_SECRET is invalid or missing." }, { status: 503 });
    }
    const jar = await cookies();
    jar.set(STUDIO_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
