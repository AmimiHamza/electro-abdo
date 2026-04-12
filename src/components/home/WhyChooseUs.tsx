import { getTranslations } from "next-intl/server";
import { Truck, ShieldCheck, Headphones, BadgeDollarSign } from "lucide-react";

interface WhyChooseUsProps {
  locale: string;
}

const icons = [Truck, ShieldCheck, Headphones, BadgeDollarSign];
const iconColors = [
  "text-blue-500 bg-blue-500/10",
  "text-green-500 bg-green-500/10",
  "text-purple-500 bg-purple-500/10",
  "text-amber-500 bg-amber-500/10",
];

export async function WhyChooseUs({ locale }: WhyChooseUsProps) {
  const t = await getTranslations({ locale, namespace: "why_us" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  const cards = [
    { icon: 0, title: t("delivery_title"), desc: t("delivery_desc") },
    { icon: 1, title: t("genuine_title"), desc: t("genuine_desc") },
    { icon: 2, title: t("support_title"), desc: t("support_desc") },
    { icon: 3, title: t("prices_title"), desc: t("prices_desc") },
  ];

  return (
    <section className="py-14 bg-gray-100 dark:bg-gradient-to-br dark:from-[#1a1a2e] dark:to-[#16213e]">
      <div className="container-shop">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {tHome("why_us_title")}
          </h2>
          <div className="gradient-strip w-24 mx-auto mt-3" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = icons[card.icon];
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-accent/40 dark:hover:border-accent/30 shadow-sm hover:shadow-md dark:hover:bg-white/10 transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${iconColors[i]} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white text-base mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
