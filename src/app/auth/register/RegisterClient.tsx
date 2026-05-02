"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/Toast";
import SocialLogin from "@/components/auth/SocialLogin";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

export default function RegisterClient() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address";
    if (form.phone && !/^\+?[\d\s\-]{10,}$/.test(form.phone))
      errs.phone = "Enter a valid phone number";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      cliqCashBalance: 0,
      wishlistIds: [],
    };
    login(newUser, "mock-jwt-token-register");
    showToast("Account created! Welcome to CLiQ.", "success");
    router.push("/");
  };

  const inputClass = (field: keyof typeof form) =>
    cn(
      "w-full h-11 px-4 text-sm text-primary-text bg-card border rounded-md",
      "placeholder:text-muted transition-colors duration-150",
      "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2",
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-border-default hover:border-muted focus:border-accent-red"
    );

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border-default p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-3xl text-accent-red">CLiQ</span>
              <span className="block text-xs text-muted tracking-wide mt-0.5">by TATA</span>
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-primary-text font-display">
              Create your account
            </h1>
            <p className="text-sm text-muted mt-1">Join millions of happy shoppers</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-primary-text mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                placeholder="Priya Sharma"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass("name")}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-primary-text mb-1.5">
                Email address
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "reg-email-error" : undefined}
                className={inputClass("email")}
              />
              {errors.email && (
                <p id="reg-email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone (optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary-text mb-1.5">
                Phone number <span className="text-muted font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91 98765 43210"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-primary-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 6 characters"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "reg-password-error" : undefined}
                  className={cn(inputClass("password"), "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary-text transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="reg-password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-primary-text mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                className={inputClass("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p id="confirm-error" role="alert" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <SocialLogin onSuccess={() => router.push("/")} />

          <p className="text-center text-sm text-muted mt-5">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-accent-red font-medium hover:underline inline-flex items-center gap-0.5"
            >
              Sign in <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
