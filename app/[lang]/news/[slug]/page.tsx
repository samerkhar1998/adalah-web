import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/src/lib/content";

const SUPPORTED_LANGS = new Set(["en", "ar"]);

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!SUPPORTED_LANGS.has(lang)) {
    notFound();
  }

  const item = await getNewsBySlug(slug, lang);

  if (!item) {
    notFound();
  }

  const translation = item.translations[0];

  if (!translation) {
    // Item exists but has no translation for the requested language.
    notFound();
  }

  return (
    <main>
      <article>
        <h1>{translation.title}</h1>

        <time dateTime={item.published_at}>
          {new Date(item.published_at).toLocaleDateString(lang, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {translation.excerpt && (
          <p>
            <em>{translation.excerpt}</em>
          </p>
        )}

        {translation.body && (
          /* Body may contain HTML authored in Directus rich-text field. */
          <div dangerouslySetInnerHTML={{ __html: translation.body }} />
        )}

        <a href={`/${lang}/news`}>← Back to News</a>
      </article>
    </main>
  );
}
