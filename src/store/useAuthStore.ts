"use client";

import { create } from "zustand";
import type { AuthStore, User } from "@/types";

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  login: (user: User, token: string) =>
    set({ user, accessToken: token, isAuthenticated: true }),

  logout: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),

  toggleWishlist: (productId: string) => {
    const { user } = get();
    if (!user) return;
    const wishlistIds = user.wishlistIds.includes(productId)
      ? user.wishlistIds.filter((id) => id !== productId)
      : [...user.wishlistIds, productId];
    set({ user: { ...user, wishlistIds } });
  },
}));
