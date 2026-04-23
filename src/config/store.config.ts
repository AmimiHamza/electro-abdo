export const storeConfig = {
  // ======= CHANGE THESE PER CLIENT =======
  storeName: "ElectroAbdo",
  storeTagline: {
    fr: "Votre boutique d'électronique #1",
    ar: "متجرك الإلكتروني رقم 1",
    en: "Your #1 Electronics Store",
  },
  whatsappNumber: "212702022010", // With country code, no +
  email: "contact@techshop.ma",
  phone: "+212 702 022 010",
  address: {
    fr: "123 Rue Example, Casablanca",
    ar: "123 شارع المثال، الدار البيضاء",
    en: "123 Example Street, Casablanca",
  },
  currency: "DH",
  socialLinks: {
    instagram: "https://instagram.com/techshop",
    facebook: "https://facebook.com/techshop",
    tiktok: "https://tiktok.com/@techshop",
  },
  googleMapsEmbed: "https://maps.google.com/",
  defaultLanguage: "fr" as "fr" | "ar" | "en",
  supportedLocales: ["fr", "ar", "en"] as const,
  deliveryInfo: {
    fr: "Livraison gratuite à partir de 500 DH. Livraison en 24-48h.",
    ar: "توصيل مجاني عند الطلب فوق 500 درهم. التوصيل خلال 24-48 ساعة.",
    en: "Free delivery on orders above 500 DH. Delivery within 24-48h.",
  },
  returnPolicy: {
    fr: "Retours acceptés sous 7 jours.",
    ar: "قبول الإرجاع خلال 7 أيام.",
    en: "Returns accepted within 7 days.",
  },
  workingHours: {
    fr: "Lun-Sam: 9h-20h | Dim: 10h-18h",
    ar: "الإثنين-السبت: 9ص-8م | الأحد: 10ص-6م",
    en: "Mon-Sat: 9am-8pm | Sun: 10am-6pm",
  },
  // ========================================
};
