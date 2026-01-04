import type { Link } from "../types";

export const SITE = {
  author: "Mohammad Rahmani",
  url: "https://astro-news-six.vercel.app",
  github: "https://github.com/Mrahmani71/astro-news",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
};

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    labelKey: "nav.about",
  },
  {
    href: "/authors",
    labelKey: "nav.authors",
  },
  {
    href: "/contact",
    labelKey: "nav.contact",
  },
  {
    href: "/privacy",
    labelKey: "nav.privacy",
  },
  {
    href: "/terms",
    labelKey: "nav.terms",
  },
  {
    href: "/cookie-policy",
    labelKey: "nav.cookiePolicy",
  },
  {
    href: "https://astro-news-six.vercel.app/rss.xml",
    text: "RSS",
  },
  {
    href: "https://astro-news-six.vercel.app/sitemap-index.xml",
    text: "Sitemap",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://github.com",
    text: "GitHub",
    icon: "github",
  },
  {
    href: "httpe://www.t.me",
    text: "Telegram",
    icon: "telegram",
  },
  {
    href: "https://twitter.com",
    text: "Twitter",
    icon: "newTwitter",
  },
  {
    href: "https://www.facebook.com",
    text: "Facebook",
    icon: "facebook",
  },
];
