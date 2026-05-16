import crypto from "crypto";

export function normEmail(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function isLoginBody(body: unknown): body is { email?: string; password: string } {
  if (!body || typeof body !== "object") {
    return false;
  }

  const payload = body as { email?: unknown; password?: unknown };

  return (
    typeof payload.password === "string" &&
    (payload.email === undefined || typeof payload.email === "string")
  );
}

export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip")?.trim() ??
    "unknown"
  );
}
