import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i === 0 && <Home className="w-3.5 h-3.5 shrink-0" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground font-medium" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
