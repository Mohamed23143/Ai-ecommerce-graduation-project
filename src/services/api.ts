const BASE = '/api';

async function request<T>(path: string, options?: RequestInit & { token?: string }): Promise<T> {
  const { token, ...fetchOptions } = options || {};
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...fetchOptions,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  created_at: string;
}

export interface CartCheckoutItem {
  product_id: number;
  quantity: number;
}

export interface CheckoutPayload {
  email: string;
  items: CartCheckoutItem[];
}

export interface OrderResponse {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: {
    id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
  }[];
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
}

export function fetchProducts(filters?: ProductFilters): Promise<BackendProduct[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.minPrice !== undefined) params.set('min_price', String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.set('max_price', String(filters.maxPrice));
  if (filters?.size) params.set('size', filters.size);
  if (filters?.color) params.set('color', filters.color);
  const qs = params.toString();
  return request<BackendProduct[]>(`/products${qs ? `?${qs}` : ''}`);
}

export function fetchProduct(id: number): Promise<BackendProduct> {
  return request<BackendProduct>(`/products/${id}`);
}

export function placeOrder(payload: CheckoutPayload, token: string): Promise<OrderResponse> {
  return request<OrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

/* ── My Orders ────────────────────────────────────────── */

export interface OrderItemDetail {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
  product_image: string;
}

export interface OrderWithItems {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItemDetail[];
}

export function fetchMyOrders(token: string): Promise<OrderWithItems[]> {
  return request<OrderWithItems[]>('/orders/me', { token });
}

/* ── Admin ──────────────────────────────────────────── */

export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_users: number;
  orders_by_status: Record<string, number>;
}

export interface AdminUserInfo {
  id: number;
  clerk_user_id: string;
  email: string;
}

export interface AdminOrderItemDetail {
  id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
  product_image: string;
}

export interface AdminOrder {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  user: AdminUserInfo;
  items: AdminOrderItemDetail[];
}

export interface AdminProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  sizes?: string[];
  colors?: string[];
  stock_quantity?: number;
}

export interface ProductCreatePayload {
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  sizes?: string[];
  colors?: string[];
  stock_quantity?: number;
}

export function fetchAdminStats(): Promise<AdminStats> {
  return request<AdminStats>('/admin/stats');
}

export function fetchAdminOrders(status?: string): Promise<AdminOrder[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  return request<AdminOrder[]>(`/admin/orders${qs}`);
}

export function updateOrderStatus(orderId: number, newStatus: string): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status: newStatus }),
  });
}

export function createAdminProduct(data: ProductCreatePayload): Promise<BackendProduct> {
  return request<BackendProduct>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminProduct(productId: number, data: AdminProductUpdate): Promise<BackendProduct> {
  return request<BackendProduct>(`/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteAdminProduct(productId: number): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/admin/products/${productId}`, {
    method: 'DELETE',
  });
}

export function generateAIDescription(name: string, category: string): Promise<{ description: string }> {
  return request<{ description: string }>('/admin/ai/generate-description', {
    method: 'POST',
    body: JSON.stringify({ name, category }),
  });
}

/* ── Admin Users ────────────────────────────────────── */

export interface AdminUserInfoExtended {
  id: number;
  clerk_user_id: string;
  email: string;
  order_count: number;
  total_spent: number;
  created_at: string;
}

export function fetchAdminUsers(): Promise<AdminUserInfoExtended[]> {
  return request<AdminUserInfoExtended[]>('/admin/users');
}

/* ── Admin Categories ───────────────────────────────── */

export interface AdminCategory {
  name: string;
  slug: string;
  product_count: number;
}

export function fetchAdminCategories(): Promise<AdminCategory[]> {
  return request<AdminCategory[]>('/admin/categories');
}

/* ── Admin Analytics ────────────────────────────────── */

export interface MonthlyAnalytics {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

export function fetchMonthlyAnalytics(): Promise<MonthlyAnalytics[]> {
  return request<MonthlyAnalytics[]>('/admin/analytics/monthly');
}

export function fetchTopProducts(): Promise<TopProduct[]> {
  return request<TopProduct[]>('/admin/analytics/top-products');
}

/* ── Auth / User Sync ──────────────────────────────── */


export function syncClerkUser(token: string, email: string): Promise<{ id: number; clerk_user_id: string; email: string }> {
  return request('/auth/sync-user', {
    method: 'POST',
    body: JSON.stringify({ email }),
    token,
  });
}
