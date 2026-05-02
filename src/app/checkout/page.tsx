import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout — Tata CLiQ",
  description: "Complete your purchase securely.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
