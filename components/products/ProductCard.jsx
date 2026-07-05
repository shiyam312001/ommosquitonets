"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui";
import { formatPrice, getEffectivePrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const price = getEffectivePrice(product);
  const discount = calculateDiscount(product.base_price, product.discount_price);
  const image = product.images?.[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    addToast(`${product.name} added to cart`);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card hover padding={false} className="group overflow-hidden h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-300">
              <ShoppingCart className="h-12 w-12" />
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 transition-colors duration-300" />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-sky-600">{formatPrice(price)}</span>
            {product.discount_price && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(product.base_price)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-auto w-full py-2 rounded-xl bg-sky-50 text-sky-600 text-sm font-medium hover:bg-sky-500 hover:text-white transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </Card>
    </Link>
  );
}
