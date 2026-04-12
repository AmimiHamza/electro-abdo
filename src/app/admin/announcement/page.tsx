"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Loader2, Check, Eye, EyeOff } from "lucide-react";

interface Announcement {
  id: string;
  text_fr: string;
  text_ar: string;
  text_en: string;
  isActive: boolean;
  bgColor: string;
}

export default function AnnouncementPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ text_fr: "", text_ar: "", text_en: "", bgColor: "#1a1a2e", isActive: true });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/announcement");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.text_fr) return;
    setSaving(true);
    await fetch("/api/admin/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ text_fr: "", text_ar: "", text_en: "", bgColor: "#1a1a2e", isActive: true });
    load();
  };

  const toggleActive = async (item: Announcement) => {
    await fetch(`/api/admin/announcement/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, isActive: !item.isActive }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcement/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcement Bar</h1>
        <button onClick={() => setShowForm(!showForm)} className="admin-btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {showForm && (
        <div className="admin-card mb-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Create Announcement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div><label className="admin-label">Text (FR) *</label><input value={form.text_fr} onChange={(e) => setForm({ ...form, text_fr: e.target.value })} className="admin-input" /></div>
            <div><label className="admin-label">Text (AR)</label><input value={form.text_ar} onChange={(e) => setForm({ ...form, text_ar: e.target.value })} className="admin-input" dir="rtl" /></div>
            <div><label className="admin-label">Text (EN)</label><input value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} className="admin-input" /></div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="admin-label">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} className="w-10 h-9 rounded cursor-pointer border-0" />
                <span className="text-sm text-gray-500 font-mono">{form.bgColor}</span>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm mt-4">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-blue-600" />
              Active immediately
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={saving} className="admin-btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? "Saving..." : "Create"}
            </button>
            <button onClick={() => setShowForm(false)} className="admin-btn-outline">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="admin-card">
              {/* Preview */}
              <div className="rounded-lg px-4 py-2 text-white text-sm text-center mb-3" style={{ backgroundColor: item.bgColor }}>
                {item.text_fr || "(no text)"}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.isActive ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(item)} className="admin-btn-outline text-xs px-3 py-1.5 flex items-center gap-1">
                    {item.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-gray-400 py-12">No announcements yet.</p>}
        </div>
      )}
    </div>
  );
}
