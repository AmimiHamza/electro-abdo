"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, Star, X, Check } from "lucide-react";
import { useAdminT } from "@/hooks/useAdminT";

interface Testimonial {
  id: string;
  name: string;
  text_fr: string;
  text_ar: string;
  text_en: string;
  rating: number;
}

function TestimonialModal({ initial, onSave, onClose }: { initial?: Testimonial; onSave: () => void; onClose: () => void }) {
  const { t } = useAdminT();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    text_fr: initial?.text_fr ?? "",
    text_ar: initial?.text_ar ?? "",
    text_en: initial?.text_en ?? "",
    rating: initial?.rating ?? 5,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name || !form.text_fr) { setError(t("name_text_required")); return; }
    setSaving(true);
    const url = initial ? `/api/admin/testimonials/${initial.id}` : "/api/admin/testimonials";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) { setError(t("failed_to_save")); return; }
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{initial ? t("edit_review") : t("new_review")}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-4 h-4" /></button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="admin-label">{t("customer_name")} *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">{t("rating")}</label>
            <div className="flex gap-1 mt-1">
              {[1,2,3,4,5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className={`transition-colors ${star <= form.rating ? "text-yellow-400" : "text-gray-300"}`}>
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div><label className="admin-label">{t("text_fr")} *</label><textarea value={form.text_fr} onChange={(e) => setForm({ ...form, text_fr: e.target.value })} rows={3} className="admin-input resize-none" /></div>
          <div><label className="admin-label">{t("text_ar")}</label><textarea value={form.text_ar} onChange={(e) => setForm({ ...form, text_ar: e.target.value })} rows={3} className="admin-input resize-none" dir="rtl" /></div>
          <div><label className="admin-label">{t("text_en")}</label><textarea value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} rows={3} className="admin-input resize-none" /></div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? t("saving") : t("save")}
          </button>
          <button onClick={onClose} className="admin-btn-outline">{t("cancel")}</button>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const { t } = useAdminT();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: Testimonial }>({ open: false });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_review_confirm"))) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("testimonials_title")}</h1>
        <button onClick={() => setModal({ open: true })} className="admin-btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {t("add_review")}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="admin-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                  <div className="flex gap-0.5 my-1">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= item.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.text_fr}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setModal({ open: true, item })} className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-gray-400 col-span-2 text-center py-12">{t("no_reviews")}</p>}
        </div>
      )}

      {modal.open && <TestimonialModal initial={modal.item} onSave={load} onClose={() => setModal({ open: false })} />}
    </div>
  );
}
