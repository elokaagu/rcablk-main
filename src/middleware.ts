import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { STUDIO_COOKIE_NAME } from "@/lib/studio/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/studio/login")) return NextResponse.next();
  if (path === "/api/studio/login") return NextResponse.next();

  const isStudio = path.startsWith("/studio") || path.startsWith("/api/studio");
  if (!isStudio) return NextResponse.next();

  const secret = process.env.STUDIO_JWT_SECRET;
  if (!secret || secret.length < 16) {
    if (path.startsWith("/api/studio")) {
      return NextResponse.json({ error: "Studio auth is not configured (STUDIO_JWT_SECRET)." }, { status: 503 });
    }
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  const token = request.cookies.get(STUDIO_COOKIE_NAME)?.value;
  if (!token) {
    if (path.startsWith("/api/studio")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    if (path.startsWith("/api/studio")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }
}

export const config = {
  matcher: ["/studio/:path*", "/api/studio/:path*"],
};
