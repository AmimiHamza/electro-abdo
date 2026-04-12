import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  categoryId?: string;
}

interface FavoritesStore {
  items: FavoriteItem[];
  addItem: (item: FavoriteItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: FavoriteItem) => boolean;
  isInFavorites: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      toggleItem: (item) => {
        const isIn = get().isInFavorites(item.id);
        if (isIn) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
        return !isIn;
      },

      isInFavorites: (id) => get().items.some((i) => i.id === id),

      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: "techshop-favorites",
    }
  )
);
