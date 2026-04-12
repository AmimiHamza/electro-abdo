"use client";

import { useEffect, useRef } from "react";
import { useRecentlyViewedStore } from "@/stores/recentlyViewedStore";

interface ViewTrackerProps {
  productId: string;
  productName: string;
  price: number;
  image: string;
}

export function ViewTracker({
  productId,
  productName,
  price,
  image,
}: ViewTrackerProps) {
  const addItem = useRecentlyViewedStore((s) => s.addItem);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // Add to recently viewed (local)
    addItem({ id: productId, name: productName, price, image });

    // Increment viewCount on server (fire-and-forget)
    fetch(`/api/products/${productId}/view`, { method: "POST" }).catch(
      () => {}
    );
  }, [productId, productName, price, image, addItem]);

  return null;
}
