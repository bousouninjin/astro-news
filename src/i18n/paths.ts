import { getRelativeLocaleUrl } from "astro:i18n";
import {
  DEFAULT_LOCALE,
  LOCALES,
  ROUTE_MAP,
  normalizeLocale,
  type Locale,
} from "./config";

const ensureLeadingSlash = (path: string) =>
  path.startsWith("/") ? path : `/${path}`;

const isLocalePrefix = (segment: string): segment is Locale =>
  LOCALES.includes(segment as Locale);

export const stripLocaleFromPath = (pathname: string): string => {
  const normalized = ensureLeadingSlash(pathname);
  const [, first, ...rest] = normalized.split("/");
  if (!first || !isLocalePrefix(first)) {
    return normalized;
  }
  const next = rest.join("/");
  return next ? `/${next}` : "/";
};

const applyRouteMap = (locale: Locale, pathname: string): string => {
  const normalized = ensureLeadingSlash(pathname);
  const map = ROUTE_MAP[locale];
  const matches = Object.keys(map).sort((a, b) => b.length - a.length);
  const match = matches.find(
    (base) => normalized === base || normalized.startsWith(`${base}/`)
  );
  if (!match) {
    return normalized;
  }
  return normalized.replace(match, map[match]);
};

const resolveBasePath = (locale: Locale, pathname: string): string => {
  const normalized = ensureLeadingSlash(pathname);
  const map = ROUTE_MAP[locale];
  const entries = Object.entries(map).sort(
    ([, a], [, b]) => b.length - a.length
  );
  for (const [base, localized] of entries) {
    if (normalized === localized || normalized.startsWith(`${localized}/`)) {
      return normalized.replace(localized, base);
    }
  }
  return normalized;
};

export const localizePath = (
  localeInput: string | undefined,
  pathname: string
): string => {
  const locale = normalizeLocale(localeInput);
  const normalized = ensureLeadingSlash(pathname);
  const localized = applyRouteMap(locale, normalized);
  return getRelativeLocaleUrl(locale, localized);
};

export const getLocaleLinks = (
  currentPathname: string,
  currentLocaleInput: string | undefined
) => {
  const currentLocale = normalizeLocale(currentLocaleInput);
  const basePath = resolveBasePath(
    currentLocale,
    stripLocaleFromPath(currentPathname)
  );

  return LOCALES.map((locale) => ({
    locale,
    url: localizePath(locale, basePath),
    isDefault: locale === DEFAULT_LOCALE,
  }));
};
