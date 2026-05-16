import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME } from "@/lib/studio/jwt";

export async function POST() {
  const jar = await cookies();
  jar.delete(STUDIO_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
