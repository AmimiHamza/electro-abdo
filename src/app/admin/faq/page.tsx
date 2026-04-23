"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import { useAdminT } from "@/hooks/useAdminT";

interface FAQ {
  id: string;
  question_fr: string;
  question_ar: string;
  question_en: string;
  answer_fr: string;
  answer_ar: string;
  answer_en: string;
  order: number;
}

function FAQModal({ initial, onSave, onClose }: { initial?: FAQ; onSave: () => void; onClose: () => void }) {
  const { t } = useAdminT();
  const [form, setForm] = useState({
    question_fr: initial?.question_fr ?? "",
    question_ar: initial?.question_ar ?? "",
    question_en: initial?.question_en ?? "",
    answer_fr: initial?.answer_fr ?? "",
    answer_ar: initial?.answer_ar ?? "",
    answer_en: initial?.answer_en ?? "",
    order: initial?.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.question_fr || !form.answer_fr) { setError(t("question_answer_required")); return; }
    setSaving(true);
    const url = initial ? `/api/admin/faq/${initial.id}` : "/api/admin/faq";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) { setError(t("failed_to_save")); return; }
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{initial ? t("edit_faq") : t("new_faq")}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-4 h-4" /></button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["fr", "ar", "en"] as const).map((lang) => (
            <div key={lang} className="space-y-2">
              <div>
                <label className="admin-label">{t("question")} ({lang.toUpperCase()}) {lang === "fr" ? "*" : ""}</label>
                <textarea value={(form as Record<string, string | number>)[`question_${lang}`] as string} onChange={(e) => setForm({ ...form, [`question_${lang}`]: e.target.value })} rows={2} className="admin-input resize-none" dir={lang === "ar" ? "rtl" : "ltr"} />
              </div>
              <div>
                <label className="admin-label">{t("answer")} ({lang.toUpperCase()}) {lang === "fr" ? "*" : ""}</label>
                <textarea value={(form as Record<string, string | number>)[`answer_${lang}`] as string} onChange={(e) => setForm({ ...form, [`answer_${lang}`]: e.target.value })} rows={4} className="admin-input resize-none" dir={lang === "ar" ? "rtl" : "ltr"} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 w-24">
          <label className="admin-label">{t("order")}</label>
          <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="admin-input" />
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

export default function FAQPage() {
  const { t } = useAdminT();
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; item?: FAQ }>({ open: false });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/faq");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_faq_confirm"))) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("faq_title")}</h1>
        <button onClick={() => setModal({ open: true })} className="admin-btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> {t("add_faq")}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="admin-card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 w-8">#</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("question")} (FR)</th>
                <th className="text-end px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.question_fr}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{item.answer_fr}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal({ open: true, item })} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={3} className="text-center py-12 text-gray-400">{t("no_faqs")}</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && <FAQModal initial={modal.item} onSave={load} onClose={() => setModal({ open: false })} />}
    </div>
  );
}
