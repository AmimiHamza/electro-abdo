"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check, Search } from "lucide-react";
import { useAdminT } from "@/hooks/useAdminT";
import type { AdminTranslationKey } from "@/i18n/admin";

interface Offer {
  id: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  productIds: string;
  discount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface ProductOption {
  id: string;
  name_fr: string;
  name_en: string;
  brand: string | null;
  price: number;
  category?: { name_fr: string } | null;
}

/* ── Product Picker ── */
function ProductPicker({
  selectedIds,
  onChange,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const { t } = useAdminT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductOption[]>([]);
  const [selected, setSelected] = useState<ProductOption[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load selected products on mount
  useEffect(() => {
    if (selectedIds.length === 0) return;
    const loadSelected = async () => {
      const res = await fetch(
        `/api/admin/products?ids=${encodeURIComponent(selectedIds.join(","))}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setSelected(data.products ?? []);
    };
    loadSelected();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search products
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const res = await fetch(
        `/api/admin/products?limit=10&search=${encodeURIComponent(query.trim())}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.products ?? []);
      }
      setSearching(false);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addProduct = (product: ProductOption) => {
    if (selectedIds.includes(product.id)) return;
    const newIds = [...selectedIds, product.id];
    setSelected((prev) => [...prev, product]);
    onChange(newIds);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const removeProduct = (id: string) => {
    onChange(selectedIds.filter((sid) => sid !== id));
    setSelected((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <label className="admin-label">{t("products_in_offer")}</label>

      {/* Selected products */}
      {selected.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-3">
          {selected.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {p.name_fr}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {p.brand && `${p.brand} · `}
                  {p.price.toLocaleString()} DH
                  {p.category && ` · ${p.category.name_fr}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeProduct(p.id)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => query.trim() && setOpen(true)}
            placeholder={t("search_products_to_add")}
            className="admin-input ps-9"
          />
          {searching && (
            <Loader2 className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>

        {/* Dropdown results */}
        {open && results.length > 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto">
            {results.map((product) => {
              const isAlready = selectedIds.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={isAlready}
                  onClick={() => addProduct(product)}
                  className={`w-full text-start px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                    isAlready ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {product.name_fr}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {product.brand && `${product.brand} · `}
                      {product.price.toLocaleString()} DH
                      {product.category && ` · ${product.category.name_fr}`}
                    </p>
                  </div>
                  {isAlready ? (
                    <span className="text-[10px] text-gray-400 font-medium shrink-0 ms-2">{t("added")}</span>
                  ) : (
                    <Plus className="w-4 h-4 text-blue-500 shrink-0 ms-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {open && query.trim() && !searching && results.length === 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 text-center text-sm text-gray-400">
            {t("no_products_found_short")}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Offer Modal ── */
function OfferModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Offer;
  onSave: () => void;
  onClose: () => void;
}) {
  const { t } = useAdminT();
  const initialIds = initial?.productIds
    ? initial.productIds.split(",").map((id) => id.trim()).filter(Boolean)
    : [];

  const [form, setForm] = useState({
    title_fr: initial?.title_fr ?? "",
    title_ar: initial?.title_ar ?? "",
    title_en: initial?.title_en ?? "",
    productIds: initialIds,
    discount: initial?.discount?.toString() ?? "",
    startDate: initial?.startDate
      ? initial.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: initial?.endDate ? initial.endDate.split("T")[0] : "",
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.title_fr || !form.endDate) {
      setError(t("title_end_required"));
      return;
    }
    setSaving(true);
    const body = {
      title_fr: form.title_fr,
      title_ar: form.title_ar,
      title_en: form.title_en,
      productIds: form.productIds.join(","),
      discount: form.discount ? parseFloat(form.discount) : null,
      startDate: form.startDate,
      endDate: form.endDate,
      isActive: form.isActive,
    };
    const url = initial
      ? `/api/admin/offers/${initial.id}`
      : "/api/admin/offers";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) {
      setError(t("failed_to_save"));
      return;
    }
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            {initial ? t("edit_offer") : t("new_offer")}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-3">
          {([
            { labelKey: "title_fr" as AdminTranslationKey, key: "title_fr", dir: "ltr", required: true },
            { labelKey: "title_ar" as AdminTranslationKey, key: "title_ar", dir: "rtl", required: true },
            { labelKey: "title_en" as AdminTranslationKey, key: "title_en", dir: "ltr", required: false },
          ] as const).map(({ labelKey, key, dir, required }) => (
            <div key={key}>
              <label className="admin-label">{t(labelKey)}{required ? " *" : ""}</label>
              <input
                value={
                  key === "title_fr"
                    ? form.title_fr
                    : key === "title_ar"
                    ? form.title_ar
                    : form.title_en
                }
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="admin-input"
                dir={dir}
              />
            </div>
          ))}

          {/* Product Picker */}
          <ProductPicker
            selectedIds={form.productIds}
            onChange={(ids) => setForm({ ...form, productIds: ids })}
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="admin-label">{t("discount_percent")}</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">{t("start_date")} *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="admin-input"
              />
            </div>
            <div>
              <label className="admin-label">{t("end_date")} *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                className="admin-input"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="w-4 h-4 accent-blue-600"
            />
            {t("active")}
          </label>
        </div>
        <div className="flex gap-2 mt-5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn-primary flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {saving ? t("saving") : t("save")}
          </button>
          <button onClick={onClose} className="admin-btn-outline">
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Offers Page ── */
export default function OffersPage() {
  const { t } = useAdminT();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; offer?: Offer }>({
    open: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/offers");
    if (res.ok) setOffers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_offer_confirm"))) return;
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("offers_title")}
        </h1>
        <button
          onClick={() => setModal({ open: true })}
          className="admin-btn-primary flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> {t("add_offer")}
        </button>
      </div>

      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {t("title_fr")}
                </th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {t("discount")}
                </th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {t("end_date")}
                </th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {t("status")}
                </th>
                <th className="text-end px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {offers.map((offer) => {
                const isExpired = new Date(offer.endDate) < new Date();
                return (
                  <tr
                    key={offer.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                      {offer.title_fr}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {offer.discount ? `${offer.discount}%` : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {new Date(offer.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          isExpired
                            ? "bg-gray-100 text-gray-500"
                            : offer.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {isExpired
                          ? t("expired")
                          : offer.isActive
                          ? t("active")
                          : t("inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() =>
                            setModal({ open: true, offer })
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {offers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400"
                  >
                    {t("no_offers")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal.open && (
        <OfferModal
          key={modal.offer?.id ?? "new"}
          initial={modal.offer}
          onSave={load}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
