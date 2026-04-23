"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { useAdminT } from "@/hooks/useAdminT";
import type { AdminTranslationKey } from "@/i18n/admin";

const schema = z.object({
  name_fr: z.string().min(1, "Required"),
  name_ar: z.string().min(1, "Required"),
  name_en: z.string().min(1, "Required"),
  description_fr: z.string().min(1, "Required"),
  description_ar: z.string().min(1, "Required"),
  description_en: z.string().min(1, "Required"),
  price: z.coerce.number().positive("Must be positive"),
  oldPrice: z.coerce.number().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Required"),
  brand: z.string().optional(),
  tags: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Cannot be negative"),
  warranty: z.string().optional(),
  isNewArrival: z.boolean().default(false),
  isVisible: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface SpecRow {
  key: string;
  value: string;
}

interface Category {
  id: string;
  name_fr: string;
}

interface ProductFormProps {
  categories: Category[];
  defaultValues?: Partial<FormData> & { id?: string; images?: string[]; specs?: Record<string, string> };
  mode: "create" | "edit";
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

type TabKey = "tab_basic" | "tab_media" | "tab_specs" | "tab_settings";
const TAB_KEYS: TabKey[] = ["tab_basic", "tab_media", "tab_specs", "tab_settings"];

export function ProductForm({ categories, defaultValues, mode }: ProductFormProps) {
  const router = useRouter();
  const { t } = useAdminT();
  const [activeTab, setActiveTab] = useState<TabKey>("tab_basic");
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? []);
  const [specs, setSpecs] = useState<SpecRow[]>(
    defaultValues?.specs
      ? Object.entries(defaultValues.specs).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      name_fr: defaultValues?.name_fr ?? "",
      name_ar: defaultValues?.name_ar ?? "",
      name_en: defaultValues?.name_en ?? "",
      description_fr: defaultValues?.description_fr ?? "",
      description_ar: defaultValues?.description_ar ?? "",
      description_en: defaultValues?.description_en ?? "",
      price: defaultValues?.price ?? 0,
      oldPrice: defaultValues?.oldPrice ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      brand: defaultValues?.brand ?? "",
      tags: defaultValues?.tags ?? "",
      stock: defaultValues?.stock ?? 0,
      warranty: defaultValues?.warranty ?? "",
      isNewArrival: defaultValues?.isNewArrival ?? false,
      isVisible: defaultValues?.isVisible ?? true,
    },
  });

  const addSpecRow = () => setSpecs([...specs, { key: "", value: "" }]);
  const removeSpecRow = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: "key" | "value", val: string) => {
    setSpecs(specs.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");

    const specsObj: Record<string, string> = {};
    specs.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) specsObj[key.trim()] = value.trim();
    });

    const payload = {
      ...data,
      oldPrice: data.oldPrice === "" ? null : Number(data.oldPrice),
      specs: Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : null,
      images,
    };

    const url =
      mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${defaultValues?.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || t("failed_to_save"));
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const nameKeys: Record<"fr" | "ar" | "en", AdminTranslationKey> = {
    fr: "name_fr",
    ar: "name_ar",
    en: "name_en",
  };
  const descKeys: Record<"fr" | "ar" | "en", AdminTranslationKey> = {
    fr: "description_fr",
    ar: "description_ar",
    en: "description_en",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              activeTab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {/* ── Basic Info ── */}
      {activeTab === "tab_basic" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["fr", "ar", "en"] as const).map((lang) => (
              <div key={lang}>
                <label className="admin-label">{t(nameKeys[lang])} *</label>
                <input
                  {...register(`name_${lang}`)}
                  className="admin-input"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
                <FieldError message={errors[`name_${lang}`]?.message} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["fr", "ar", "en"] as const).map((lang) => (
              <div key={lang}>
                <label className="admin-label">{t(descKeys[lang])} *</label>
                <textarea
                  {...register(`description_${lang}`)}
                  rows={4}
                  className="admin-input resize-none"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                />
                <FieldError message={errors[`description_${lang}`]?.message} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="admin-label">{t("category")} *</label>
              <select {...register("categoryId")} className="admin-input">
                <option value="">{t("select_category")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_fr}
                  </option>
                ))}
              </select>
              <FieldError message={errors.categoryId?.message} />
            </div>
            <div>
              <label className="admin-label">{t("brand")}</label>
              <input {...register("brand")} className="admin-input" placeholder="Samsung" />
            </div>
            <div>
              <label className="admin-label">{t("price_label")} *</label>
              <input {...register("price")} type="number" step="0.01" className="admin-input" />
              <FieldError message={errors.price?.message} />
            </div>
            <div>
              <label className="admin-label">{t("old_price")}</label>
              <input {...register("oldPrice")} type="number" step="0.01" className="admin-input" placeholder={t("optional")} />
            </div>
          </div>

          <div>
            <label className="admin-label">{t("tags_label")}</label>
            <input {...register("tags")} className="admin-input" placeholder="5G, Fast Charge, USB-C" />
          </div>
        </div>
      )}

      {/* ── Media ── */}
      {activeTab === "tab_media" && (
        <div>
          <label className="admin-label mb-2">{t("product_images")}</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>
      )}

      {/* ── Specs ── */}
      {activeTab === "tab_specs" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="admin-label mb-0">{t("specifications")}</label>
            <button
              type="button"
              onClick={addSpecRow}
              className="admin-btn-outline text-xs px-3 py-1.5 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {t("add_row")}
            </button>
          </div>
          <div className="space-y-2">
            {specs.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                <input
                  value={row.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                  className="admin-input flex-1"
                  placeholder={t("spec_key_placeholder")}
                />
                <input
                  value={row.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                  className="admin-input flex-1"
                  placeholder={t("spec_value_placeholder")}
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(i)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Settings ── */}
      {activeTab === "tab_settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="admin-label">{t("stock")}</label>
            <input {...register("stock")} type="number" className="admin-input" />
            <FieldError message={errors.stock?.message} />
          </div>
          <div>
            <label className="admin-label">{t("warranty")}</label>
            <input {...register("warranty")} className="admin-input" placeholder="1 Year" />
          </div>
          <div className="flex items-center gap-3">
            <input
              {...register("isNewArrival")}
              type="checkbox"
              id="isNewArrival"
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="isNewArrival" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("mark_new_arrival")}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              {...register("isVisible")}
              type="checkbox"
              id="isVisible"
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="isVisible" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("visible_to_customers")}
            </label>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={saving}
          className="admin-btn-primary flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? t("saving") : mode === "create" ? t("create_product") : t("save_changes")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="admin-btn-outline"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
