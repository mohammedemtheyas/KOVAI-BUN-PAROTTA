export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  tamilName?: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isSpecial: boolean;
  rating?: number;
  preparationTime?: string;
  tags?: string[];
  quickBillKey?: number | null;
  orderCount?: number;
}

export interface OrderItem {
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export type OrderType = 'Dine In' | 'Takeaway' | 'Parcel';
export type PaymentMethod = 'Cash' | 'UPI' | 'Card';
export type PaymentStatus = 'Paid' | 'Pending' | 'Cancelled';
export type OrderStatus = 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  _id: string;
  orderNumber: string;
  orderType: OrderType;
  tableNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  amountReceived: number;
  change: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  cashierName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentBreakdownItem {
  name: string;
  value: number;
}

export interface HourlySalesChartItem {
  hour: string;
  sales: number;
}

export interface SalesDailyChartItem {
  day: string;
  totalSales: number;
  orders: number;
}

export interface TopDishItem {
  rank: number;
  name: string;
  category: string;
  imageUrl: string;
  orders: number;
  revenue: number;
}

export interface SalesDashboardData {
  todaySales: number;
  totalOrdersCount: number;
  avgOrderValue: number;
  pendingOrdersCount: number;
  bestSellingItem: string;
  totalDiscount: number;
  paymentBreakdown: PaymentBreakdownItem[];
  hourlySalesChart: HourlySalesChartItem[];
  dailySalesChart: SalesDailyChartItem[];
  topDishes: TopDishItem[];
}

export interface DailyClosingReport {
  _id?: string;
  dateStr: string;
  totalOrders: number;
  totalSales: number;
  cashSales: number;
  upiSales: number;
  cardSales: number;
  totalDiscount: number;
  totalTax: number;
  cancelledOrders: number;
  netSales: number;
  closedBy: string;
  closedAt: string;
}
