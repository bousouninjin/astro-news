import type { CollectionEntry } from "astro:content";
import {
  getCollectionByLocale,
  getEntryKey,
  getEntrySlug,
  getReferenceKey,
  type ReferenceLike,
} from "@/i18n/content";
import { normalizeLocale, type Locale } from "@/i18n/config";

const authorsCache = new Map<Locale, CollectionEntry<"authors">[]>();

const loadAuthors = async (localeInput?: string) => {
  const locale = normalizeLocale(localeInput);
  const cached = authorsCache.get(locale);
  if (cached) {
    return cached;
  }
  const authors = await getCollectionByLocale("authors", locale);
  authorsCache.set(locale, authors);
  return authors;
};

export const authorsHandler = {
  allAuthors: (locale?: string) => loadAuthors(locale),
  limitAurhors: async (locale: string | undefined, limit: number) => {
    const authors = await loadAuthors(locale);
    return authors.slice(0, limit);
  },
  getAuthors: async (locale: string | undefined, authors: ReferenceLike[]) => {
    const authorEntries = await loadAuthors(locale);
    return authors.map((authorRef) => {
      const refKey = getReferenceKey(authorRef);
      const author = authorEntries.find(
        (entry) => getEntryKey(entry) === refKey
      );
      if (!author) {
        throw new Error(`Author ${refKey} not found`);
      }
      return author;
    });
  },
  findAuthor: async (locale: string | undefined, id: string) => {
    const authors = await loadAuthors(locale);
    const author = authors.find((entry) => getEntrySlug(entry) === id);
    if (!author) {
      throw new Error(`Author ${id} not found`);
    }
    return author;
  },
};
