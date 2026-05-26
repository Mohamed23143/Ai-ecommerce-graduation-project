export interface Order {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: string;
  payment: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: 'active' | 'inactive';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products: number;
  created: string;
}

export interface AnalyticsData {
  month: string;
  revenue: number;
  orders: number;
}

export const adminStats = {
  totalProducts: 20,
  totalOrders: 156,
  totalRevenue: 84720,
  totalUsers: 3421,
  totalCategories: 6,
  monthlyGrowth: 12.5,
  conversionRate: 3.2,
  avgOrderValue: 543,
};

export const categories: Category[] = [
  { id: 1, name: 'Women', slug: 'women', products: 6, created: '2025-01-15' },
  { id: 2, name: 'Men', slug: 'men', products: 4, created: '2025-01-15' },
  { id: 3, name: 'Accessories', slug: 'accessories', products: 4, created: '2025-02-01' },
  { id: 4, name: 'Eyewear', slug: 'eyewear', products: 4, created: '2025-02-10' },
  { id: 5, name: 'Footwear', slug: 'footwear', products: 1, created: '2025-03-05' },
  { id: 6, name: 'Collections', slug: 'collections', products: 1, created: '2025-04-01' },
];

export const monthlyAnalytics: AnalyticsData[] = [
  { month: 'Jan', revenue: 8200, orders: 18 },
  { month: 'Feb', revenue: 9400, orders: 22 },
  { month: 'Mar', revenue: 7100, orders: 15 },
  { month: 'Apr', revenue: 12300, orders: 28 },
  { month: 'May', revenue: 15400, orders: 35 },
  { month: 'Jun', revenue: 9800, orders: 24 },
  { month: 'Jul', revenue: 11200, orders: 26 },
  { month: 'Aug', revenue: 14500, orders: 32 },
  { month: 'Sep', revenue: 10300, orders: 21 },
  { month: 'Oct', revenue: 16100, orders: 38 },
  { month: 'Nov', revenue: 18900, orders: 42 },
  { month: 'Dec', revenue: 22400, orders: 48 },
];

export const recentOrders: Order[] = [
  { id: '#ORD-001', customer: 'Emma Richardson', email: 'emma.r@example.com', items: 3, total: 1280, status: 'delivered', date: '2026-05-24', address: '124 Park Avenue, New York, NY 10001', payment: 'Visa **** 4242' },
  { id: '#ORD-002', customer: 'James Mitchell', email: 'james.m@example.com', items: 1, total: 420, status: 'shipped', date: '2026-05-23', address: '56 Oak Lane, Los Angeles, CA 90001', payment: 'Mastercard **** 5555' },
  { id: '#ORD-003', customer: 'Sophia Chen', email: 'sophia.c@example.com', items: 2, total: 835, status: 'processing', date: '2026-05-23', address: '88 Maple Drive, Chicago, IL 60601', payment: 'Amex **** 1234' },
  { id: '#ORD-004', customer: 'Oliver Thompson', email: 'oliver.t@example.com', items: 1, total: 1200, status: 'pending', date: '2026-05-22', address: '23 Cedar Street, Miami, FL 33101', payment: 'PayPal' },
  { id: '#ORD-005', customer: 'Isabella Garcia', email: 'isabella.g@example.com', items: 4, total: 2100, status: 'delivered', date: '2026-05-21', address: '77 Ocean View, San Francisco, CA 94101', payment: 'Visa **** 9876' },
  { id: '#ORD-006', customer: 'Lucas Brown', email: 'lucas.b@example.com', items: 2, total: 560, status: 'shipped', date: '2026-05-21', address: '12 River Road, Austin, TX 73301', payment: 'Mastercard **** 3333' },
  { id: '#ORD-007', customer: 'Mia Williams', email: 'mia.w@example.com', items: 1, total: 310, status: 'cancelled', date: '2026-05-20', address: '45 Hill Street, Denver, CO 80201', payment: 'PayPal' },
  { id: '#ORD-008', customer: 'Ethan Davis', email: 'ethan.d@example.com', items: 3, total: 975, status: 'processing', date: '2026-05-19', address: '9 Lake Road, Seattle, WA 98101', payment: 'Visa **** 1111' },
  { id: '#ORD-009', customer: 'Charlotte Wilson', email: 'charlotte.w@example.com', items: 2, total: 745, status: 'pending', date: '2026-05-18', address: '33 Forest Avenue, Portland, OR 97201', payment: 'Amex **** 7777' },
  { id: '#ORD-010', customer: 'Alexander Lee', email: 'alex.l@example.com', items: 1, total: 480, status: 'delivered', date: '2026-05-17', address: '61 Sunset Blvd, Boston, MA 02101', payment: 'Mastercard **** 2222' },
];

export const adminUsers: AdminUser[] = [
  { id: 1, name: 'Emma Richardson', email: 'emma.r@example.com', orders: 12, spent: 8450, joined: '2025-09-12', status: 'active' },
  { id: 2, name: 'James Mitchell', email: 'james.m@example.com', orders: 8, spent: 5320, joined: '2025-11-03', status: 'active' },
  { id: 3, name: 'Sophia Chen', email: 'sophia.c@example.com', orders: 15, spent: 12400, joined: '2025-07-22', status: 'active' },
  { id: 4, name: 'Oliver Thompson', email: 'oliver.t@example.com', orders: 5, spent: 2890, joined: '2026-01-15', status: 'active' },
  { id: 5, name: 'Isabella Garcia', email: 'isabella.g@example.com', orders: 20, spent: 18300, joined: '2025-05-08', status: 'active' },
  { id: 6, name: 'Lucas Brown', email: 'lucas.b@example.com', orders: 3, spent: 1560, joined: '2026-03-01', status: 'inactive' },
  { id: 7, name: 'Mia Williams', email: 'mia.w@example.com', orders: 9, spent: 4210, joined: '2025-10-19', status: 'active' },
  { id: 8, name: 'Ethan Davis', email: 'ethan.d@example.com', orders: 14, spent: 9800, joined: '2025-08-27', status: 'active' },
  { id: 9, name: 'Charlotte Wilson', email: 'charlotte.w@example.com', orders: 7, spent: 3650, joined: '2026-02-14', status: 'active' },
  { id: 10, name: 'Alexander Lee', email: 'alex.l@example.com', orders: 11, spent: 7200, joined: '2025-12-01', status: 'inactive' },
  { id: 11, name: 'Amelia Turner', email: 'amelia.t@example.com', orders: 4, spent: 1890, joined: '2026-04-10', status: 'active' },
  { id: 12, name: 'Benjamin Foster', email: 'ben.f@example.com', orders: 6, spent: 4100, joined: '2025-06-20', status: 'active' },
];

export const topProducts = [
  { name: 'Oversized Wool Coat', sales: 34, revenue: 24480 },
  { name: 'Silk Blend Blazer', sales: 28, revenue: 15120 },
  { name: 'Cashmere Turtleneck', sales: 25, revenue: 7750 },
  { name: 'Leather Crossbody Bag', sales: 22, revenue: 10560 },
  { name: 'Merino Knit Dress', sales: 19, revenue: 5890 },
];
