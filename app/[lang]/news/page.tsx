import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsList } from "@/src/lib/content";

const SUPPORTED_LANGS = new Set(["en", "ar"]);

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function NewsListPage({ params }: Props) {
  const { lang } = await params;

  if (!SUPPORTED_LANGS.has(lang)) {
    notFound();
  }

  const items = await getNewsList(lang);

  if (items.length === 0) {
    return (
      <main>
        <h1>News</h1>
        <p>No published articles found.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>News</h1>
      <ul>
        {items.map((item) => {
          const title = item.translations[0]?.title ?? item.slug;
          return (
            <li key={item.id}>
              <Link href={`/${lang}/news/${item.slug}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
