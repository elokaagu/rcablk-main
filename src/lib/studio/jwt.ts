import { SignJWT, jwtVerify } from "jose";

export const STUDIO_COOKIE_NAME = "studio_token";

export const STUDIO_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** Shared cookie attributes for login and logout. */
export function studioCookieBaseOptions() {
  return {
    httpOnly: true as const,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export function studioCookieClearOptions() {
  return {
    ...studioCookieBaseOptions(),
    expires: new Date(0),
    maxAge: 0,
  };
}

function getSecret() {
  const s = process.env.STUDIO_JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error("STUDIO_JWT_SECRET must be set (min 16 characters)");
  }
  return new TextEncoder().encode(s);
}

export async function signStudioToken(): Promise<string> {
  return new SignJWT({ studio: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyStudioToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}
