"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";

interface Offer {
  id: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  discount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

function OfferModal({ initial, onSave, onClose }: {
  initial?: Offer;
  onSave: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title_fr: initial?.title_fr ?? "",
    title_ar: initial?.title_ar ?? "",
    title_en: initial?.title_en ?? "",
    productIds: "",
    discount: initial?.discount?.toString() ?? "",
    startDate: initial?.startDate ? initial.startDate.split("T")[0] : new Date().toISOString().split("T")[0],
    endDate: initial?.endDate ? initial.endDate.split("T")[0] : "",
    isActive: initial?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.title_fr || !form.endDate) { setError("Title FR and End Date are required"); return; }
    setSaving(true);
    const body = { ...form, discount: form.discount ? parseFloat(form.discount) : null };
    const url = initial ? `/api/admin/offers/${initial.id}` : "/api/admin/offers";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    if (!res.ok) { setError("Failed to save"); return; }
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{initial ? "Edit Offer" : "New Offer"}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X className="w-4 h-4" /></button>
        </div>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-3">
          {[
            { label: "Title (FR) *", key: "title_fr", dir: "ltr" },
            { label: "Title (AR) *", key: "title_ar", dir: "rtl" },
            { label: "Title (EN)", key: "title_en", dir: "ltr" },
          ].map(({ label, key, dir }) => (
            <div key={key}>
              <label className="admin-label">{label}</label>
              <input value={key === "title_fr" ? form.title_fr : key === "title_ar" ? form.title_ar : form.title_en} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="admin-input" dir={dir} />
            </div>
          ))}
          <div>
            <label className="admin-label">Product IDs (comma-separated)</label>
            <input value={form.productIds} onChange={(e) => setForm({ ...form, productIds: e.target.value })} className="admin-input font-mono text-xs" placeholder="cldxxx,cldyyy" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="admin-label">Discount %</label>
              <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="admin-input" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-blue-600" />
            Active
          </label>
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

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; offer?: Offer }>({ open: false });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/offers");
    if (res.ok) setOffers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offers</h1>
        <button onClick={() => setModal({ open: true })} className="admin-btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Title</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Discount</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">End Date</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-end px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {offers.map((offer) => {
                const isExpired = new Date(offer.endDate) < new Date();
                return (
                  <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{offer.title_fr}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{offer.discount ? `${offer.discount}%` : "—"}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{new Date(offer.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isExpired ? "bg-gray-100 text-gray-500" : offer.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {isExpired ? "Expired" : offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => setModal({ open: true, offer })} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(offer.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {offers.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No offers yet</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal.open && (
        <OfferModal initial={modal.offer} onSave={load} onClose={() => setModal({ open: false })} />
      )}
    </div>
  );
}
