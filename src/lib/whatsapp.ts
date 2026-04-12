import { storeConfig } from "@/config/store.config";
import { CartItem } from "@/stores/cartStore";

/**
 * Generate a formatted WhatsApp order message
 */
export function generateOrderMessage(
  items: CartItem[],
  locale: "fr" | "ar" | "en" = "fr"
): string {
  const divider = "─────────────────";

  const itemLines = items
    .map((item) => `${item.quantity}x ${item.name} — ${item.price * item.quantity} ${storeConfig.currency}`)
    .join("\n");

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const messages = {
    fr: `🛒 Nouvelle commande — ${storeConfig.storeName}\n${divider}\n${itemLines}\n${divider}\n💰 Total: ${total} ${storeConfig.currency}\n📱 Veuillez ajouter votre nom et adresse`,
    ar: `🛒 طلب جديد — ${storeConfig.storeName}\n${divider}\n${itemLines}\n${divider}\n💰 المجموع: ${total} ${storeConfig.currency}\n📱 يرجى إضافة اسمك وعنوانك`,
    en: `🛒 New Order — ${storeConfig.storeName}\n${divider}\n${itemLines}\n${divider}\n💰 Total: ${total} ${storeConfig.currency}\n📱 Please add your name and address`,
  };

  return messages[locale];
}

/**
 * Generate a single product share message
 */
export function generateShareMessage(
  productName: string,
  price: number,
  url: string,
  locale: "fr" | "ar" | "en" = "fr"
): string {
  const messages = {
    fr: `Regardez ce produit sur ${storeConfig.storeName}:\n${productName} — ${price} ${storeConfig.currency}\n${url}`,
    ar: `اطلع على هذا المنتج في ${storeConfig.storeName}:\n${productName} — ${price} ${storeConfig.currency}\n${url}`,
    en: `Check out this product on ${storeConfig.storeName}:\n${productName} — ${price} ${storeConfig.currency}\n${url}`,
  };

  return messages[locale];
}

/**
 * Build the WhatsApp redirect URL
 */
export function buildWhatsAppOrderUrl(
  items: CartItem[],
  locale: "fr" | "ar" | "en" = "fr"
): string {
  const message = generateOrderMessage(items, locale);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encoded}`;
}
