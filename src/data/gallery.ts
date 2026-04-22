export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  /** Asimetría en desktop: más ancho o más alto */
  layout?: "default" | "wide" | "tall";
};

/** Placeholders Unsplash — sustituir por URLs de Supabase Storage cuando exista backend */
export const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1461896836934-3634589ebbf7?auto=format&fit=crop&w=1200&q=80",
    alt: "Baloncesto en acción",
    title: "Ritmo en la pintura",
    layout: "wide",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1579952363873-27e3bade9f82?auto=format&fit=crop&w=800&q=80",
    alt: "Fútbol",
    title: "Contacto",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=800&q=80",
    alt: "Boxeo",
    title: "Intensidad",
    layout: "tall",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1517649763962-0c62306601b7?auto=format&fit=crop&w=800&q=80",
    alt: "Atletismo",
    title: "Línea de meta",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1530549387789-4c101f6643b2?auto=format&fit=crop&w=1200&q=80",
    alt: "Natación",
    title: "Superficie",
    layout: "wide",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    alt: "Corredor",
    title: "Impulso",
  },
];
