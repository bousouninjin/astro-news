import rss from "@astrojs/rss";
import { DEFAULT_LOCALE, t } from "@/i18n/config";
import { getCollectionByLocale, getEntrySlug } from "@/i18n/content";

export async function GET(context) {
  const articles = await getCollectionByLocale("articles", DEFAULT_LOCALE);
  return rss({
    title: t(DEFAULT_LOCALE, "site.title"),
    description: t(DEFAULT_LOCALE, "site.description"),
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.publishedTime,
      description: article.data.description,
      link: `/articles/${getEntrySlug(article)}/`,
    })),
  });
}
