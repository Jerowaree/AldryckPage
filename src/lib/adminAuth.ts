import type { User } from "@supabase/supabase-js";
import { getServerSupabaseClient } from "./supabase";

function getAllowedAdminEmails() {
  const raw = import.meta.env.ADMIN_ALLOWED_EMAILS || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminUser(request: Request) {
  const token = getBearerToken(request);
  if (!token) return null;

  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  const allowedEmails = getAllowedAdminEmails();
  if (!allowedEmails.length) return null;
  if (!allowedEmails.includes((data.user.email || "").toLowerCase())) return null;
  return data.user as User;
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "No autorizado. Inicia sesión para continuar." }),
    {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 401,
    }
  );
}

function getBearerToken(request: Request) {
  const value = request.headers.get("authorization") || "";
  if (!value.toLowerCase().startsWith("bearer ")) return "";
  return value.slice(7).trim();
}
