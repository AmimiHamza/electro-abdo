import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { HelpCircle } from "lucide-react";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

interface PageProps {
  params: { locale: string };
}

export default async function FAQPage({ params }: PageProps) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "faq" });

  const faqs = await prisma.fAQ
    .findMany({ orderBy: { order: "asc" } })
    .catch(() => []);

  const qKey = locale === "ar" ? "question_ar" : locale === "en" ? "question_en" : "question_fr";
  const aKey = locale === "ar" ? "answer_ar" : locale === "en" ? "answer_en" : "answer_fr";

  const items = faqs.map((faq) => ({
    id: faq.id,
    question: faq[qKey],
    answer: faq[aKey],
  }));

  return (
    <div className="container-shop py-10 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
          <HelpCircle className="w-7 h-7 text-accent" />
        </div>
        <h1 className="font-heading text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          {locale === "ar"
            ? "لا توجد أسئلة متاحة."
            : locale === "en"
            ? "No questions available yet."
            : "Aucune question disponible pour le moment."}
        </p>
      ) : (
        <FAQAccordion items={items} />
      )}
    </div>
  );
}
