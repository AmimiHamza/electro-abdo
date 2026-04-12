/**
 * Increment the view count for a product (once per session)
 */
export async function incrementViewCount(productId: string): Promise<void> {
  const sessionKey = `viewed_${productId}`;

  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(sessionKey)) return;

  try {
    await fetch(`/api/products/${productId}/view`, {
      method: "POST",
    });
    sessionStorage.setItem(sessionKey, "1");
  } catch {
    // Silently fail — analytics should never break the UI
  }
}
