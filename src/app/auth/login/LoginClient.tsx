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

// Mock credentials for demo
const MOCK_USER: User = {
  id: "user-001",
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "+91 98765 43210",
  cliqCashBalance: 500,
  wishlistIds: [],
};

export default function LoginClient() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    login(MOCK_USER, "mock-jwt-token-email");
    showToast("Welcome back, " + MOCK_USER.name + "!", "success");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-lg border border-border-default p-8 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-3xl text-accent-red">CLiQ</span>
              <span className="block text-xs text-muted tracking-wide mt-0.5">by TATA</span>
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-primary-text font-display">
              Welcome back
            </h1>
            <p className="text-sm text-muted mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-text mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                className={cn(
                  "w-full h-11 px-4 text-sm text-primary-text bg-card border rounded-md",
                  "placeholder:text-muted transition-colors duration-150",
                  "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2",
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-border-default hover:border-muted focus:border-accent-red"
                )}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-primary-text"
                >
                  Password
                </label>
                <Link
                  href="/auth/otp"
                  className="text-xs text-accent-red hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                  className={cn(
                    "w-full h-11 px-4 pr-11 text-sm text-primary-text bg-card border rounded-md",
                    "placeholder:text-muted transition-colors duration-150",
                    "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2",
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-border-default hover:border-muted focus:border-accent-red"
                  )}
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
                <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <SocialLogin onSuccess={() => router.push("/")} />

          {/* Register link */}
          <p className="text-center text-sm text-muted mt-5">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-accent-red font-medium hover:underline inline-flex items-center gap-0.5"
            >
              Create one <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

        {/* OTP login option */}
        <p className="text-center text-sm text-muted mt-4">
          Prefer OTP login?{" "}
          <Link href="/auth/otp" className="text-accent-red font-medium hover:underline">
            Sign in with OTP
          </Link>
        </p>
      </div>
    </div>
  );
}
