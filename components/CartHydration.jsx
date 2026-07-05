"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Rehydrate cart from localStorage once on the client — avoids SSR mismatch. */
export function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
