import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdmin, isCmsConfigured } from "@/lib/cms/supabase-admin";
import { requireStudioCookie } from "@/lib/studio/auth-route";

export async function POST(req: Request) {
  const auth = await requireStudioCookie();
  if (auth) return auth;
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Supabase CMS is not configured." }, { status: 503 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const prefix = (form.get("prefix") as string) || "uploads";
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 12MB)" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
    const path = `${prefix.replace(/^\//, "").replace(/\.\./g, "")}/${randomUUID()}.${ext}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage.from("media").upload(path, buf, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
    if (upErr) {
      console.error(upErr);
      return NextResponse.json(
        { error: "Upload failed. Create a public bucket named `media` in Supabase Storage." },
        { status: 500 }
      );
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
