"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Star, ArrowLeft, MessageCircle } from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import ProductCard from "@/components/products/ProductCard";
import ProductSpecifications from "@/components/products/ProductSpecifications";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import {
  formatProductPrice,
  getEffectivePrice,
  calculateDiscount,
  isEnquiryProduct,
} from "@/lib/utils";
import { getProductEnquiryLink, hasSpecifications } from "@/lib/product-specs";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [related, setRelated] = useState([]);
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    const load = async () => {
      const { data: product } = await supabase
        .from("products")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (!product) { setLoading(false); return; }

      const [{ data: variants }, { data: reviews }] = await Promise.all([
        supabase.from("product_variants").select("*").eq("product_id", product.id),
        supabase.from("reviews").select("*, profiles(full_name)").eq("product_id", product.id),
      ]);

      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", product.category_id)
        .eq("is_active", true)
        .neq("id", product.id)
        .limit(4);

      setData({ product, variants: variants || [], reviews: reviews || [] });
      setRelated(rel || []);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-xl font-semibold mb-4">Product not found</h2>
        <Link href="/products"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  const { product, variants, reviews } = data;
  const price = selectedVariant?.price ?? getEffectivePrice(product);
  const discount = calculateDiscount(product.base_price, product.discount_price);
  const enquiryOnly = isEnquiryProduct(product);
  const images = product.images?.length ? product.images : [null];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const enquiryLink = getProductEnquiryLink(product);
  const showSpecsTable = hasSpecifications(product.specifications);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    addToast(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                <ShoppingCart className="h-16 w-16" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-sky-500" : "border-transparent"
                  }`}
                >
                  {img && <Image src={img} alt="" fill className="object-cover" sizes="64px" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.categories && (
            <Badge className="mb-3">{product.categories.name}</Badge>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            {product.name}
          </h1>
          {product.model && (
            <p className="text-sm text-slate-500 mb-3">Model: {product.model}</p>
          )}

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className={`text-3xl font-bold ${enquiryOnly ? "text-slate-700" : "text-sky-600"}`}>
              {formatProductPrice(product)}
            </span>
            {!enquiryOnly && product.discount_price && !selectedVariant && (
              <>
                <span className="text-lg text-slate-400 line-through">{formatProductPrice({ ...product, discount_price: null })}</span>
                <Badge variant="danger">-{discount}%</Badge>
              </>
            )}
          </div>

          {!showSpecsTable && product.description && (
            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 mb-2">Select Variant</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                      selectedVariant?.id === v.id
                        ? "border-sky-500 bg-sky-50 text-sky-700"
                        : "border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    {formatProductPrice({ base_price: v.price, discount_price: null })}
                    {v.attribute_combination && Object.keys(v.attribute_combination).length > 0 && (
                      <span className="text-slate-400 ml-1">
                        ({Object.values(v.attribute_combination).join(", ")})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!enquiryOnly && (
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-medium text-slate-700">Quantity</p>
              <div className="flex items-center border border-slate-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-slate-50 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-slate-50 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={enquiryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white border-0">
                <MessageCircle className="h-5 w-5" />
                Enquire on WhatsApp
              </Button>
            </a>
            {!enquiryOnly && (
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            )}
          </div>

          {product.sku && (
            <p className="text-xs text-slate-400 mt-4">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      {showSpecsTable && (
        <section className="mb-16 max-w-3xl">
          <ProductSpecifications
            specifications={product.specifications}
            description={showSpecsTable ? null : product.description}
            model={null}
          />
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mb-16">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mb-2">{review.comment}</p>
                <p className="text-xs text-slate-400">{review.profiles?.full_name || "Customer"}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
