import { create } from "zustand";

interface QuickViewStore {
  productId: string | null;
  open: (id: string) => void;
  close: () => void;
}

export const useQuickViewStore = create<QuickViewStore>()((set) => ({
  productId: null,
  open: (id) => set({ productId: id }),
  close: () => set({ productId: null }),
}));
