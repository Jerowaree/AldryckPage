import type { APIRoute } from "astro";
import { fetchPublishedPhotosPage } from "../../lib/portfolio";
import { getServerSupabaseClient } from "../../lib/supabase";

export const GET: APIRoute = async ({ url }) => {
  try {
    const pageParam = Number(url.searchParams.get("page") || "1");
    const limitParam = Number(url.searchParams.get("limit") || "9");
    const category = url.searchParams.get("category") || undefined;

    const supabase = getServerSupabaseClient();
    const result = await fetchPublishedPhotosPage(supabase, {
      page: Number.isFinite(pageParam) ? pageParam : 1,
      limit: Number.isFinite(limitParam) ? limitParam : 9,
      categoryId: category && category !== "all" ? category : undefined,
    });

    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json; charset=utf-8" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "No se pudo cargar la galeria.",
        detail: error instanceof Error ? error.message : "unknown",
      }),
      {
        headers: { "content-type": "application/json; charset=utf-8" },
        status: 500,
      },
    );
  }
};
