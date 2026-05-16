import { NextResponse } from "next/server";
import { isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

export async function guardStudioRoute() {
  const auth = await requireStudioCookie();

  if (auth) {
    return auth;
  }

  if (!isCmsConfigured()) {
    return NextResponse.json(
      { error: "Supabase CMS is not configured." },
      { status: 503 }
    );
  }

  return null;
}
