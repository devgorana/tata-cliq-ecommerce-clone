import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Login — Tata CLiQ",
  description: "Sign in to your Tata CLiQ account.",
};

export default function LoginPage() {
  return <LoginClient />;
}
