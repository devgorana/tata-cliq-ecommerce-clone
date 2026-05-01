// ─── Catalog ──────────────────────────────────────────────────────────────────

export type Category = "fashion" | "electronics" | "luxury" | "home";

export interface CategoryPath {
  label: string;
  slug: string;
}

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  stock: number;
  additionalPrice: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: Category;
  categoryPath: CategoryPath[];
  description: string;
  specifications: Record<string, string>;
  images: ProductImage[];
  variants: ProductVariant[];
  mrp: number;
  salePrice: number;
  discountPercent: number;
  gstRate: 5 | 12 | 18 | 28;
  authenticityGuaranteed: boolean;
  avgRating: number;
  ratingsCount: number;
  tags: string[];
  isActive: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  variantId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, variantId: string, qty?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

// ─── Filter / Search ──────────────────────────────────────────────────────────

export type SortOption =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "top_rated"
  | "highest_discount";

export interface FilterState {
  category: Category | null;
  brands: string[];
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  discountMin: number;
  sortBy: SortOption;
  searchQuery: string;
}

export interface FilterStore extends FilterState {
  setFilter: (partial: Partial<FilterState>) => void;
  resetFilters: () => void;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  cliqCashBalance: number;
  wishlistIds: string[];
}

export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "OutForDelivery"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  product: Product;
  variantId: string;
  quantity: number;
  price: number;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export type PaymentMethod = "UPI" | "Card" | "NetBanking" | "COD" | "EMI" | "CLiQCash";

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  totalDiscount: number;
  deliveryCharge: number;
  gstAmount: number;
  netPayable: number;
  cliqCashEarned: number;
  cliqCashRedeemed: number;
  trackingId?: string;
  placedAt: Date;
  deliveredAt?: Date;
}
