// ============================================
// TypeScript Interfaces for the Electronic Shop
// ============================================

export type Locale = "fr" | "ar" | "en";

export interface MultilingualText {
  fr: string;
  ar: string;
  en: string;
}

// ---- DB Models (mirrors Prisma schema) ----

export interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  slug: string;
  image?: string | null;
  order: number;
  createdAt: Date;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  url: string;
  order: number;
  productId: string;
}

export interface Product {
  id: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  price: number;
  oldPrice?: number | null;
  images: ProductImage[];
  category: Category;
  categoryId: string;
  brand?: string | null;
  tags?: string | null;
  specs?: string | null;
  stock: number;
  isVisible: boolean;
  isNewArrival: boolean;
  viewCount: number;
  warranty?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  productIds: string;
  discount?: number | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface HeroBanner {
  id: string;
  image: string;
  title_fr?: string | null;
  title_ar?: string | null;
  title_en?: string | null;
  link?: string | null;
  order: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  text_fr: string;
  text_ar: string;
  text_en: string;
  rating: number;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  question_fr: string;
  question_ar: string;
  question_en: string;
  answer_fr: string;
  answer_ar: string;
  answer_en: string;
  order: number;
}

export interface Announcement {
  id: string;
  text_fr: string;
  text_ar: string;
  text_en: string;
  isActive: boolean;
  bgColor: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details?: string | null;
  createdAt: Date;
}

// ---- UI / Component Types ----

export interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export type SortOption =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "popular"
  | "az";

export interface FilterState {
  sort: SortOption;
  minPrice?: number;
  maxPrice?: number;
  brands: string[];
  tags: string[];
  inStockOnly: boolean;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  image?: string;
}

export interface AdminStats {
  totalProducts: number;
  activeOffers: number;
  totalCategories: number;
  totalViews: number;
}

// ---- API Response Types ----

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
