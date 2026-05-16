import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STUDIO_COOKIE_NAME, studioCookieClearOptions } from "@/lib/studio/jwt";

export async function POST() {
  try {
    const jar = await cookies();

    jar.set(STUDIO_COOKIE_NAME, "", studioCookieClearOptions());

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to logout", error);

    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
