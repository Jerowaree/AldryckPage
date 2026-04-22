import type { APIRoute } from "astro";
import { requireAdminUser, unauthorizedResponse } from "../../lib/adminAuth";
import { uploadPhotoAndCreateRecord } from "../../lib/portfolio";
import { getServerSupabaseAdminClient } from "../../lib/supabase";

export const GET: APIRoute = async () => jsonError("Metodo no permitido.", 405);

export const POST: APIRoute = async ({ request }) => {
  try {
    const user = await requireAdminUser(request);
    if (!user) return unauthorizedResponse();

    const formData = await request.formData();

    const file = formData.get("file");
    const title = String(formData.get("title") || "");
    const categoryId = String(formData.get("categoryId") || "");
    const description = String(formData.get("description") || "");
    const shotAt = String(formData.get("shotAt") || "");
    const isPublished =
      String(formData.get("isPublished") || "false") === "true";

    if (!(file instanceof File)) {
      return jsonError("El archivo es requerido.", 400);
    }

    if (!title || !categoryId) {
      return jsonError("title y categoryId son obligatorios.", 400);
    }

    const supabase = getServerSupabaseAdminClient();
    const photo = await uploadPhotoAndCreateRecord(supabase, {
      file,
      title,
      categoryId,
      description: description || undefined,
      shotAt: shotAt || undefined,
      isPublished,
    });

    return new Response(JSON.stringify({ data: photo }), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 201,
    });
  } catch (error) {
    const message =
      error instanceof Error ? normalizeUploadError(error.message) : "No se pudo subir la foto.";
    return jsonError(
      message,
      500,
    );
  }
};

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    headers: { "content-type": "application/json; charset=utf-8" },
    status,
  });
}

function normalizeUploadError(message: string) {
  if (message.includes("row-level security")) {
    return "No se pudo guardar por permisos de Supabase. Agrega SUPABASE_SERVICE_ROLE_KEY en .env y reinicia pnpm dev.";
  }
  return message;
}
