import fs from "node:fs/promises";
import path from "node:path";
import { SchemaSetupCard } from "./SchemaSetupCard";
import { supabaseProjectDashboardUrl } from "./studio-errors";

/**
 * Server-side wrapper that loads `supabase/schema.sql` from disk and resolves
 * the user's Supabase project dashboard URL. Renders the interactive card via
 * a thin client component so the Copy button can use the clipboard API.
 */
export async function StudioSchemaSetup({ reason }: { reason?: string } = {}) {
  let sql = "";
  try {
    const sqlPath = path.join(process.cwd(), "supabase", "schema.sql");
    sql = await fs.readFile(sqlPath, "utf-8");
  } catch {
    sql = "-- supabase/schema.sql could not be read on this deployment.";
  }

  const dashboard = supabaseProjectDashboardUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const sqlEditorUrl = dashboard ? `${dashboard}/sql/new` : null;

  return <SchemaSetupCard sql={sql} sqlEditorUrl={sqlEditorUrl} reason={reason} />;
}
