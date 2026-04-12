import { storeConfig } from "@/config/store.config";

/**
 * Format a price with the store's currency symbol
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-MA")} ${storeConfig.currency}`;
}

/**
 * Calculate discount percentage between two prices
 */
export function discountPercent(oldPrice: number, newPrice: number): number {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Get the translated field from a multilingual object
 */
export function t(
  obj: { name_fr?: string; name_ar?: string; name_en?: string },
  locale: "fr" | "ar" | "en"
): string {
  return obj[`name_${locale}` as keyof typeof obj] ?? obj.name_fr ?? "";
}

/**
 * Truncate text to a max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Parse comma-separated tags string into array
 */
export function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Parse JSON specs string into key-value pairs
 */
export function parseSpecs(
  specs?: string | null
): Record<string, string> {
  if (!specs) return {};
  try {
    return JSON.parse(specs);
  } catch {
    return {};
  }
}

/**
 * Format countdown time from milliseconds
 */
export function formatCountdown(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

/**
 * Generate WhatsApp URL with message
 */
export function whatsappUrl(
  phoneNumber: string,
  message: string
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
