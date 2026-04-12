"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  slug: string;
  _count?: { products: number };
}

function CategoryModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Category;
  onSave: () => void;
  onClose: () => void;
}) {
  const [name_fr, setNameFr] = useState(initial?.name_fr ?? "");
  const [name_ar, setNameAr] = useState(initial?.name_ar ?? "");
  const [name_en, setNameEn] = useState(initial?.name_en ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name_fr || !name_ar || !name_en || !slug) {
      setError("All fields are required");
      return;
    }
    setSaving(true);
    const body = { name_fr, name_ar, name_en, slug };
    const url = initial ? `/api/admin/categories/${initial.id}` : "/api/admin/categories";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to save");
      return;
    }
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">
            {initial ? "Edit Category" : "New Category"}
          </h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-3">
          {[
            { label: "Name (FR)", value: name_fr, set: setNameFr, dir: "ltr" },
            { label: "Name (AR)", value: name_ar, set: setNameAr, dir: "rtl" },
            { label: "Name (EN)", value: name_en, set: setNameEn, dir: "ltr" },
          ].map(({ label, value, set, dir }) => (
            <div key={label}>
              <label className="admin-label">{label} *</label>
              <input
                value={value}
                onChange={(e) => {
                  set(e.target.value);
                  if (label === "Name (FR)") setSlug(slugify(e.target.value));
                }}
                className="admin-input"
                dir={dir}
              />
            </div>
          ))}
          <div>
            <label className="admin-label">Slug *</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="admin-input font-mono text-xs" />
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleSave} disabled={saving} className="admin-btn-primary flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="admin-btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; category?: Category }>({ open: false });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name_fr}"?`)) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Failed to delete"); return; }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <button onClick={() => setModal({ open: true })} className="admin-btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Category
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
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Name (FR)</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Slug</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Products</th>
                <th className="text-end px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{cat.name_fr}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setModal({ open: true, category: cat })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400">No categories yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal.open && (
        <CategoryModal
          initial={modal.category}
          onSave={load}
          onClose={() => setModal({ open: false })}
        />
      )}
    </div>
  );
}
