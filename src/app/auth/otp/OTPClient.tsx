"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/Toast";
import OTPInput from "@/components/auth/OTPInput";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const MOCK_USER: User = {
  id: "user-otp-001",
  name: "Rahul Verma",
  email: "rahul@example.com",
  phone: "+91 98765 43210",
  cliqCashBalance: 150,
  wishlistIds: [],
};

type Step = "phone" | "otp";

export default function OTPClient() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+?[\d\s\-]{10,}$/.test(phone)) {
      setPhoneError("Enter a valid 10-digit mobile number");
      return;
    }
    setPhoneError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setStep("otp");
    setResendTimer(30);
    showToast("OTP sent to " + phone, "success");
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }
    setOtpError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Mock: any 6-digit OTP works
    login(MOCK_USER, "mock-jwt-token-otp");
    showToast("Signed in successfully!", "success");
    router.push("/");
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setOtp(Array(6).fill(""));
    setResendTimer(30);
    showToast("OTP resent!", "success");
  };

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
          </div>

          {step === "phone" ? (
            <>
              <h1 className="text-xl font-semibold text-primary-text font-display mb-1">
                Sign in with OTP
              </h1>
              <p className="text-sm text-muted mb-6">
                Enter your mobile number to receive a one-time password
              </p>

              <form onSubmit={handleSendOTP} noValidate>
                <label htmlFor="phone-input" className="block text-sm font-medium text-primary-text mb-1.5">
                  Mobile number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 h-11 border border-border-default rounded-md bg-surface text-sm text-muted flex-shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? "phone-otp-error" : undefined}
                    className={cn(
                      "flex-1 h-11 px-4 text-sm text-primary-text bg-card border rounded-md",
                      "placeholder:text-muted transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2",
                      phoneError
                        ? "border-red-500"
                        : "border-border-default hover:border-muted focus:border-accent-red"
                    )}
                  />
                </div>
                {phoneError && (
                  <p id="phone-otp-error" role="alert" className="mt-1 text-xs text-red-600">
                    {phoneError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 w-full h-12 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending OTP…
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep("phone"); setOtp(Array(6).fill("")); }}
                className="flex items-center gap-1 text-sm text-muted hover:text-primary-text transition-colors mb-6 min-h-[44px]"
                aria-label="Back to phone number entry"
              >
                <ChevronLeft className="w-4 h-4" />
                Change number
              </button>

              <h1 className="text-xl font-semibold text-primary-text font-display mb-1">
                Enter OTP
              </h1>
              <p className="text-sm text-muted mb-6">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-primary-text">{phone}</span>
              </p>

              <form onSubmit={handleVerifyOTP} noValidate>
                <div className="flex justify-center mb-2">
                  <OTPInput value={otp} onChange={setOtp} disabled={loading} />
                </div>
                {otpError && (
                  <p role="alert" className="text-xs text-red-600 text-center mt-2">
                    {otpError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="mt-6 w-full h-12 bg-accent-red text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors active:scale-[0.97] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent-red focus:ring-offset-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>

                <div className="text-center mt-4">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted">
                      Resend OTP in{" "}
                      <span className="font-medium text-primary-text">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-sm text-accent-red font-medium hover:underline min-h-[44px]"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </>
          )}

          <p className="text-center text-sm text-muted mt-6">
            <Link href="/auth/login" className="text-accent-red font-medium hover:underline">
              Sign in with password instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
