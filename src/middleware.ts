import { middleware } from "astro:i18n";

export const onRequest = middleware({
  prefixDefaultLocale: false,
  redirectToDefaultLocale: false,
  fallbackType: "rewrite",
});
