"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant = null) => {
        const items = get().items;
        const key = variant ? `${product.id}-${variant.id}` : product.id;
        const existing = items.find((i) => i.key === key);

        if (existing) {
          set({
            items: items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                key,
                productId: product.id,
                variantId: variant?.id || null,
                name: product.name,
                slug: product.slug,
                image: product.images?.[0] || null,
                price: variant?.price ?? (product.discount_price ?? product.base_price),
                quantity,
                variantDetails: variant?.attribute_combination || null,
              },
            ],
          });
        }
      },

      removeItem: (key) => {
        set({ items: get().items.filter((i) => i.key !== key) });
      },

      updateQuantity: (key, quantity) => {
        if (quantity < 1) {
          get().removeItem(key);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "om-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
