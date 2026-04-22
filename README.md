# Aldryck Portfolio (Astro + Tailwind + Supabase)

Frontend del portfolio de fotografia deportiva, preparado para gestionar galeria y categorias con Supabase.

## Requisitos

- Node `>=22.12.0`
- pnpm
- Proyecto Supabase creado

## Variables de entorno

1. Copia el ejemplo:

```bash
cp .env.example .env
```

2. Completa:

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
PUBLIC_SUPABASE_BUCKET=portfolio
SUPABASE_SERVICE_ROLE_KEY=
```

- `PUBLIC_*` se usa en cliente.
- `SUPABASE_SERVICE_ROLE_KEY` es obligatoria para `/admin` (crear categorias y subir fotos).
- Si agregas o cambias variables en `.env`, reinicia `pnpm dev`.

## Preparar base de datos y storage

1. Abre el SQL Editor de Supabase.
2. Ejecuta `supabase/schema.sql`.

Esto crea:

- Tabla `categories`
- Tabla `photos`
- Politicas RLS (lectura publica de fotos publicadas)
- Bucket publico `portfolio` con limite y tipos permitidos

## Endpoints preparados

- `GET /api/categories.json`
- `GET /api/gallery.json`
- `POST /api/upload-photo.json` (multipart/form-data)

Campos para subida:

- `file`
- `title`
- `categoryId`
- `description` (opcional)
- `shotAt` (opcional, ISO)
- `isPublished` (`true`/`false`)

## Estructura importante

```text
src/
├── lib/
│   ├── supabase.ts    # cliente de Supabase (browser/server)
│   └── portfolio.ts   # helpers para categorias/fotos y upload + insert
├── data/
├── components/
├── layouts/
└── pages/
supabase/
└── schema.sql
```

## Uso rapido en frontend

```ts
import { getBrowserSupabaseClient } from "../lib/supabase";
import {
  fetchCategories,
  fetchPublishedPhotos,
  uploadPhotoAndCreateRecord,
} from "../lib/portfolio";

const supabase = getBrowserSupabaseClient();
const categories = await fetchCategories(supabase);
const photos = await fetchPublishedPhotos(supabase);
```

Para subir imagen:

```ts
await uploadPhotoAndCreateRecord(supabase, {
  file,
  title: "Final sprint",
  categoryId: selectedCategoryId,
  description: "100m final",
  isPublished: true,
});
```

## Comandos

- `pnpm dev`: desarrollo local
- `pnpm build`: build de produccion
- `pnpm preview`: vista previa local
- `pnpm format`: formatea con Prettier
- `pnpm format:check`: valida formato

Nota: el proyecto esta en modo `output: "server"` para soportar endpoints `POST` en produccion.
