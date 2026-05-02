import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Create Account — Tata CLiQ",
  description: "Create your Tata CLiQ account and start shopping.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
