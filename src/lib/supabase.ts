import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function getPublicEnv() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const bucket = import.meta.env.PUBLIC_SUPABASE_BUCKET || "portfolio";

  if (!url || !anonKey) {
    throw new Error(
      "Faltan variables PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return { url, anonKey, bucket };
}

export function getBrowserSupabaseClient() {
  if (browserClient) return browserClient;

  const { url, anonKey } = getPublicEnv();
  browserClient = createClient(url, anonKey);
  return browserClient;
}

export function getServerSupabaseClient() {
  const { url, anonKey } = getPublicEnv();
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(url, serviceRoleKey || anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getServerSupabaseAdminClient() {
  const { url } = getPublicEnv();
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en .env. Sin esa clave, no se puede subir fotos ni crear categorias desde /admin."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseBucketName() {
  return getPublicEnv().bucket;
}
