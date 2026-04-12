# 🛒 Electronic Shop Website — Claude Code Implementation Plan

## Project Overview

A premium, trilingual (FR/AR/EN) e-commerce storefront for an electronics shop (phones, chargers, accessories), inspired by ultrapc.ma. No online payment — orders are placed via WhatsApp. Includes a full admin dashboard for product/offer management. Designed to be **white-label** — one config file swap to deploy for a different client.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14 (App Router)** | SSR, file-based routing, SEO, performance |
| Language | **TypeScript** | Type safety across the entire codebase |
| Styling | **Tailwind CSS** + CSS variables | Dark/light mode, RTL support, rapid UI |
| UI Components | **shadcn/ui** + custom components | Polished, accessible, customizable |
| Database | **SQLite via Prisma ORM** | Zero config, portable, single-file DB — perfect for small shops |
| Auth (admin only) | **NextAuth.js** (credentials provider) | Simple password-protected admin login |
| State Management | **Zustand** | Lightweight, persistent cart/favorites/language stores |
| Animations | **Framer Motion** | Page transitions, toast notifications, micro-interactions |
| Image Handling | **Next.js Image** + **sharp** | Auto WebP conversion, lazy loading, optimization |
| i18n | **next-intl** | Trilingual with RTL support for Arabic |
| Icons | **Lucide React** | Clean, consistent icon set |
| Forms (admin) | **React Hook Form + Zod** | Validation for product/offer forms |
| File Upload | **uploadthing** or local `/public/uploads` | Product image uploads in admin |

---

## Project Structure

```
electronic-shop/
├── prisma/
│   ├── schema.prisma          # DB schema
│   ├── seed.ts                # Demo data seeder
│   └── db.sqlite              # SQLite database file
├── public/
│   └── uploads/               # Product images
├── src/
│   ├── app/
│   │   ├── [locale]/          # Locale-wrapped routes (fr/ar/en)
│   │   │   ├── page.tsx                  # Homepage
│   │   │   ├── category/[slug]/page.tsx  # Category listing
│   │   │   ├── product/[id]/page.tsx     # Product detail
│   │   │   ├── cart/page.tsx             # Cart page
│   │   │   ├── favorites/page.tsx        # Favorites page
│   │   │   ├── offers/page.tsx           # All offers
│   │   │   ├── search/page.tsx           # Search results
│   │   │   ├── faq/page.tsx              # FAQ page
│   │   │   ├── about/page.tsx            # Store info / about
│   │   │   └── layout.tsx                # Locale layout with nav/footer
│   │   ├── admin/
│   │   │   ├── login/page.tsx            # Admin login
│   │   │   ├── dashboard/page.tsx        # Dashboard overview
│   │   │   ├── products/
│   │   │   │   ├── page.tsx              # Product list + bulk actions
│   │   │   │   ├── new/page.tsx          # Add product form
│   │   │   │   └── [id]/edit/page.tsx    # Edit product
│   │   │   ├── categories/page.tsx       # Manage categories
│   │   │   ├── offers/page.tsx           # Manage offers
│   │   │   ├── hero-banners/page.tsx     # Manage homepage carousel
│   │   │   ├── testimonials/page.tsx     # Manage reviews
│   │   │   ├── faq/page.tsx              # Manage FAQ entries
│   │   │   ├── announcement/page.tsx     # Edit announcement bar
│   │   │   └── activity-log/page.tsx     # View admin actions
│   │   ├── api/
│   │   │   ├── products/route.ts
│   │   │   ├── categories/route.ts
│   │   │   ├── offers/route.ts
│   │   │   ├── upload/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   ├── admin/[...nextauth]/route.ts
│   │   │   └── seed/route.ts
│   │   ├── layout.tsx            # Root layout
│   │   └── not-found.tsx         # Custom 404 page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                # Nav with language switcher, theme toggle, cart badge
│   │   │   ├── MobileBottomNav.tsx       # Bottom nav bar (mobile)
│   │   │   ├── Footer.tsx                # Footer with social links
│   │   │   ├── AnnouncementBar.tsx       # Top banner
│   │   │   ├── FloatingWhatsApp.tsx      # Persistent WhatsApp button
│   │   │   └── ScrollToTop.tsx           # Scroll-to-top button
│   │   ├── home/
│   │   │   ├── HeroCarousel.tsx          # Animated hero banner
│   │   │   ├── CategoriesGrid.tsx        # Category cards with price range
│   │   │   ├── OffersSection.tsx         # Offers with countdown timers
│   │   │   ├── NewArrivals.tsx           # New arrivals section
│   │   │   ├── TrendingNow.tsx           # Most viewed products
│   │   │   ├── TrustedBrands.tsx         # Auto-scrolling brand logos
│   │   │   ├── WhyChooseUs.tsx           # USP icon cards
│   │   │   └── Testimonials.tsx          # Customer reviews
│   │   ├── product/
│   │   │   ├── ProductCard.tsx           # Card with badges, quick-view, favorite
│   │   │   ├── ProductGrid.tsx           # Responsive grid (4/2/1 columns)
│   │   │   ├── ProductDetail.tsx         # Full product page
│   │   │   ├── ProductGallery.tsx        # Image gallery with zoom + swipe
│   │   │   ├── SpecsTable.tsx            # Structured specs table
│   │   │   ├── RelatedProducts.tsx       # "You may also like"
│   │   │   ├── QuickViewModal.tsx        # Quick preview modal
│   │   │   ├── StickyAddToCart.tsx       # Mobile sticky bottom bar
│   │   │   ├── ShareButton.tsx           # Share via WhatsApp / copy link
│   │   │   └── ProductBadges.tsx         # Warranty, offer, new, out-of-stock badges
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx            # Slide-out cart preview
│   │   │   ├── CartItem.tsx              # Item with +/- quantity
│   │   │   └── WhatsAppOrder.tsx         # Generate & redirect to WhatsApp
│   │   ├── filters/
│   │   │   ├── SortDropdown.tsx          # Sort by price, name, date
│   │   │   ├── FilterSidebar.tsx         # Category-specific filters
│   │   │   ├── BrandFilter.tsx           # Alphabetical brand filter
│   │   │   └── TagFilter.tsx             # Clickable tag chips
│   │   ├── ui/
│   │   │   ├── Skeleton.tsx              # Skeleton loading components
│   │   │   ├── Toast.tsx                 # Toast notification system
│   │   │   ├── Breadcrumbs.tsx           # Breadcrumb navigation
│   │   │   ├── LanguageSelector.tsx      # First-visit modal + nav switcher
│   │   │   ├── ThemeToggle.tsx           # Dark/light mode switch
│   │   │   ├── CountdownTimer.tsx        # Live countdown for offers
│   │   │   ├── Pagination.tsx            # Page numbers + infinite scroll toggle
│   │   │   └── SearchBar.tsx             # Instant search with results dropdown
│   │   └── admin/
│   │       ├── AdminSidebar.tsx          # Admin navigation
│   │       ├── StatsCards.tsx            # Dashboard overview cards
│   │       ├── ProductForm.tsx           # Add/edit product form
│   │       ├── ImageUploader.tsx         # Drag & drop multi-image upload
│   │       ├── BulkActions.tsx           # Bulk select & actions
│   │       ├── ActivityLog.tsx           # Recent admin actions
│   │       └── DataTable.tsx             # Reusable admin data table
│   ├── stores/
│   │   ├── cartStore.ts          # Cart state (Zustand + localStorage)
│   │   ├── favoritesStore.ts     # Favorites state
│   │   ├── recentlyViewedStore.ts # Recently viewed products
│   │   └── settingsStore.ts      # Language, theme preferences
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── utils.ts              # Helpers (format price, slugify, etc.)
│   │   ├── whatsapp.ts           # WhatsApp message generator
│   │   └── analytics.ts          # View counter logic
│   ├── config/
│   │   └── store.config.ts       # ⭐ THE CONFIG FILE — store name, WhatsApp, social links, currency
│   ├── i18n/
│   │   ├── fr.json               # French translations
│   │   ├── ar.json               # Arabic translations
│   │   └── en.json               # English translations
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── .env                          # Environment variables
├── tailwind.config.ts            # Tailwind config with RTL + dark mode
├── next.config.ts                # Next.js config
├── package.json
└── README.md                     # Setup & deployment guide
```

---

## Database Schema (Prisma)

```prisma
model Category {
  id          String    @id @default(cuid())
  name_fr     String
  name_ar     String
  name_en     String
  slug        String    @unique
  image       String?
  order       Int       @default(0)
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id              String    @id @default(cuid())
  name_fr         String
  name_ar         String
  name_en         String
  description_fr  String
  description_ar  String
  description_en  String
  price           Float
  oldPrice        Float?              // Strikethrough price
  images          ProductImage[]
  category        Category  @relation(fields: [categoryId], references: [id])
  categoryId      String
  brand           String?
  tags            String?             // Comma-separated tags
  specs           String?             // JSON string for structured specs
  stock           Int       @default(0)
  isVisible       Boolean   @default(true)
  isNewArrival    Boolean   @default(false)
  viewCount       Int       @default(0)
  warranty        String?             // e.g. "1 Year Warranty"
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ProductImage {
  id        String  @id @default(cuid())
  url       String
  order     Int     @default(0)
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  productId String
}

model Offer {
  id          String    @id @default(cuid())
  title_fr    String
  title_ar    String
  title_en    String
  productIds  String    // Comma-separated product IDs
  discount    Float?    // Percentage or fixed
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
}

model HeroBanner {
  id        String  @id @default(cuid())
  image     String
  title_fr  String?
  title_ar  String?
  title_en  String?
  link      String?
  order     Int     @default(0)
  isActive  Boolean @default(true)
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  text_fr   String
  text_ar   String
  text_en   String
  rating    Int      @default(5)
  createdAt DateTime @default(now())
}

model FAQ {
  id          String @id @default(cuid())
  question_fr String
  question_ar String
  question_en String
  answer_fr   String
  answer_ar   String
  answer_en   String
  order       Int    @default(0)
}

model Announcement {
  id        String  @id @default(cuid())
  text_fr   String
  text_ar   String
  text_en   String
  isActive  Boolean @default(true)
  bgColor   String  @default("#000000")
}

model AdminUser {
  id        String @id @default(cuid())
  username  String @unique
  password  String // hashed
}

model ActivityLog {
  id        String   @id @default(cuid())
  action    String   // "Created product", "Updated offer", etc.
  details   String?  // Product name, etc.
  createdAt DateTime @default(now())
}
```

---

## Store Config File (`src/config/store.config.ts`)

```typescript
export const storeConfig = {
  // ======= CHANGE THESE PER CLIENT =======
  storeName: "TechShop",
  storeTagline: {
    fr: "Votre boutique d'électronique #1",
    ar: "متجرك الإلكتروني رقم 1",
    en: "Your #1 Electronics Store",
  },
  whatsappNumber: "212600000000",      // With country code, no +
  email: "contact@techshop.ma",
  phone: "+212 600 000 000",
  address: {
    fr: "123 Rue Example, Casablanca",
    ar: "123 شارع المثال، الدار البيضاء",
    en: "123 Example Street, Casablanca",
  },
  currency: "DH",
  socialLinks: {
    instagram: "https://instagram.com/techshop",
    facebook: "https://facebook.com/techshop",
    tiktok: "https://tiktok.com/@techshop",
  },
  googleMapsEmbed: "https://maps.google.com/...",
  defaultLanguage: "fr" as "fr" | "ar" | "en",
  // ========================================
};
```

---

## Implementation Phases — Claude Code Prompts

### PHASE 0: Project Bootstrap

```
Initialize a Next.js 14 project with TypeScript, Tailwind CSS, App Router.
Install these dependencies: prisma, @prisma/client, next-intl, zustand,
framer-motion, next-auth, react-hook-form, zod, @hookform/resolvers,
lucide-react, sharp, next-themes.

Set up:
- tailwind.config.ts with dark mode (class strategy), RTL support via dir attribute
- CSS variables for the design system in globals.css — use a bold, premium
  electronics aesthetic: deep navy/charcoal base, electric blue accent,
  warm white surfaces for light mode. NOT generic purple gradients.
- Typography: use "Outfit" for headings (modern, geometric, techy) and
  "DM Sans" for body text. Import via Google Fonts in layout.tsx.
- Create the prisma/schema.prisma file with the full schema from the plan.
- Create src/config/store.config.ts with placeholder values.
- Create the i18n setup with next-intl: fr.json, ar.json, en.json with
  initial common keys (nav items, buttons, footer text).
- Create the Zustand stores: cartStore, favoritesStore, recentlyViewedStore,
  settingsStore — all with localStorage persistence.
- Set up next-auth with a simple credentials provider reading from the
  AdminUser table.
- Run prisma generate and prisma db push.
```

### PHASE 1: Layout Shell & Navigation

```
Build the global layout and navigation system:

1. Root layout.tsx: apply locale dir (rtl for Arabic), theme class, font loading
2. AnnouncementBar: thin top banner, fetches from DB, dismissible, animated
3. Navbar:
   - Store logo/name (from config)
   - Search bar with instant results dropdown (debounced, searches products)
   - Language switcher (FR/AR/EN) — saves to Zustand store + localStorage
   - Theme toggle (sun/moon icon) with smooth transition
   - Favorites icon with count badge
   - Cart icon with item count + total price badge (like ultrapc)
   - On mobile: hamburger menu with slide-out drawer
4. MobileBottomNav: fixed bottom bar with Home, Categories, Cart, Favorites, Menu
5. Footer: store info from config, social links, quick links, copyright
6. FloatingWhatsApp: green WhatsApp icon bottom-right, pulse animation
7. ScrollToTop: appears after scrolling 300px, smooth scroll up

Language first-visit flow: if no language stored, show a centered modal
with 3 language cards (flags + names). After selection, store in
localStorage and never show again.

Make everything fully responsive. Arabic layout must be RTL.
Use Framer Motion for all animations: nav dropdowns, mobile drawer,
announcement bar dismiss.
```

### PHASE 2: Homepage

```
Build the homepage with these sections in order:

1. HeroCarousel: full-width animated banner, fetched from HeroBanner table.
   Auto-play with dots navigation. Framer Motion slide transitions.
   If no banners in DB, show a default gradient with store name.

2. CategoriesGrid: cards showing each category with image, name, and
   "Starting from X DH" price range. Clicking goes to /category/[slug].
   Responsive grid: 4 cols desktop, 3 tablet, 2 mobile.

3. OffersSection: ONLY renders if active offers exist. Shows offer cards
   with countdown timer (days/hours/min/sec), product images, old price
   struck through, new price highlighted. "See all offers" link.

4. NewArrivals: horizontal scrollable product cards, filtered by
   isNewArrival=true. Each card has: image, name, price, old price,
   add to cart, favorite toggle, quick-view eye icon.

5. TrendingNow: same as above but sorted by viewCount descending.

6. TrustedBrands: auto-scrolling horizontal carousel of brand logos.
   Grayscale by default, color on hover. Infinite loop animation.

7. WhyChooseUs: 4 icon cards in a row — configurable icons and text.
   e.g. Truck (Fast Delivery), Shield (Genuine Products), Headphones
   (24/7 Support), CreditCard (Best Prices).

8. Testimonials: customer review cards with star ratings, name, text.
   Carousel on mobile, grid on desktop.

All sections use skeleton loading while data fetches.
All text must use the translation system (next-intl).
```

### PHASE 3: Product Listing & Filters

```
Build the category page at /category/[slug]:

1. Breadcrumbs: Home > Category Name
2. Category header with name and product count
3. Filter sidebar (desktop: left sidebar, mobile: slide-out drawer):
   - Sort dropdown: Price low-high, high-low, newest, most popular, A-Z
   - Price range slider
   - Brand filter with alphabetical bar (A-Z clickable)
   - Tag chips (clickable, multi-select)
   - Stock toggle: "In stock only"
   - Clear all filters button
4. ProductGrid: responsive grid of ProductCards
   - Each card: image (lazy loaded), name, price, old price strikethrough,
     badges (New, Offer %, Out of Stock, Warranty), favorite heart icon,
     quick-view eye icon, add to cart button
   - Hover effect: subtle scale + shadow
5. Pagination: toggle between page numbers and infinite scroll
   - "Showing X-Y of Z products" text
6. Empty state: friendly illustration + "No products found" message

QuickViewModal: clicking the eye icon opens a modal with:
- Product image, name, price, short description, specs preview
- Add to cart button, quantity selector, favorite toggle
- "View full details" link

All filters work via URL search params (shareable filtered URLs).
Skeleton loading for the grid while filtering/loading.
```

### PHASE 4: Product Detail Page

```
Build the product detail page at /product/[id]:

1. Breadcrumbs: Home > Category > Product Name
2. Two-column layout (mobile: stacked):
   LEFT: ProductGallery
   - Main image with zoom-on-hover (desktop): CSS transform scale on mousemove
   - Thumbnail strip below, click to swap main image
   - Swipe gestures on mobile (touch events)
   - Lightbox fullscreen view on click

   RIGHT: Product Info
   - Product name (translated)
   - Price + old price strikethrough if applicable
   - Badges: warranty, stock status, offer percentage
   - Color variant dots (if applicable)
   - Quantity selector (+/- buttons)
   - "Add to Cart" button (primary, large)
   - "Add to Favorites" button
   - ShareButton: "Share via WhatsApp" + "Copy link" dropdown
   - "Copy product link" button

3. StickyAddToCart (mobile only): fixed bottom bar with price + Add to Cart,
   appears when the main Add to Cart button scrolls out of view.

4. Tabs or accordion below:
   - Description (translated, rich text)
   - Specifications table (structured grid from JSON specs)
   - Delivery info (from static config)

5. RelatedProducts: horizontal scroll of products from same category,
   excluding current product.

6. RecentlyViewed: horizontal scroll of last 10 viewed products
   (from Zustand store).

Increment viewCount via API when page loads (debounced, once per session).
Print-friendly: @media print styles that show clean product info.
```

### PHASE 5: Cart & WhatsApp Ordering

```
Build the cart system:

1. CartDrawer: slide-out panel from the right when clicking cart icon.
   - List of cart items with: image, name, price, quantity +/- buttons,
     remove button, subtotal per item
   - Cart summary: total items, total price
   - "Continue Shopping" button
   - "Order via WhatsApp" button (green, prominent)
   - Empty cart state with illustration

2. Cart page (/cart): full-page version of the cart with more space.
   Same features as drawer but in a table/list layout.

3. WhatsAppOrder logic (src/lib/whatsapp.ts):
   Generate a pre-formatted WhatsApp message like:
   ```
   🛒 New Order from [Store Name]
   ─────────────────
   1x Samsung Galaxy S24 — 8,999 DH
   2x USB-C Fast Charger — 198 DH
   1x Phone Case — 79 DH
   ─────────────────
   💰 Total: 9,276 DH
   📱 [Customer can add name/address here]
   ```
   URL-encode and redirect to:
   https://wa.me/{whatsappNumber}?text={encodedMessage}

4. Toast notifications:
   - "Added to cart!" with product thumbnail
   - "Removed from cart"
   - "Added to favorites" / "Removed from favorites"
   - Stack from top-right, auto-dismiss after 3s, swipe to dismiss

Cart persists in localStorage via Zustand.
Cart badge on navbar updates in real-time.
```

### PHASE 6: Search, Favorites & Other Pages

```
Build supporting pages:

1. Search (/search?q=...):
   - Search results page showing matching products in a grid
   - "X results for 'query'" header
   - Same ProductCard and filter options as category page
   - No results state with suggestions

2. Instant Search (in Navbar):
   - Debounced input (300ms)
   - Dropdown below search bar showing top 5 results with thumbnails
   - "See all results" link at bottom
   - Keyboard navigation (arrow keys + enter)
   - Close on click outside or Escape

3. Favorites (/favorites):
   - Grid of favorited products (from Zustand store)
   - Same ProductCard component
   - "Your favorites list is empty" state
   - "Order all favorites via WhatsApp" option

4. Offers page (/offers):
   - All active offers with countdown timers
   - Products within each offer displayed as a grid
   - Expired offers auto-hidden

5. FAQ page (/faq):
   - Accordion-style Q&A from database
   - Animated expand/collapse with Framer Motion

6. About page (/about):
   - Store info from config
   - Google Maps embed
   - Working hours, contact info
   - Delivery zones info

7. Custom 404 page:
   - Branded illustration
   - "Page not found" in current language
   - "Back to Home" button
```

### PHASE 7: Admin Dashboard

```
Build the admin panel at /admin (protected by NextAuth):

1. Admin Login (/admin/login):
   - Clean login form: username + password
   - Error handling, loading state
   - Redirect to dashboard on success

2. Dashboard (/admin/dashboard):
   - Stats cards: Total Products, Active Offers, Categories, Total Views
   - Recent activity log (last 20 actions)
   - Quick action buttons: Add Product, Create Offer, View Store

3. Products Management (/admin/products):
   - DataTable with columns: Image, Name, Category, Price, Stock, Status, Actions
   - Bulk actions: select multiple → delete, toggle visibility, mark as offer
   - Search/filter within the table
   - Actions per row: Edit, Duplicate, Toggle Visibility, Delete
   - "Add Product" button → /admin/products/new

4. Product Form (/admin/products/new and /admin/products/[id]/edit):
   - Tabbed form: Basic Info | Media | Specs | Settings
   - Basic: name (FR/AR/EN), description (FR/AR/EN), category dropdown,
     brand, price, old price, tags (comma-separated input)
   - Media: multi-image drag-and-drop upload, reorder images, delete images
   - Specs: dynamic key-value pair inputs (add/remove rows)
   - Settings: stock count, warranty text, isNewArrival toggle, isVisible toggle
   - Duplicate button (on edit): clones all data into a new product form
   - Validation with Zod, error messages on fields
   - Activity log entry on save

5. Categories (/admin/categories):
   - List with drag-and-drop reorder
   - Add/edit modal: name (FR/AR/EN), slug (auto-generated), image upload
   - Delete with confirmation (warn if category has products)

6. Offers (/admin/offers):
   - List of offers with status (active/scheduled/expired)
   - Create/edit form: title (FR/AR/EN), select products (multi-select),
     discount, start date, end date
   - Scheduled offers auto-activate/deactivate

7. Other admin pages:
   - Hero Banners: upload images, set order, toggle active
   - Testimonials: add/edit/delete reviews
   - FAQ: add/edit/delete/reorder Q&A pairs
   - Announcement Bar: edit text (FR/AR/EN), set color, toggle on/off
   - Activity Log: paginated list of all admin actions with timestamps

Admin sidebar navigation with icons, collapsible on mobile.
All admin forms show toast on success/error.
All destructive actions require confirmation modal.
```

### PHASE 8: Demo Data & Seed Script

```
Create prisma/seed.ts with realistic demo data:

Categories (6):
- Smartphones (phones, 8 products)
- Chargers & Cables (6 products)
- Phone Cases & Protection (6 products)
- Headphones & Audio (6 products)
- Tablets (4 products)
- Smart Watches (4 products)

Each product should have:
- Realistic names in all 3 languages (e.g., "Samsung Galaxy S24 Ultra")
- Real-looking prices in DH (Moroccan Dirham)
- Some with oldPrice (showing discount)
- Specs as JSON (RAM, storage, battery, screen size, etc.)
- Varied stock levels (some 0 for out-of-stock demo)
- Some marked as isNewArrival
- Brand names (Samsung, Apple, Xiaomi, Anker, JBL, etc.)
- Tags (5G, Fast Charge, Wireless, USB-C, etc.)
- Warranty text on some

Also seed:
- 3 hero banners (use placeholder gradient images)
- 2 active offers with future end dates
- 5 testimonials
- 6 FAQ entries (about delivery, payment, returns, warranty)
- 1 announcement ("Free delivery on orders above 500 DH!")
- 1 admin user (username: admin, password: admin123 — hashed)
- 5 activity log entries

Add "npm run seed" script to package.json.
Add "npm run reset" script that drops DB and re-seeds.

Use placeholder images: generate colored gradient boxes with product
initials or use https://placehold.co for demo images.
```

### PHASE 9: Polish & Performance

```
Final polish pass:

1. Skeleton loading: create skeleton variants for:
   - ProductCard (image placeholder + text lines)
   - ProductGrid (grid of skeleton cards)
   - ProductDetail (two-column skeleton)
   - Homepage sections (carousel skeleton, section skeletons)

2. Animations (Framer Motion):
   - Page transitions: fade + slight slide
   - Product cards: staggered entrance on scroll (InView trigger)
   - Cart drawer: slide from right
   - Modal: fade + scale
   - Toast: slide in from top-right
   - Announcement bar: slide down on load
   - Hover states: card lift, button press effect

3. Image optimization:
   - All images via Next.js <Image> component
   - Lazy loading with blur placeholder
   - WebP auto-conversion via sharp
   - Responsive sizes attribute

4. Responsive audit:
   - Test all pages at 320px, 375px, 768px, 1024px, 1440px
   - RTL layout check for all Arabic pages
   - Mobile bottom nav doesn't overlap content
   - Touch targets minimum 44px

5. Accessibility:
   - All images have alt text (translated)
   - Keyboard navigation for modals, dropdowns, search
   - Focus rings on interactive elements
   - Screen reader labels for icon buttons
   - Color contrast ratio ≥ 4.5:1

6. Print styles:
   - Product detail page: clean layout, no nav/footer, prices visible
   - @media print CSS

7. SEO:
   - Dynamic page titles and meta descriptions (translated)
   - Open Graph tags for product sharing
   - Structured data (JSON-LD) for products
   - Sitemap generation

8. README.md:
   - Setup instructions (clone, install, seed, run)
   - How to change client config
   - How to deploy (Vercel recommended)
   - Admin login credentials
   - How to reset demo data
```

---

## Design Direction

**Aesthetic:** Premium Tech Retail — clean, modern, with a confident edge. Think Apple Store meets Moroccan tech market.

**Light Mode:** White/warm gray surfaces, deep charcoal text, electric blue accents (#2563EB), subtle gradient highlights on CTAs, soft shadows.

**Dark Mode:** Rich charcoal (#1a1a2e) background, slate gray surfaces (#16213e), electric blue stays as accent, white text, glowing hover effects.

**Typography:**
- Headings: "Outfit" (geometric, modern, techy feel)
- Body: "DM Sans" (clean, readable, pairs well)
- Arabic: "IBM Plex Sans Arabic" (professional, great RTL readability)

**Key Visual Elements:**
- Product cards with subtle glass-morphism effect on hover
- Gradient accent strips on section dividers
- Micro-interactions on every button and card
- Smooth page transitions
- Skeleton loading that matches the actual layout
- Premium badge system with color-coded pills

---

## Execution Order for Claude Code

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
    → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9
```

Each phase is a single Claude Code session. Copy the phase prompt directly into Claude Code. After each phase, test locally before moving to the next.

**Total estimated components:** ~60+
**Total estimated pages:** ~20+
**Total estimated API routes:** ~10+

---

## Quick Start After Build

```bash
git clone <repo>
cd electronic-shop
npm install
npx prisma db push
npm run seed
npm run dev
# Visit http://localhost:3000
# Admin: http://localhost:3000/admin (admin / admin123)
```

To switch clients: edit `src/config/store.config.ts` and `npm run reset`.
