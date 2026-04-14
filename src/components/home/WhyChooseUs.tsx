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
    <section className="py-16 bg-gray-100 dark:bg-gradient-to-br dark:from-[#1a1a2e] dark:to-[#16213e] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 start-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 end-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="container-shop relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {tHome("why_us_title")}
          </h2>
          <div className="section-line mx-auto mt-3" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = icons[card.icon];
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-7 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-accent/40 dark:hover:border-accent/30 shadow-sm hover:shadow-lg dark:hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${iconColors[i]} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
                >
                  <Icon className="w-8 h-8" />
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
