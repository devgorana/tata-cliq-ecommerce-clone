import type { Metadata } from "next";
import OTPClient from "./OTPClient";

export const metadata: Metadata = {
  title: "OTP Login — Tata CLiQ",
  description: "Sign in to your Tata CLiQ account with a one-time password.",
};

export default function OTPPage() {
  return <OTPClient />;
}
