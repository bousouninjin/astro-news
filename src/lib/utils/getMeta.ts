import { render, type CollectionEntry } from "astro:content";
import { authorsHandler } from "@/lib/handlers/authors";
import defaultImage from "@/assets/images/default-image.jpg";
import type { ArticleMeta, Meta } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils/letter";
import { normalizeDate } from "@/lib/utils/date";
import { normalizeLocale, t } from "@/i18n/config";
import { getEntrySlug } from "@/i18n/content";

type GetMetaCollection = CollectionEntry<"articles" | "views">;

const renderCache = new Map<string, any>();

export const getMeta = async (
  collection: GetMetaCollection,
  category?: string,
  localeInput?: string
): Promise<Meta | ArticleMeta> => {
  try {
    const locale = normalizeLocale(localeInput);
    const siteTitle = t(locale, "site.title");
    const collectionId = `${collection.collection}-${collection.id}`;

    if (collection.collection === "articles") {

      const cacheKey = `${collectionId}-${locale}`;
      if (renderCache.has(cacheKey)) {
        return renderCache.get(cacheKey);
      }

      const { remarkPluginFrontmatter } = await render(collection);
      const authors = await authorsHandler.getAuthors(
        locale,
        collection.data.authors
      );

      const meta: ArticleMeta = {
        title: `${capitalizeFirstLetter(collection.data.title)} - ${siteTitle}`,
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description,
        ogImage: collection.data.cover.src,
        ogImageAlt: collection.data.covert_alt || collection.data.title,
        publishedTime: normalizeDate(collection.data.publishedTime),
        lastModified: remarkPluginFrontmatter.lastModified,
        authors: authors.map((author) => ({
          name: author.data.name,
          link: getEntrySlug(author),
        })),
        type: "article",
      }

      renderCache.set(cacheKey, meta);

      return meta;
    }

    if (collection.collection === "views") {

      const cacheKey = category
        ? `${collectionId}-${category}-${locale}`
        : `${collectionId}-${locale}`;
      if (renderCache.has(cacheKey)) {
        return renderCache.get(cacheKey);
      }

      const entrySlug = getEntrySlug(collection);
      const title = entrySlug === "categories" && category
        ? `${capitalizeFirstLetter(category)} - ${siteTitle}`
        : entrySlug === "home"
          ? siteTitle
          : `${capitalizeFirstLetter(collection.data.title)} - ${siteTitle}`;

      const meta: Meta = {
        title,
        metaTitle: capitalizeFirstLetter(collection.data.title),
        description: collection.data.description,
        ogImage: defaultImage.src,
        ogImageAlt: siteTitle,
        type: "website",
      };
      renderCache.set(cacheKey, meta);
      return meta;
    }

    throw new Error(`Invalid collection type: ${(collection as GetMetaCollection).collection}`);
  } catch (error) {
    console.error(`Error generating metadata for ${collection.id}:`, error);
    throw error;
  }
};
