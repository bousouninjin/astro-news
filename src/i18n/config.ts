export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ja: "日本語",
};

export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ja: "ltr",
};

export const ROUTE_MAP: Record<Locale, Record<string, string>> = {
  en: {
    "/": "/",
    "/about": "/about",
    "/articles": "/articles",
    "/authors": "/authors",
    "/categories": "/categories",
    "/search": "/search",
    "/contact": "/contact",
    "/privacy": "/privacy",
    "/terms": "/terms",
    "/cookie-policy": "/cookie-policy",
  },
  ja: {
    "/": "/",
    "/about": "/about",
    "/articles": "/articles",
    "/authors": "/authors",
    "/categories": "/categories",
    "/search": "/search",
    "/contact": "/contact",
    "/privacy": "/privacy",
    "/terms": "/terms",
    "/cookie-policy": "/cookie-policy",
  },
};

const TRANSLATIONS = {
  en: {
    "site.title": "Astro News",
    "site.description": "A news website built with Astro",
    "nav.home": "Home",
    "nav.articles": "Articles",
    "nav.categories": "Categories",
    "nav.otherPages": "Other Pages",
    "nav.menu": "Menu",
    "nav.authors": "Authors",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.privacy": "Privacy",
    "nav.terms": "Terms",
    "nav.cookiePolicy": "Cookie Policy",
    "nav.search": "Search",
    "nav.language": "Language",
    "header.latestNews": "Latest News",
    "header.viewAll": "View all",
    "header.authors": "Authors",
    "header.breakingNews": "Breaking News",
    "header.news": "News",
    "author.pageTitle": "{name}'s {title}",
    "footer.socialMedia": "Social Media",
    "footer.builtWith": "A news website built with {framework}.",
    "categories.all": "All Categories",
    "categories.seeAll": "See All",
    "categories.articles": "Articles",
    "pagination.previous": "Previous",
    "pagination.next": "Next",
    "pagination.first": "First page",
    "pagination.last": "Last page",
    "carousel.previous": "Previous",
    "carousel.slide": "Slide {index}",
    "share.copyLink": "Copy Link",
    "share.facebook": "Share on Facebook",
    "share.twitter": "Share on Twitter",
    "share.linkedin": "Share on LinkedIn",
    "share.whatsapp": "Share on WhatsApp",
    "search.clear": "× Clear",
    "search.label": "Search",
    "error.returnHome": "Return to Homepage",
  },
  ja: {
    "site.title": "Astro News",
    "site.description": "Astroで構築したニュースサイト",
    "nav.home": "ホーム",
    "nav.articles": "記事",
    "nav.categories": "カテゴリ",
    "nav.otherPages": "その他",
    "nav.menu": "メニュー",
    "nav.authors": "著者",
    "nav.about": "このサイトについて",
    "nav.contact": "お問い合わせ",
    "nav.privacy": "プライバシー",
    "nav.terms": "利用規約",
    "nav.cookiePolicy": "Cookieポリシー",
    "nav.search": "検索",
    "nav.language": "言語",
    "header.latestNews": "最新ニュース",
    "header.viewAll": "すべて見る",
    "header.authors": "著者",
    "header.breakingNews": "速報",
    "header.news": "ニュース",
    "author.pageTitle": "{name}の{title}",
    "footer.socialMedia": "ソーシャル",
    "footer.builtWith": "{framework}で構築したニュースサイト。",
    "categories.all": "すべてのカテゴリ",
    "categories.seeAll": "もっと見る",
    "categories.articles": "記事",
    "pagination.previous": "前へ",
    "pagination.next": "次へ",
    "pagination.first": "最初へ",
    "pagination.last": "最後へ",
    "carousel.previous": "前へ",
    "carousel.slide": "スライド {index}",
    "share.copyLink": "リンクをコピー",
    "share.facebook": "Facebookでシェア",
    "share.twitter": "Twitterでシェア",
    "share.linkedin": "LinkedInでシェア",
    "share.whatsapp": "WhatsAppでシェア",
    "search.clear": "× クリア",
    "search.label": "検索",
    "error.returnHome": "ホームに戻る",
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)["en"];

type TranslationVars = Record<string, string | number>;

export const normalizeLocale = (locale?: string): Locale =>
  LOCALES.includes(locale as Locale) ? (locale as Locale) : DEFAULT_LOCALE;

export const t = (
  locale: string | undefined,
  key: TranslationKey,
  vars: TranslationVars = {}
): string => {
  const normalized = normalizeLocale(locale);
  const value =
    TRANSLATIONS[normalized][key] ??
    TRANSLATIONS[DEFAULT_LOCALE][key] ??
    key;

  return Object.keys(vars).reduce(
    (acc, variable) =>
      acc.replaceAll(`{${variable}}`, String(vars[variable])),
    value
  );
};
