import { MenuItem, Category, Order, SalesDashboardData, DailyClosingReport, User } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('kovai_pos_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'API Request failed');
  }

  return data as T;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => request<User>('/auth/me'),

  seedDatabase: () =>
    request<{ message: string }>('/auth/seed', { method: 'POST' }),

  // Menu & Categories
  getCategories: () => request<Category[]>('/menu/categories'),

  getMenuItems: (category?: string, search?: string, vegOnly?: boolean) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (vegOnly) params.append('vegOnly', 'true');
    return request<MenuItem[]>(`/menu?${params.toString()}`);
  },

  createMenuItem: (itemData: Partial<MenuItem>) =>
    request<MenuItem>('/menu', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }),

  updateMenuItem: (id: string, itemData: Partial<MenuItem>) =>
    request<MenuItem>(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }),

  toggleItemAvailability: (id: string, isAvailable: boolean) =>
    request<MenuItem>(`/menu/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    }),

  deleteMenuItem: (id: string) =>
    request<{ message: string }>(`/menu/${id}`, { method: 'DELETE' }),

  // Orders & Billing
  createOrder: (orderData: {
    items: { menuItemId?: string; name: string; price: number; quantity: number; notes?: string }[];
    orderType: string;
    tableNumber?: string;
    discount?: number;
    taxRate?: number;
    paymentMethod: string;
    amountReceived?: number;
    notes?: string;
    cashierName?: string;
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getOrders: (params: {
    search?: string;
    orderType?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const qp = new URLSearchParams();
    if (params.search) qp.append('search', params.search);
    if (params.orderType) qp.append('orderType', params.orderType);
    if (params.paymentMethod) qp.append('paymentMethod', params.paymentMethod);
    if (params.status) qp.append('status', params.status);
    if (params.startDate) qp.append('startDate', params.startDate);
    if (params.endDate) qp.append('endDate', params.endDate);
    return request<Order[]>(`/orders?${qp.toString()}`);
  },

  getOrderById: (id: string) => request<Order>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getKdsActiveOrders: () => request<Order[]>('/orders/kds/active'),

  // Sales & Reports
  getSalesDashboard: () => request<SalesDashboardData>('/sales/dashboard'),

  getPopularItems: () => request<MenuItem[]>('/sales/popular'),

  closeDay: (closedBy: string) =>
    request<{ message: string; report: DailyClosingReport }>('/sales/close-day', {
      method: 'POST',
      body: JSON.stringify({ closedBy }),
    }),
};
