"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";

interface TestimonialData {
  id: string;
  name: string;
  text_fr: string;
  text_ar: string;
  text_en: string;
  rating: number;
}

interface TestimonialsProps {
  testimonials: TestimonialData[];
  locale: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials({ testimonials, locale }: TestimonialsProps) {
  const t = useTranslations("home");
  const textKey = `text_${locale}` as "text_fr" | "text_ar" | "text_en";

  if (testimonials.length === 0) return null;

  return (
    <section className="py-14 overflow-hidden">
      <div className="container-shop">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex items-center justify-center gap-1 mb-2"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            ))}
          </motion.div>
          <h2 className="font-heading text-2xl md:text-3xl font-bold">
            {t("testimonials_title")}
          </h2>
          <div className="section-line mx-auto mt-3" />
        </motion.div>

        {/* Grid (desktop) / Horizontal scroll (mobile) */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible scrollbar-hide pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {testimonials.map((testimonial, i) => {
            const text = testimonial[textKey] || testimonial.text_fr;
            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring", damping: 20 }}
                whileHover={{ y: -4 }}
                className="card p-5 flex-shrink-0 w-72 md:w-auto flex flex-col gap-3 hover:shadow-card-hover transition-shadow duration-300"
              >
                {/* Quote icon */}
                <div className="relative">
                  <Quote className="w-10 h-10 text-accent/20 -scale-x-100" />
                  <div className="absolute inset-0 w-10 h-10 bg-accent/5 rounded-full blur-xl" />
                </div>

                {/* Text */}
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar with gradient ring */}
                    <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-accent to-blue-400">
                      <div className="w-full h-full rounded-full bg-surface flex items-center justify-center font-bold text-accent text-sm">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <StarRating rating={testimonial.rating} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
