import {
  getCollection,
  getEntry,
  type CollectionEntry,
  type CollectionKey,
} from "astro:content";
import { DEFAULT_LOCALE, LOCALES, normalizeLocale, type Locale } from "./config";

export type ReferenceLike =
  | string
  | {
      id?: string;
      slug?: string;
      collection?: string;
    };

export const getEntryKey = (entry: { slug?: string; id: string }) =>
  entry.slug ?? entry.id;

const normalizeKey = (key: string) => key.replace(/\/index$/, "");

export const getLocaleFromKey = (key: string): Locale => {
  const [maybeLocale] = normalizeKey(key).split("/");
  return LOCALES.includes(maybeLocale as Locale)
    ? (maybeLocale as Locale)
    : DEFAULT_LOCALE;
};

export const stripLocaleFromKey = (key: string): string => {
  const normalized = normalizeKey(key);
  const [maybeLocale, ...rest] = normalized.split("/");
  if (LOCALES.includes(maybeLocale as Locale)) {
    return rest.join("/") || "";
  }
  return normalized;
};

export const getEntryLocale = (entry: { slug?: string; id: string }) =>
  getLocaleFromKey(getEntryKey(entry));

export const getEntrySlug = (entry: { slug?: string; id: string }) =>
  stripLocaleFromKey(getEntryKey(entry));

export const getReferenceKey = (reference: ReferenceLike): string =>
  typeof reference === "string"
    ? reference
    : reference.slug ?? reference.id ?? "";

export const buildEntryKey = (locale: Locale, slug: string) =>
  `${locale}/${slug}`;

export const getCollectionByLocale = async <K extends CollectionKey>(
  collection: K,
  localeInput: string | undefined
): Promise<CollectionEntry<K>[]> => {
  const locale = normalizeLocale(localeInput);
  const entries = await getCollection(collection);
  const localized = entries.filter(
    (entry) => getEntryLocale(entry) === locale
  );

  if (localized.length === 0 && locale !== DEFAULT_LOCALE) {
    return entries.filter(
      (entry) => getEntryLocale(entry) === DEFAULT_LOCALE
    );
  }

  return localized;
};

export const getEntryBySlug = async <K extends CollectionKey>(
  collection: K,
  slug: string,
  localeInput: string | undefined
): Promise<CollectionEntry<K> | undefined> => {
  const locale = normalizeLocale(localeInput);
  const entryKey = buildEntryKey(locale, slug);

  const entry = await getEntry(collection, entryKey as never);
  if (entry) {
    return entry;
  }

  if (locale !== DEFAULT_LOCALE) {
    return await getEntry(
      collection,
      buildEntryKey(DEFAULT_LOCALE, slug) as never
    );
  }

  return undefined;
};
