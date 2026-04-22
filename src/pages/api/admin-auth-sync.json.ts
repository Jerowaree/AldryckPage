import type { APIRoute } from "astro";
import { getServerSupabaseAdminClient } from "../../lib/supabase";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isSafeOrigin(request)) {
      return new Response(JSON.stringify({ error: "Origen no permitido." }), {
        status: 403,
        headers: JSON_HEADERS,
      });
    }

    const body = await request.json().catch(() => ({}));
    const requestedEmail = String(body?.email || "")
      .trim()
      .toLowerCase();
    const allowedAdminEmails = String(import.meta.env.ADMIN_ALLOWED_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const defaultEmail = String(import.meta.env.PUBLIC_ADMIN_DEFAULT_EMAIL || "")
      .trim()
      .toLowerCase();
    const targetEmail = requestedEmail || defaultEmail;
    const defaultPassword = String(import.meta.env.ADMIN_DEFAULT_PASSWORD || "");

    if (!targetEmail || !defaultPassword) {
      return new Response(
        JSON.stringify({ error: "Faltan credenciales admin en .env." }),
        {
          status: 500,
          headers: JSON_HEADERS,
        },
      );
    }
    if (!allowedAdminEmails.includes(targetEmail)) {
      return new Response(
        JSON.stringify({ error: "Correo no permitido para acceso admin." }),
        {
          status: 403,
          headers: JSON_HEADERS,
        },
      );
    }

    const supabase = getServerSupabaseAdminClient();
    const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 500,
    });

    if (listError) {
      return new Response(
        JSON.stringify({ error: "No se pudo consultar usuarios admin." }),
        {
          status: 500,
          headers: JSON_HEADERS,
        },
      );
    }

    const existingUser = usersPage.users.find(
      (user) => (user.email || "").toLowerCase() === targetEmail,
    );

    if (!existingUser) {
      const { error: createError } = await supabase.auth.admin.createUser({
        email: targetEmail,
        password: defaultPassword,
        email_confirm: true,
      });

      if (createError) {
        return new Response(
          JSON.stringify({ error: "No se pudo crear el usuario admin por defecto." }),
          {
            status: 500,
            headers: JSON_HEADERS,
          },
        );
      }
    } else {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: defaultPassword,
          email_confirm: true,
        },
      );

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "No se pudo sincronizar la contraseña admin." }),
          {
            status: 500,
            headers: JSON_HEADERS,
          },
        );
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error interno sincronizando admin." }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};

function isSafeOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    return originUrl.host === requestUrl.host;
  } catch {
    return false;
  }
}
