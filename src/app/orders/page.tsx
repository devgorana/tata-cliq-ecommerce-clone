import type { Metadata } from "next";
import OrdersClient from "./OrdersClient";

export const metadata: Metadata = {
  title: "My Orders — Tata CLiQ",
  description: "Track and manage your orders.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
