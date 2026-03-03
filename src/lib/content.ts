import { directusFetch } from "./directus";

export interface ContentTranslation {
  language: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  seo_description?: string | null;
}

export interface ContentItem {
  id: number | string;
  slug: string;
  published_at: string;
  hero_image?: string | null;
  featured?: boolean;
  translations: ContentTranslation[];
}

/**
 * Returns all published News items, with only the title translation for `lang`.
 * Sorted newest first.
 */
export async function getNewsList(lang: string): Promise<ContentItem[]> {
  return directusFetch<ContentItem[]>("content_items", {
    fields: "id,slug,published_at,translations.title,translations.language",
    "filter[section][_eq]": "News",
    "filter[published_at][_nnull]": "true",
    "deep[translations][_filter][language][_eq]": lang,
    sort: "-published_at",
  });
}

/**
 * Returns a single News item by slug with full translations for `lang`,
 * including hero_image. Returns null when not found.
 */
export async function getNewsBySlug(
  slug: string,
  lang: string
): Promise<ContentItem | null> {
  const items = await directusFetch<ContentItem[]>("content_items", {
    fields: "id,slug,published_at,hero_image,featured,translations.*",
    "filter[slug][_eq]": slug,
    "filter[section][_eq]": "News",
    "deep[translations][_filter][language][_eq]": lang,
    limit: "1",
  });

  return items[0] ?? null;
}
