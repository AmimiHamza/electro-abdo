"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminT } from "@/hooks/useAdminT";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const { t } = useAdminT();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`${t("delete_product_confirm")}\n\n${name}`)) return;
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
    </button>
  );
}
