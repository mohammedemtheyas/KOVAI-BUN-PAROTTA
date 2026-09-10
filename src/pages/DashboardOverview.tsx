import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Award, 
  Flame, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { SalesDashboardData, Order } from '../types';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface DashboardOverviewProps {
  onNavigate: (route: string) => void;
  onOpenBillDetail: (order: Order) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenBillDetail
}) => {
  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [recentBills, setRecentBills] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [dashData, billsData] = await Promise.all([
        api.getSalesDashboard(),
        api.getOrders({ status: 'ALL' })
      ]);
      setData(dashData);
      setRecentBills(billsData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-charcoal-950 text-stone-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Top Welcome Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal-850 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              KOVAI BUN PAROTTA
            </h1>
            <span className="text-sm font-serif text-turmeric-400 font-bold">
              • கோவை பன் பரோட்டா
            </span>
          </div>
          <p className="text-xs text-stone-400">Today's Restaurant Command Center & Operational Overview</p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-turmeric-400 font-bold font-mono block">{currentDateStr}</span>
          <span className="text-[11px] text-stone-500">Coimbatore, Tamil Nadu • Live Operating Status</span>
        </div>
      </div>

      {/* HERO BANNER SECTION */}
      <div className="relative rounded-3xl overflow-hidden border border-chilli-700/40 shadow-2xl bg-charcoal-900 group">
        
        {/* Authentic Tamil Nadu Parotta Food Photograph Hero Backdrop */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1600&q=85"
            alt="Kovai Bun Parotta Dish Banner"
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/90 to-transparent"></div>
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 p-6 sm:p-8 md:p-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-chilli-600/20 text-chilli-400 border border-chilli-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Coimbatore Parotta Shop POS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            GOOD EVENING 👋 <br />
            <span className="text-turmeric-400">Welcome back to Kovai Bun Parotta</span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Hot fluffy bun parottas, aromatic seeraga samba chicken biryani, and fiery pepper chicken curries are being served live. Here is today's restaurant performance at a glance.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('/pos')}
              className="flex items-center gap-2.5 bg-gradient-to-r from-chilli-600 to-chilli-700 hover:from-chilli-500 hover:to-chilli-600 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider shadow-xl shadow-chilli-900/50 border border-chilli-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} />
              <span>CREATE NEW BILL</span>
            </button>

            <button
              onClick={() => onNavigate('/kitchen')}
              className="flex items-center gap-2 bg-charcoal-850 hover:bg-charcoal-800 text-stone-200 font-bold px-4 py-3 rounded-2xl text-xs border border-charcoal-750 transition-all"
            >
              <span>View Kitchen Orders ({data?.pendingOrdersCount || 8})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD STATISTICS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Sales */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-turmeric-600/30 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">TODAY'S SALES</span>
            <div className="w-8 h-8 rounded-lg bg-turmeric-500/20 text-turmeric-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="text-3xl font-black text-turmeric-400 font-mono">
            ₹{data?.todaySales ? data.todaySales.toLocaleString('en-IN') : '18,450'}
          </div>
          <p className="text-[11px] text-leaf-500 mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp size={13} /> +14.2% higher than yesterday
          </p>
        </div>

        {/* Orders Today */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-charcoal-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">ORDERS TODAY</span>
            <div className="w-8 h-8 rounded-lg bg-chilli-500/20 text-chilli-400 flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {data?.totalOrdersCount || 126}
          </div>
          <p className="text-[11px] text-stone-400 mt-2">Dine In, Takeaway & Parcel</p>
        </div>

        {/* Average Bill */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-charcoal-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">AVERAGE BILL</span>
            <div className="w-8 h-8 rounded-lg bg-leaf-500/20 text-leaf-400 flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="text-3xl font-black text-leaf-400 font-mono">
            ₹{data?.avgOrderValue || 146}
          </div>
          <p className="text-[11px] text-stone-400 mt-2">Average order ticket size</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-charcoal-900 p-5 rounded-2xl border border-chilli-600/40 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">PENDING ORDERS</span>
            <div className="w-8 h-8 rounded-lg bg-chilli-600 text-white font-bold text-xs flex items-center justify-center animate-pulse">
              {data?.pendingOrdersCount || 8}
            </div>
          </div>
          <div className="text-3xl font-black text-chilli-400 font-mono">
            {data?.pendingOrdersCount || 8} Orders
          </div>
          <p className="text-[11px] text-chilli-400 mt-2 flex items-center gap-1 font-semibold">
            <Clock size={13} /> Active in Kitchen KDS Queue
          </p>
        </div>
      </div>

      {/* SALES HOURLY GRAPH & 🔥 CUSTOMER FAVOURITES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Sales Enterprise Chart */}
        <div className="lg:col-span-2 bg-charcoal-900 p-6 rounded-3xl border border-charcoal-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                <TrendingUp size={18} className="text-turmeric-400" />
                <span>TODAY'S HOURLY SALES (11 AM - 9 PM)</span>
              </h3>
              <p className="text-xs text-stone-400">Peak dining rush hour sales distribution</p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.hourlySalesChart || []}>
                <XAxis dataKey="hour" stroke="#78716c" fontSize={11} />
                <YAxis stroke="#78716c" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1c1917', borderColor: '#44403c', borderRadius: '14px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${val}`, 'Sales Revenue']}
                />
                <Bar dataKey="sales" fill="#b91c1c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔥 CUSTOMER FAVOURITES FOOD CARDS */}
        <div className="bg-charcoal-900 p-6 rounded-3xl border border-charcoal-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <Flame size={20} className="text-chilli-500 fill-chilli-500" />
              <span>CUSTOMER FAVOURITES</span>
            </h3>
            <span className="text-xs text-turmeric-400 font-bold">Top 5 Dishes</span>
          </div>

          <div className="space-y-3">
            {data?.topDishes && data.topDishes.length > 0 ? (
              data.topDishes.map((dish) => (
                <div
                  key={dish.rank}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-charcoal-850 border border-charcoal-800 hover:border-chilli-600/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-chilli-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      #{dish.rank}
                    </span>
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-11 h-11 rounded-xl object-cover border border-charcoal-700 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-white leading-tight">{dish.name}</h4>
                      <span className="text-[11px] text-stone-400">{dish.orders} orders today</span>
                    </div>
                  </div>

                  <div className="text-right font-mono font-extrabold text-xs text-turmeric-400">
                    ₹{dish.revenue.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500 text-center py-6">Loading top dishes...</p>
            )}
          </div>
        </div>
      </div>

      {/* RECENT BILLS TABLE */}
      <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
              RECENT RESTAURANT BILLS
            </h3>
            <p className="text-xs text-stone-400">Latest orders generated at cashier POS</p>
          </div>

          <button
            onClick={() => onNavigate('/bill-history')}
            className="flex items-center gap-1 text-xs text-turmeric-400 font-bold hover:underline"
          >
            <span>View All Bills</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-charcoal-800 text-stone-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Bill No.</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Order Type</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-850">
              {recentBills.map(bill => (
                <tr key={bill._id} className="hover:bg-charcoal-850/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-white text-sm">{bill.orderNumber}</td>
                  <td className="py-3 text-stone-400 font-mono">
                    {new Date(bill.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-stone-300 max-w-xs truncate">
                    {bill.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 font-semibold text-stone-200">
                    {bill.orderType} {bill.orderType === 'Dine In' ? `(${bill.tableNumber})` : ''}
                  </td>
                  <td className="py-3">
                    <span className="bg-charcoal-800 text-stone-200 px-2 py-0.5 rounded text-[11px] font-bold">
                      {bill.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-extrabold text-turmeric-400 text-sm">
                    ₹{bill.grandTotal.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span className="bg-leaf-500/20 text-leaf-400 border border-leaf-500/40 px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase">
                      PAID
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onOpenBillDetail(bill)}
                      className="p-1.5 bg-charcoal-800 hover:bg-charcoal-750 text-stone-200 rounded-lg text-xs font-bold inline-flex items-center gap-1 border border-charcoal-700"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
