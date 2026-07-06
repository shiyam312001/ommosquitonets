"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { formatProductPrice, isEnquiryProduct } from "@/lib/utils";
import { getProductEnquiryLink } from "@/lib/product-specs";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const enquiryOnly = isEnquiryProduct(product);
  const discount = product.discount_price && product.base_price
    ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
    : 0;
  const image = product.images?.[0];
  const enquiryLink = getProductEnquiryLink(product);

  const handleAddToCart = () => {
    addItem(product);
    addToast(`${product.name} added to cart`);
  };

  return (
    <Card hover padding={false} className="group overflow-hidden h-full flex flex-col">
      <Link href={`/products/${product.slug}`} className="block flex-1">
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
        <div className="p-4 pb-3">
          <h3 className="font-medium text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${enquiryOnly ? "text-slate-700" : "text-sky-600"}`}>
              {formatProductPrice(product)}
            </span>
            {!enquiryOnly && product.discount_price && (
              <span className="text-sm text-slate-400 line-through">
                {formatProductPrice({ ...product, discount_price: null })}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 mt-auto">
        {enquiryOnly ? (
          <a
            href={enquiryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="h-4 w-4" />
            Enquire
          </a>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-2 rounded-xl bg-sky-50 text-sky-600 text-sm font-medium hover:bg-sky-500 hover:text-white transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </Card>
  );
}
