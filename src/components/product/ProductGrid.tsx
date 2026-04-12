import { motion } from "framer-motion";
import { ProductCard, ProductCardData } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { PackageSearch } from "lucide-react";

interface ProductGridProps {
  products: ProductCardData[];
  locale: string;
  loading?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function ProductGrid({
  products,
  locale,
  loading = false,
  emptyMessage = "No products found",
  emptySubtitle = "Try adjusting your filters",
}: ProductGridProps) {
  if (loading) return <ProductGridSkeleton count={12} />;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageSearch className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="font-heading font-bold text-lg mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground text-sm max-w-xs">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} locale={locale} />
        </motion.div>
      ))}
    </motion.div>
  );
}
