const BASE_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL ?? "http://localhost:8055";

const TOKEN = process.env.DIRECTUS_TOKEN;

/**
 * Low-level helper to fetch from the Directus items API.
 *
 * - Reads base URL from NEXT_PUBLIC_DIRECTUS_URL.
 * - Includes Authorization header only when DIRECTUS_TOKEN is non-empty.
 * - Uses ISR with a 60-second revalidation window.
 */
export async function directusFetch<T>(
  collection: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`/items/${collection}`, BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  const headers: Record<string, string> = {};

  if (TOKEN) {
    headers["Authorization"] = `Bearer ${TOKEN}`;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Directus ${res.status} ${res.statusText} — GET ${url.pathname}${url.search}` +
        (body ? `\n${body}` : "")
    );
  }

  const json = (await res.json()) as { data: T };
  return json.data;
}
