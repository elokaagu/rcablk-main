import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME, verifyStudioToken } from "@/lib/studio/jwt";

export async function requireStudioCookie(): Promise<NextResponse | null> {
  const token = (await cookies()).get(STUDIO_COOKIE_NAME)?.value;
  if (!token || !(await verifyStudioToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
