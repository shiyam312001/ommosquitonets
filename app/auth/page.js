"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import Logo from "@/components/layout/Logo";
import { useAuth } from "@/context/AuthProvider";

function AuthForm() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (mode === "register") {
      if (!form.full_name) errs.full_name = "Full name is required";
      if (!form.phone) errs.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
        errs.phone = "Enter valid 10-digit phone";
      if (form.password !== form.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage("");

    try {
      if (mode === "login") {
        await signIn(form.email, form.password);
        router.push(redirect);
      } else {
        await signUp(form.email, form.password, {
          full_name: form.full_name,
          phone: form.phone,
        });
        setMessage("Account created! Check your email to verify, then login.");
        setMode("login");
      }
    } catch (err) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo href="/" size="lg" className="mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-slate-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "login"
              ? "Sign in to your Om Mosquito Nets account"
              : "Join us for a better shopping experience"}
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === "login" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === "register" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                error={errors.full_name}
                placeholder="Your full name"
              />
              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                error={errors.phone}
                placeholder="10-digit mobile number"
              />
            </>
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="••••••••"
          />
          {mode === "register" && (
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />
          )}

          {message && (
            <p className={`text-sm ${message.includes("created") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/" className="text-sky-600 hover:underline">
            ← Back to store
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
