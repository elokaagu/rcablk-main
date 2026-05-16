import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getClientIp,
  isLoginBody,
  normEmail,
  safeEqual,
} from "@/lib/studio/login-helpers";
import { isRateLimited } from "@/lib/studio/rate-limit";
import {
  STUDIO_COOKIE_MAX_AGE,
  STUDIO_COOKIE_NAME,
  signStudioToken,
  studioCookieBaseOptions,
} from "@/lib/studio/jwt";

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (isRateLimited(`studio-login:${ip}`)) {
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  try {
    const expectedPassword = process.env.STUDIO_PASSWORD;
    const expectedEmail = process.env.STUDIO_EMAIL?.trim();
    const jwtSecret = process.env.STUDIO_JWT_SECRET;

    if (!expectedPassword || !jwtSecret || jwtSecret.length < 16) {
      console.error("Studio login is not configured correctly");

      return NextResponse.json(
        { error: "Studio login is temporarily unavailable." },
        { status: 503 }
      );
    }

    const body = await req.json();

    if (!isLoginBody(body)) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const passwordMatches = safeEqual(body.password, expectedPassword);

    const emailMatches = expectedEmail
      ? safeEqual(normEmail(body.email), normEmail(expectedEmail))
      : true;

    if (!passwordMatches || !emailMatches) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    let token: string;

    try {
      token = await signStudioToken();
    } catch (error) {
      console.error("Studio JWT signing failed", error);

      return NextResponse.json(
        { error: "Studio login is temporarily unavailable." },
        { status: 503 }
      );
    }

    const jar = await cookies();

    jar.set(STUDIO_COOKIE_NAME, token, {
      ...studioCookieBaseOptions(),
      maxAge: STUDIO_COOKIE_MAX_AGE,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Studio login failed", error);

    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
