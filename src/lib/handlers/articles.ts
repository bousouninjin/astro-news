import type { CollectionEntry } from "astro:content";
import { getCollectionByLocale } from "@/i18n/content";
import { normalizeLocale, type Locale } from "@/i18n/config";

const articlesCache = new Map<Locale, CollectionEntry<"articles">[]>();

const loadArticles = async (localeInput?: string) => {
  const locale = normalizeLocale(localeInput);
  const cached = articlesCache.get(locale);
  if (cached) {
    return cached;
  }

  const articles = (await getCollectionByLocale("articles", locale)).filter(
    ({ data }) =>
      data.isDraft !== true && new Date(data.publishedTime) < new Date()
  );

  const sorted = articles.sort((a, b) =>
    new Date(b.data.publishedTime)
      .toISOString()
      .localeCompare(new Date(a.data.publishedTime).toISOString())
  );

  articlesCache.set(locale, sorted);
  return sorted;
};

export const articlesHandler = {
  allArticles: (locale?: string) => loadArticles(locale),

  mainHeadline: async (locale?: string) => {
    const articles = await loadArticles(locale);
    const article = articles.find(
      (entry) => entry.data.isMainHeadline === true
    );
    if (!article) {
      throw new Error(
        "Please ensure there is at least one item to display for the main headline."
      );
    }
    return article;
  },

  subHeadlines: async (locale?: string) => {
    const articles = await loadArticles(locale);
    const mainHeadline = await articlesHandler.mainHeadline(locale);
    const subHeadlines = articles
      .filter(
        (entry) =>
          entry.data.isSubHeadline === true && mainHeadline.id !== entry.id
      )
      .slice(0, 4);

    if (subHeadlines.length === 0) {
      throw new Error(
        "Please ensure there is at least one item to display for the sub headlines."
      );
    }
    return subHeadlines;
  },
};
