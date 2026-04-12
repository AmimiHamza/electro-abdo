import { getTranslations } from "next-intl/server";
import { Phone, Mail, MapPin, Clock, Truck, RefreshCw } from "lucide-react";
import { storeConfig } from "@/config/store.config";
import Link from "next/link";

interface PageProps {
  params: { locale: string };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "about" });
  const loc = locale as "fr" | "ar" | "en";

  return (
    <div className="container-shop py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-lg mt-3 max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Info cards */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-accent" />
              {t("contact_us")}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <Link
                  href={`tel:${storeConfig.phone}`}
                  className="text-foreground hover:text-accent transition-colors"
                >
                  {storeConfig.phone}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <Link
                  href={`mailto:${storeConfig.email}`}
                  className="text-foreground hover:text-accent transition-colors"
                >
                  {storeConfig.email}
                </Link>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{storeConfig.address[loc]}</span>
              </div>
            </div>
          </div>

          {/* Working hours */}
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              {t("working_hours")}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {storeConfig.workingHours[loc]}
            </p>
          </div>

          {/* Delivery */}
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              {t("delivery_zones")}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {storeConfig.deliveryInfo[loc]}
            </p>
          </div>

          {/* Return policy */}
          <div className="card p-6">
            <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-accent" />
              {locale === "ar" ? "سياسة الإرجاع" : locale === "en" ? "Return Policy" : "Politique de retour"}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {storeConfig.returnPolicy[loc]}
            </p>
          </div>
        </div>

        {/* Right: Map */}
        <div>
          <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            {t("find_us")}
          </h2>
          <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3] bg-muted">
            <iframe
              src={storeConfig.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store location"
            />
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-6 card p-6 bg-green-500/10 border-green-500/20">
            <h3 className="font-heading font-bold text-base mb-2 text-green-700 dark:text-green-400">
              {locale === "ar" ? "تواصل معنا عبر واتساب" : locale === "en" ? "Contact us on WhatsApp" : "Contactez-nous sur WhatsApp"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {locale === "ar"
                ? "تحدث معنا مباشرة للاستفسار أو الطلب"
                : locale === "en"
                ? "Chat with us directly for inquiries or orders"
                : "Discutez directement avec nous pour des renseignements ou commandes"}
            </p>
            <Link
              href={`https://wa.me/${storeConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn py-2.5 px-5 text-sm bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors inline-flex"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
