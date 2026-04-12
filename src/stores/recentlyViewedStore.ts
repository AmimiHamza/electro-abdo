import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  price: number;
  image: string;
  viewedAt: number;
}

const MAX_ITEMS = 10;

interface RecentlyViewedStore {
  items: RecentlyViewedItem[];
  addItem: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clearItems: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const filtered = state.items.filter((i) => i.id !== item.id);
          const newItems = [
            { ...item, viewedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_ITEMS);
          return { items: newItems };
        });
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: "techshop-recently-viewed",
    }
  )
);
