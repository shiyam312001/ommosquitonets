"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { useCartStore } from "@/store/cart";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import { useMounted } from "@/hooks/useMounted";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const mounted = useMounted();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, profile } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shippingAddress: "",
    phone: "",
    paymentMethod: "cod",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        shippingAddress: profile.address || "",
        phone: profile.phone || "",
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) router.push("/cart");
  }, [items, router, mounted]);

  const subtotal = getSubtotal();

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 bg-slate-100 rounded-xl" />
            <div className="h-32 bg-slate-100 rounded-xl" />
          </div>
          <div className="h-48 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  const validate = () => {
    const errs = {};
    if (!form.shippingAddress.trim()) errs.shippingAddress = "Shipping address is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      errs.phone = "Enter valid 10-digit phone";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: form.shippingAddress,
          phone: form.phone,
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      addToast("Order placed successfully!");
      router.push(`/account?order=${data.order.id}`);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-display font-semibold text-lg mb-4">Shipping Details</h2>
              <div className="space-y-4">
                <Textarea
                  label="Delivery Address"
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  error={errors.shippingAddress}
                  placeholder="Full address with pincode"
                  rows={3}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                  placeholder="10-digit mobile number"
                />
              </div>
            </Card>

            <Card>
              <h2 className="font-display font-semibold text-lg mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-sky-500 bg-sky-50 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm({ ...form, paymentMethod: "cod" })}
                    className="text-sky-500"
                  />
                  <div>
                    <p className="font-medium text-slate-900">Cash on Delivery</p>
                    <p className="text-sm text-slate-500">Pay when your order is delivered</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 opacity-60 cursor-not-allowed">
                  <input type="radio" name="payment" disabled className="text-sky-500" />
                  <div>
                    <p className="font-medium text-slate-900">Online Payment</p>
                    <p className="text-sm text-slate-500">Coming soon — UPI, Cards, Net Banking</p>
                  </div>
                </label>
              </div>
            </Card>

            <Card>
              <h2 className="font-display font-semibold text-lg mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.key} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <h2 className="font-display font-semibold text-lg mb-4">Order Total</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-sky-600">{formatPrice(subtotal)}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Place Order
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
