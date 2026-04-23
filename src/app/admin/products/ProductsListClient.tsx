"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { DeleteProductButton } from "./DeleteProductButton";
import { useAdminT } from "@/hooks/useAdminT";

interface ProductRow {
  id: string;
  name_fr: string;
  brand: string | null;
  price: number;
  stock: number;
  isVisible: boolean;
  category: { name_fr: string };
  images: { url: string }[];
}

interface ProductsListClientProps {
  products: ProductRow[];
  total: number;
  totalPages: number;
  page: number;
  search: string;
}

export function ProductsListClient({
  products,
  total,
  totalPages,
  page,
  search,
}: ProductsListClientProps) {
  const { t } = useAdminT();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t("products_title")}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {total} {t("total")}
          </p>
        </div>
        <Link href="/admin/products/new" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          {t("add_product")}
        </Link>
      </div>

      {/* Search */}
      <form className="mb-4">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder={t("search_products")}
          className="admin-input max-w-xs"
        />
      </form>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 w-12">{t("image")}</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("name")}</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("category")}</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("price")}</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("stock")}</th>
                <th className="text-start px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("status")}</th>
                <th className="text-end px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {t("no_products_found")}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name_fr}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                            {product.name_fr.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[200px]">
                        {product.name_fr}
                      </p>
                      {product.brand && (
                        <p className="text-xs text-gray-400">{product.brand}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {product.category.name_fr}
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">
                      {product.price.toLocaleString()} DH
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        product.stock === 0
                          ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : product.stock < 5
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      }`}>
                        {product.stock === 0 ? t("out") : `${product.stock} ${t("left")}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.isVisible ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Eye className="w-3 h-3" /> {t("visible")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <EyeOff className="w-3 h-3" /> {t("hidden")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name_fr} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t("page")} {page} {t("of")} {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`?page=${page - 1}${search ? `&search=${search}` : ""}`}
                  className="admin-btn-outline text-xs px-3 py-1.5"
                >
                  {t("prev")}
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`?page=${page + 1}${search ? `&search=${search}` : ""}`}
                  className="admin-btn-outline text-xs px-3 py-1.5"
                >
                  {t("next")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
