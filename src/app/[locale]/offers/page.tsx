import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { ProductCard } from "@/components/product/ProductCard";
import { Tag } from "lucide-react";

interface PageProps {
  params: { locale: string };
}

export default async function OffersPage({ params }: PageProps) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "offers" });

  const now = new Date();
  const offers = await prisma.offer
    .findMany({
      where: { isActive: true, endDate: { gt: now } },
      orderBy: { endDate: "asc" },
    })
    .catch(() => []);

  const nameKey = locale === "ar" ? "title_ar" : locale === "en" ? "title_en" : "title_fr";

  // Fetch products for each offer
  const offersWithProducts = await Promise.all(
    offers.map(async (offer) => {
      const ids = offer.productIds.split(",").map((id) => id.trim()).filter(Boolean);
      const products = await prisma.product
        .findMany({
          where: { id: { in: ids }, isVisible: true },
          include: { images: { take: 1, orderBy: { order: "asc" } } },
        })
        .catch(() => []);
      return { offer, products };
    })
  );

  return (
    <div className="container-shop py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-3">
          <Tag className="w-4 h-4" />
          {t("active")}
        </div>
        <h1 className="font-heading text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
      </div>

      {offersWithProducts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Tag className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-semibold">
            {locale === "ar" ? "لا توجد عروض حالياً" : locale === "en" ? "No active offers" : "Aucune offre en cours"}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {offersWithProducts.map(({ offer, products }) => {
            const endDate = offer.endDate instanceof Date ? offer.endDate.toISOString() : String(offer.endDate);
            const serialized = products.map((p) => ({
              id: p.id,
              name_fr: p.name_fr,
              name_ar: p.name_ar,
              name_en: p.name_en,
              price: p.price,
              oldPrice: p.oldPrice,
              images: p.images.map((img) => ({ url: img.url, order: img.order })),
              stock: p.stock,
              isNewArrival: p.isNewArrival,
              warranty: p.warranty,
              brand: p.brand,
              categoryId: p.categoryId,
              tags: p.tags,
            }));
            return (
              <section key={offer.id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold">{offer[nameKey]}</h2>
                    {offer.discount && (
                      <span className="badge badge-offer mt-1 inline-block">
                        -{offer.discount}% {locale === "ar" ? "خصم" : locale === "en" ? "OFF" : "de réduction"}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0">
                    <p className="text-xs text-muted-foreground mb-1">{t("ends_in")}</p>
                    <CountdownTimer endDate={endDate} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {serialized.map((product) => (
                    <ProductCard key={product.id} product={product} locale={locale} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
