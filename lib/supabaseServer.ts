const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pjvjeszhynfekapkpoxw.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function supabaseAdminFetch(path: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL.replace(/\/$/, "")}${path}`;
  const headers: Record<string, string> = {
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
    ...(options.headers as Record<string, string> || {})
  };
  const res = await fetch(url, { ...options, headers, cache: "no-store" });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    throw new Error(typeof data === "object" && data?.message ? data.message : `Supabase Error ${res.status}: ${text}`);
  }
  return data;
}
