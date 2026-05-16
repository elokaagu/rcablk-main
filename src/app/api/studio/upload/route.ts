import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/cms/supabase-admin";
import { guardStudioRoute } from "@/lib/studio/guard-studio-route";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "heic",
  "heif",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogv",
  "mkv",
  "avi",
]);

function sanitizePrefix(value: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value : "uploads";

  return (
    raw
      .replace(/^\/+/, "")
      .replace(/[^a-zA-Z0-9/_-]/g, "")
      .replace(/\/+/g, "/")
      .replace(/\.\./g, "")
      .slice(0, 80) || "uploads"
  );
}

function getFileExtension(name: string) {
  const ext = name.includes(".") ? name.split(".").pop() : "";

  return (ext || "").toLowerCase();
}

function getFileKind(file: File): "image" | "video" | null {
  const mime = (file.type || "").toLowerCase();
  const ext = getFileExtension(file.name || "");

  if (!ext) {
    return null;
  }

  if (mime.startsWith("image/") && IMAGE_EXTENSIONS.has(ext)) {
    return "image";
  }

  if (mime.startsWith("video/") && VIDEO_EXTENSIONS.has(ext)) {
    return "video";
  }

  return null;
}

export async function POST(req: Request) {
  const guard = await guardStudioRoute();

  if (guard) {
    return guard;
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const kind = getFileKind(file);

    if (!kind) {
      return NextResponse.json(
        { error: "Only image or video files are allowed for this upload." },
        { status: 400 }
      );
    }

    const maxBytes = kind === "video" ? 100 * 1024 * 1024 : 20 * 1024 * 1024;

    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error:
            kind === "video" ? "Video too large (max 100MB)" : "Image too large (max 20MB)",
        },
        { status: 400 }
      );
    }

    const ext = getFileExtension(file.name);

    if (!ext) {
      return NextResponse.json({ error: "File must include a valid extension" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const prefix = sanitizePrefix(form.get("prefix"));
    const path = `${prefix}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from("media").upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (uploadError) {
      console.error("Failed to upload media", uploadError);

      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);

    return NextResponse.json(
      { url: data.publicUrl, path },
      {
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error("Upload route failed", error);

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
