"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/Toast";
import type { User } from "@/types";

interface SocialLoginProps {
  onSuccess?: () => void;
}

// Mock Google user for demo
const MOCK_GOOGLE_USER: User = {
  id: "google-mock-001",
  name: "Demo User",
  email: "demo@example.com",
  phone: "+91 98765 43210",
  cliqCashBalance: 250,
  wishlistIds: [],
};

export default function SocialLogin({ onSuccess }: SocialLoginProps) {
  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();

  const handleGoogleLogin = () => {
    // Simulate OAuth flow — mock login
    setTimeout(() => {
      login(MOCK_GOOGLE_USER, "mock-jwt-token-google");
      showToast("Signed in with Google successfully!", "success");
      onSuccess?.();
    }, 800);
  };

  return (
    <div className="w-full">
      <div className="relative flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-xs text-muted font-medium">OR</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border-default rounded-md bg-card hover:bg-surface transition-colors text-sm font-medium text-primary-text focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2 min-h-[44px]"
        aria-label="Continue with Google"
      >
        {/* Google G logo SVG */}
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
          />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
