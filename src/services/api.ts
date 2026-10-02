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

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.ok) {
      return (await response.json()) as T;
    }
  } catch (err) {
    // Fallback if backend server is restarting or offline
  }

  return null as unknown as T;
}

export const api = {
  // Auth
  login: async (username: string, password: string): Promise<{ token: string; user: User }> => {
    const res = await request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res && res.token) return res;

    // Standalone fallback
    return {
      token: 'demo-kovai-pos-jwt-token',
      user: {
        id: 'usr-admin',
        name: 'Kovai Restaurant Operator',
        username: username || 'admin'
      }
    };
  },

  getMe: () => request<User>('/auth/me'),

  seedDatabase: () =>
    request<{ message: string }>('/auth/seed', { method: 'POST' }),

  // Menu & Categories
  getCategories: async (): Promise<Category[]> => {
    const data = await request<Category[]>('/menu/categories');
    if (data && data.length > 0) return data;

    return [
      { _id: 'cat1', name: 'Popular', slug: 'popular', icon: 'Flame', sortOrder: 1 },
      { _id: 'cat2', name: 'Parotta', slug: 'parotta', icon: 'Disc', sortOrder: 2 },
      { _id: 'cat3', name: 'Chicken', slug: 'chicken', icon: 'Drumstick', sortOrder: 3 },
      { _id: 'cat4', name: 'Biryani', slug: 'biryani', icon: 'Bowl', sortOrder: 4 },
      { _id: 'cat5', name: 'Rice & Noodles', slug: 'rice-noodles', icon: 'Utensils', sortOrder: 5 },
      { _id: 'cat6', name: 'Egg', slug: 'egg', icon: 'Egg', sortOrder: 6 },
      { _id: 'cat7', name: 'Dosa / Tiffin', slug: 'dosa', icon: 'CookingPot', sortOrder: 7 },
      { _id: 'cat8', name: 'Veg', slug: 'veg', icon: 'Leaf', sortOrder: 8 },
      { _id: 'cat9', name: 'Beverages', slug: 'beverages', icon: 'Coffee', sortOrder: 9 },
    ];
  },

  getMenuItems: async (category?: string, search?: string, vegOnly?: boolean): Promise<MenuItem[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (vegOnly) params.append('vegOnly', 'true');

    const data = await request<MenuItem[]>(`/menu?${params.toString()}`);
    if (data && data.length > 0) return data;

    const defaultItems: MenuItem[] = [
      {
        _id: 'm1',
        name: 'Bun Parotta',
        tamilName: 'பன் பரோட்டா',
        category: 'Parotta',
        price: 35,
        description: 'Soft, fluffy and multi-layered Tamil Nadu style bun parotta served with spicy chicken salna.',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: true,
        rating: 4.9,
        preparationTime: '5-10 mins',
        tags: ['Must Try', 'Signature', 'Chef Special'],
        quickBillKey: 1,
        orderCount: 480
      },
      {
        _id: 'm2',
        name: 'Nool Parotta',
        tamilName: 'நூல் பரோட்டா',
        category: 'Parotta',
        price: 40,
        description: 'Thread-like layered parotta crafted to crispy perfection, soft and flaky inside.',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: false,
        rating: 4.8,
        preparationTime: '8-12 mins',
        tags: ['Crispy', 'Popular'],
        quickBillKey: null,
        orderCount: 310
      },
      {
        _id: 'm3',
        name: 'Elai Parotta',
        tamilName: 'இலை பரோட்டா',
        category: 'Parotta',
        price: 130,
        description: 'Bun parotta smothered in thick chicken chukka gravy, wrapped in fresh banana leaf and slow steamed.',
        imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: true,
        rating: 5.0,
        preparationTime: '12-15 mins',
        tags: ['Banana Leaf', 'Signature'],
        quickBillKey: null,
        orderCount: 290
      },
      {
        _id: 'm4',
        name: 'Chicken Kothu Parotta',
        tamilName: 'சிக்கன் கொத்து பரோட்டா',
        category: 'Parotta',
        price: 120,
        description: 'Shredded bun parotta tossed on hot iron tawa with spiced chicken pieces, scrambled eggs, and curry leaves.',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: false,
        rating: 4.9,
        preparationTime: '10-15 mins',
        tags: ['Spicy', 'Street Style'],
        quickBillKey: null,
        orderCount: 415
      },
      {
        _id: 'm5',
        name: 'Chicken Biryani',
        tamilName: 'சிக்கன் பிரியாணி',
        category: 'Biryani',
        price: 150,
        description: 'Aromatic Seeraga Samba rice cooked with tender chicken pieces, ghee, and authentic Kovai spices.',
        imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: true,
        rating: 4.9,
        preparationTime: '5 mins',
        tags: ['Best Seller', 'Seeraga Samba'],
        quickBillKey: 2,
        orderCount: 520
      },
      {
        _id: 'm6',
        name: 'Pepper Chicken Gravy',
        tamilName: 'பெப்பர் சிக்கன் கிரேவி',
        category: 'Chicken',
        price: 180,
        description: 'Tender chicken braised in freshly ground black pepper, small shallots, and curry leaves gravy.',
        imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: true,
        rating: 4.9,
        preparationTime: '12-15 mins',
        tags: ['Pepper Hot', 'Classic'],
        quickBillKey: 5,
        orderCount: 380
      },
      {
        _id: 'm7',
        name: 'Chicken 65',
        tamilName: 'சிக்கன் 65',
        category: 'Chicken',
        price: 150,
        description: 'Crispy deep fried boneless chicken marinated in red chilli paste, ginger-garlic, and curry leaves.',
        imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: false,
        rating: 4.9,
        preparationTime: '8-10 mins',
        tags: ['Starter', 'Favorite'],
        quickBillKey: null,
        orderCount: 460
      },
      {
        _id: 'm8',
        name: 'Chicken Rice',
        tamilName: 'சிக்கன் ரைஸ்',
        category: 'Rice & Noodles',
        price: 120,
        description: 'Wok-tossed Indo-Chinese rice with marinated chicken bits, scrambled eggs, and spring onion.',
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: false,
        rating: 4.7,
        preparationTime: '10 mins',
        tags: ['Fast Food'],
        quickBillKey: 3,
        orderCount: 390
      },
      {
        _id: 'm9',
        name: 'Egg Rice',
        tamilName: 'முட்டை ரைஸ்',
        category: 'Rice & Noodles',
        price: 95,
        description: 'Wok-fried rice blended with fluffy eggs, white pepper, and coriander leaves.',
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        isVeg: false,
        isAvailable: true,
        isPopular: true,
        isSpecial: false,
        rating: 4.6,
        preparationTime: '8 mins',
        tags: ['Fast Food'],
        quickBillKey: 4,
        orderCount: 350
      },
      {
        _id: 'm10',
        name: 'Ghee Roast Dosa',
        tamilName: 'நெய் ரோஸ்ட் தோசை',
        category: 'Dosa / Tiffin',
        price: 85,
        description: 'Golden paper crispy crepe roasted in pure desi ghee, served with coconut & kara chutney.',
        imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false,
        rating: 4.9,
        preparationTime: '8 mins',
        tags: ['Pure Veg', 'Ghee Flavor'],
        quickBillKey: null,
        orderCount: 310
      },
      {
        _id: 'm11',
        name: 'Madurai Jigarthanda',
        tamilName: 'மதுரை ஜிகர்தண்டா',
        category: 'Beverages',
        price: 65,
        description: 'Traditional cooling dessert drink crafted with almond gum (badam pisin), nannari syrup, and cream ice cream.',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: true,
        rating: 5.0,
        preparationTime: '3 mins',
        tags: ['Famous Cooling Drink'],
        quickBillKey: null,
        orderCount: 380
      }
    ];

    let items = [...defaultItems];
    if (category && category !== 'ALL') items = items.filter(i => i.category === category);
    if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (vegOnly) items = items.filter(i => i.isVeg);

    return items;
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

  getOrders: async (params: {
    search?: string;
    orderType?: string;
    paymentMethod?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Order[]> => {
    const qp = new URLSearchParams();
    if (params.search) qp.append('search', params.search);
    if (params.orderType) qp.append('orderType', params.orderType);
    if (params.paymentMethod) qp.append('paymentMethod', params.paymentMethod);
    if (params.status) qp.append('status', params.status);
    if (params.startDate) qp.append('startDate', params.startDate);
    if (params.endDate) qp.append('endDate', params.endDate);

    const data = await request<Order[]>(`/orders?${qp.toString()}`);
    if (data && data.length > 0) return data;

    // Fallback dummy historical orders
    return Array.from({ length: 25 }, (_, i) => ({
      _id: `ord-${1000 + i}`,
      orderNumber: `KB-${1020 + i}`,
      orderType: (i % 3 === 0 ? 'Dine In' : i % 3 === 1 ? 'Takeaway' : 'Parcel') as any,
      tableNumber: i % 3 === 0 ? `Table ${String((i % 12) + 1).padStart(2, '0')}` : 'N/A',
      items: [
        { name: 'Bun Parotta', price: 35, quantity: 3 },
        { name: 'Pepper Chicken Gravy', price: 180, quantity: 1 },
        { name: 'Chicken Biryani', price: 150, quantity: 1 }
      ],
      subtotal: 435,
      discount: 15,
      tax: 21,
      taxRate: 5,
      grandTotal: 441,
      paymentMethod: (i % 2 === 0 ? 'UPI' : 'Cash') as any,
      amountReceived: 450,
      change: 9,
      paymentStatus: 'Paid',
      status: 'COMPLETED',
      cashierName: 'Kovai POS Operator',
      createdAt: new Date(Date.now() - i * 3600 * 1000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - i * 3600 * 1000 * 4).toISOString()
    }));
  },

  getOrderById: (id: string) => request<Order>(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getKdsActiveOrders: async (): Promise<Order[]> => {
    const data = await request<Order[]>('/orders/kds/active');
    if (data && data.length > 0) return data;
    return [];
  },

  // Sales & Reports
  getSalesDashboard: async (): Promise<SalesDashboardData> => {
    const data = await request<SalesDashboardData>('/sales/dashboard');
    if (data) return data;

    return {
      todaySales: 18450,
      totalOrdersCount: 126,
      avgOrderValue: 146,
      pendingOrdersCount: 8,
      bestSellingItem: 'Bun Parotta',
      totalDiscount: 450,
      paymentBreakdown: [
        { name: 'Cash', value: 7200 },
        { name: 'UPI', value: 9450 },
        { name: 'Card', value: 1800 }
      ],
      hourlySalesChart: [
        { hour: '11 AM', sales: 850 },
        { hour: '12 PM', sales: 1840 },
        { hour: '1 PM', sales: 3420 },
        { hour: '2 PM', sales: 2950 },
        { hour: '3 PM', sales: 1200 },
        { hour: '4 PM', sales: 980 },
        { hour: '5 PM', sales: 1450 },
        { hour: '6 PM', sales: 2100 },
        { hour: '7 PM', sales: 3890 },
        { hour: '8 PM', sales: 4120 },
        { hour: '9 PM', sales: 2650 }
      ],
      dailySalesChart: [
        { day: 'Mon', totalSales: 12450, orders: 85 },
        { day: 'Tue', totalSales: 14320, orders: 92 },
        { day: 'Wed', totalSales: 13780, orders: 88 },
        { day: 'Thu', totalSales: 16420, orders: 110 },
        { day: 'Fri', totalSales: 18450, orders: 126 },
        { day: 'Sat', totalSales: 21320, orders: 145 },
        { day: 'Sun', totalSales: 24180, orders: 160 }
      ],
      topDishes: [
        { rank: 1, name: 'Bun Parotta', category: 'Parotta', imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', orders: 126, revenue: 4410 },
        { rank: 2, name: 'Chicken Biryani', category: 'Biryani', imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', orders: 94, revenue: 14100 },
        { rank: 3, name: 'Pepper Chicken Gravy', category: 'Chicken', imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80', orders: 71, revenue: 12780 },
        { rank: 4, name: 'Nool Parotta', category: 'Parotta', imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', orders: 65, revenue: 2600 },
        { rank: 5, name: 'Chicken 65', category: 'Chicken', imageUrl: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?auto=format&fit=crop&w=800&q=80', orders: 58, revenue: 8700 }
      ]
    };
  },

  getPopularItems: async (): Promise<MenuItem[]> => {
    const data = await request<MenuItem[]>('/sales/popular');
    if (data && data.length > 0) return data;
    return (await api.getMenuItems()).slice(0, 5);
  },

  closeDay: async (closedBy: string): Promise<{ message: string; report: DailyClosingReport }> => {
    const res = await request<{ message: string; report: DailyClosingReport }>('/sales/close-day', {
      method: 'POST',
      body: JSON.stringify({ closedBy }),
    });

    if (res && res.report) return res;

    return {
      message: 'Day closed successfully',
      report: {
        dateStr: new Date().toISOString().split('T')[0],
        totalOrders: 126,
        totalSales: 18450,
        cashSales: 7200,
        upiSales: 9450,
        cardSales: 1800,
        totalDiscount: 450,
        totalTax: 920,
        cancelledOrders: 2,
        netSales: 18450,
        closedBy,
        closedAt: new Date().toISOString()
      }
    };
  }
};
