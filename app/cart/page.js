"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";
import { useMounted } from "@/hooks/useMounted";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const mounted = useMounted();
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { addToast } = useToast();
  const subtotal = getSubtotal();

  const handleRemove = (key, name) => {
    removeItem(key);
    addToast(`${name} removed from cart`, "info");
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-8" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="h-20 w-20 text-slate-300 mx-auto mb-6" />
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8">Browse our premium mosquito nets and add items to your cart.</p>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.key} className="flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-8 w-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium text-slate-900 hover:text-sky-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sky-600 font-semibold mt-1">{formatPrice(item.price)}</p>
                {item.variantDetails && (
                  <p className="text-xs text-slate-400 mt-1">
                    {Object.entries(item.variantDetails).map(([k, v]) => `${k}: ${v}`).join(", ")}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-50"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-50"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.key, item.name)}
                    className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-slate-900 shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <h2 className="font-display font-semibold text-lg text-slate-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Estimated Total</span>
                <span className="font-bold text-xl text-sky-600">{formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link href="/checkout" className="block mt-6">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products" className="block text-center text-sm text-sky-600 hover:underline mt-4">
              Continue Shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
