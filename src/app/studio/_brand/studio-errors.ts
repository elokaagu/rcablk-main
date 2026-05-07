/**
 * Small helpers for surfacing studio data-layer failures in a useful way.
 *
 * Distinguishing "schema not applied yet" from any other Supabase error lets us
 * show a guided setup card (with the SQL + a deep link to the Supabase SQL
 * editor) instead of a generic "could not load …" dead end.
 */

/**
 * True when the underlying error indicates a missing relation / table — the
 * canonical first-run case where the user has Supabase configured but hasn't
 * applied `supabase/schema.sql` yet. Postgres reports this as code `42P01`
 * (`undefined_table`); the message also reliably contains
 * `relation "<name>" does not exist`.
 */
export function isSchemaMissingError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: string; message?: string };
  if (e.code === "42P01" || e.code === "PGRST205") return true;
  if (typeof e.message === "string" && /relation\s+".+"\s+does not exist/i.test(e.message)) return true;
  if (typeof e.message === "string" && /could not find the table/i.test(e.message)) return true;
  return false;
}

/** Best-effort human-readable error message from any thrown value. */
export function extractErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err as { message?: string; code?: string; details?: string; hint?: string };
    const parts = [e.message, e.details, e.hint].filter(Boolean) as string[];
    const msg = parts.join(" — ");
    if (msg) return e.code ? `${msg} (${e.code})` : msg;
    if (e.code) return `Postgres error ${e.code}`;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

/**
 * Given a Supabase URL like `https://abc123.supabase.co`, derive the
 * dashboard project URL `https://supabase.com/dashboard/project/abc123`.
 * Returns null when the input isn't a recognisable Supabase URL.
 */
export function supabaseProjectDashboardUrl(supabaseUrl: string | undefined): string | null {
  if (!supabaseUrl) return null;
  try {
    const u = new URL(supabaseUrl);
    if (!u.hostname.endsWith(".supabase.co")) return null;
    const ref = u.hostname.split(".")[0];
    if (!ref) return null;
    return `https://supabase.com/dashboard/project/${ref}`;
  } catch {
    return null;
  }
}
