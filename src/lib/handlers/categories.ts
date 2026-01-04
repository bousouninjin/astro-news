import type { CollectionEntry } from "astro:content";
import { articlesHandler } from "./articles";
import {
  getCollectionByLocale,
  getEntryKey,
  getEntrySlug,
  getReferenceKey,
} from "@/i18n/content";
import { normalizeLocale, type Locale } from "@/i18n/config";

const categoriesCache = new Map<Locale, CollectionEntry<"categories">[]>();

const loadCategories = async (localeInput?: string) => {
  const locale = normalizeLocale(localeInput);
  const cached = categoriesCache.get(locale);
  if (cached) {
    return cached;
  }
  const categories = await getCollectionByLocale("categories", locale);
  categoriesCache.set(locale, categories);
  return categories;
};

export const categoriesHandler = {
  allCategories: async (locale?: string) => {
    const categories = await loadCategories(locale);
    return categories.sort((a, b) => a.data.title.localeCompare(b.data.title));
  },
  oneCategory: async (locale: string | undefined, categoryId: string) => {
    const categories = await loadCategories(locale);
    const category = categories.find(
      (entry) =>
        entry.data.path === categoryId || getEntrySlug(entry) === categoryId
    );
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }
    return category;
  },
  allCategoriesWithLatestArticles: async (locale?: string) => {
    const categories = await loadCategories(locale);
    const articles = await articlesHandler.allArticles(locale);

    return categories.map((category) => {
      const categoryKey = getEntryKey(category);
      const categoryArticles = articles.filter((article) => {
        const refKey = getReferenceKey(article.data.category);
        return refKey === categoryKey;
      });
      return {
        ...category,
        data: {
          ...category.data,
          count: categoryArticles.length,
          latestArticles: categoryArticles.slice(0, 3),
        },
      };
    });
  },
};
