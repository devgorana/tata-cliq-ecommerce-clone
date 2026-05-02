"use client";

import { useMemo } from "react";
import { mockProducts } from "@/data/mock-catalog";
import { useAuthStore } from "@/store/useAuthStore";
import type { Order } from "@/types";

// ─── Mock order data ──────────────────────────────────────────────────────────
// Uses real products from mock-catalog so images/names render correctly.
// V2 swap: replace the useMemo body with useQuery(orderApi.getOrders(userId)).

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "CLQ-20260428-A3F2B1C9",
    status: "Delivered",
    items: [
      {
        product: mockProducts[0], // Zara Blazer
        variantId: "f001-m",
        quantity: 1,
        price: mockProducts[0].salePrice,
      },
      {
        product: mockProducts[2], // Levi's Jeans
        variantId: "f003-32",
        quantity: 1,
        price: mockProducts[2].salePrice,
      },
    ],
    deliveryAddress: {
      fullName: "Arjun Sharma",
      line1: "42, Lotus Apartments, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "9876543210",
    },
    paymentMethod: "UPI",
    subtotal: mockProducts[0].salePrice + mockProducts[2].salePrice,
    totalDiscount: 0,
    deliveryCharge: 0,
    gstAmount: Math.round((mockProducts[0].salePrice + mockProducts[2].salePrice) * 0.12),
    netPayable: mockProducts[0].salePrice + mockProducts[2].salePrice,
    cliqCashEarned: 94,
    cliqCashRedeemed: 0,
    trackingId: "DTDC1234567890",
    placedAt: new Date("2026-04-28T10:30:00"),
    deliveredAt: new Date("2026-05-01T14:20:00"),
  },
  {
    id: "ord-002",
    orderNumber: "CLQ-20260430-B7D4E2F1",
    status: "OutForDelivery",
    items: [
      {
        product: mockProducts[15], // Electronics product
        variantId: mockProducts[15].variants[0].id,
        quantity: 1,
        price: mockProducts[15].salePrice,
      },
    ],
    deliveryAddress: {
      fullName: "Arjun Sharma",
      line1: "42, Lotus Apartments, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "9876543210",
    },
    paymentMethod: "Card",
    subtotal: mockProducts[15].salePrice,
    totalDiscount: 0,
    deliveryCharge: 0,
    gstAmount: Math.round(mockProducts[15].salePrice * 0.18),
    netPayable: mockProducts[15].salePrice,
    cliqCashEarned: 120,
    cliqCashRedeemed: 0,
    trackingId: "BLUEDART9876543",
    placedAt: new Date("2026-04-30T16:45:00"),
  },
  {
    id: "ord-003",
    orderNumber: "CLQ-20260501-C9A1D3E8",
    status: "Shipped",
    items: [
      {
        product: mockProducts[30], // Luxury product
        variantId: mockProducts[30].variants[0].id,
        quantity: 1,
        price: mockProducts[30].salePrice,
      },
    ],
    deliveryAddress: {
      fullName: "Arjun Sharma",
      line1: "42, Lotus Apartments, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "9876543210",
    },
    paymentMethod: "CLiQCash",
    subtotal: mockProducts[30].salePrice,
    totalDiscount: 0,
    deliveryCharge: 0,
    gstAmount: Math.round(mockProducts[30].salePrice * 0.12),
    netPayable: mockProducts[30].salePrice,
    cliqCashEarned: 200,
    cliqCashRedeemed: 500,
    trackingId: "FEDEX5432167890",
    placedAt: new Date("2026-05-01T09:15:00"),
  },
  {
    id: "ord-004",
    orderNumber: "CLQ-20260502-D2F5G7H3",
    status: "Confirmed",
    items: [
      {
        product: mockProducts[40], // Home product
        variantId: mockProducts[40].variants[0].id,
        quantity: 2,
        price: mockProducts[40].salePrice,
      },
    ],
    deliveryAddress: {
      fullName: "Arjun Sharma",
      line1: "42, Lotus Apartments, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "9876543210",
    },
    paymentMethod: "NetBanking",
    subtotal: mockProducts[40].salePrice * 2,
    totalDiscount: 0,
    deliveryCharge: 49,
    gstAmount: Math.round(mockProducts[40].salePrice * 2 * 0.12),
    netPayable: mockProducts[40].salePrice * 2 + 49,
    cliqCashEarned: 60,
    cliqCashRedeemed: 0,
    placedAt: new Date("2026-05-02T08:00:00"),
  },
  {
    id: "ord-005",
    orderNumber: "CLQ-20260415-E8B3C1A9",
    status: "Cancelled",
    items: [
      {
        product: mockProducts[5],
        variantId: mockProducts[5].variants[0].id,
        quantity: 1,
        price: mockProducts[5].salePrice,
      },
    ],
    deliveryAddress: {
      fullName: "Arjun Sharma",
      line1: "42, Lotus Apartments, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      phone: "9876543210",
    },
    paymentMethod: "COD",
    subtotal: mockProducts[5].salePrice,
    totalDiscount: 0,
    deliveryCharge: 0,
    gstAmount: Math.round(mockProducts[5].salePrice * 0.12),
    netPayable: mockProducts[5].salePrice,
    cliqCashEarned: 0,
    cliqCashRedeemed: 0,
    placedAt: new Date("2026-04-15T12:00:00"),
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOrders(): { orders: Order[]; isLoading: boolean } {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const orders = useMemo(() => {
    if (!isAuthenticated) return [];
    // V2 swap: return useQuery(orderApi.getOrders(userId)).data ?? []
    return MOCK_ORDERS;
  }, [isAuthenticated]);

  return { orders, isLoading: false };
}
