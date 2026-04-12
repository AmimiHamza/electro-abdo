import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["fr", "ar", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./${locale}.json`)).default,
  };
});
