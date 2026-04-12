"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Banner {
  id: string;
  image: string;
  title_fr: string | null;
  title_ar: string | null;
  title_en: string | null;
  link: string | null;
  order: number;
  isActive: boolean;
}

export default function HeroBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [form, setForm] = useState({ title_fr: "", title_ar: "", title_en: "", link: "", order: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/hero-banners");
    if (res.ok) setBanners(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (newImages.length === 0) { alert("Please upload at least one image"); return; }
    setSaving(true);
    for (const image of newImages) {
      await fetch("/api/admin/hero-banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, image }),
      });
    }
    setSaving(false);
    setShowForm(false);
    setNewImages([]);
    setForm({ title_fr: "", title_ar: "", title_en: "", link: "", order: 0 });
    load();
  };

  const toggleActive = async (banner: Banner) => {
    await fetch(`/api/admin/hero-banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, isActive: !banner.isActive }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/hero-banners/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hero Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">New Banner</h2>
          <ImageUploader images={newImages} onChange={setNewImages} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="admin-label">Title FR</label><input value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} className="admin-input" /></div>
            <div><label className="admin-label">Title AR</label><input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="admin-input" dir="rtl" /></div>
            <div><label className="admin-label">Link URL</label><input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="admin-input" placeholder="/fr/category/smartphones" /></div>
            <div><label className="admin-label">Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })} className="admin-input" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving} className="admin-btn-primary flex items-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Create"}
            </button>
            <button onClick={() => setShowForm(false)} className="admin-btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className="admin-card p-0 overflow-hidden">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                <Image src={banner.image} alt={banner.title_fr ?? "Banner"} fill className="object-cover" sizes="400px" />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-2 py-1 rounded">HIDDEN</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{banner.title_fr || "(no title)"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => toggleActive(banner)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${banner.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {banner.isActive ? "Active" : "Hidden"}
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 ms-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 col-span-3 text-center py-12">No banners yet.</p>}
        </div>
      )}
    </div>
  );
}
