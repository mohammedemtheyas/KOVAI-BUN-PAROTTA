import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Award, 
  PieChart as PieChartIcon, 
  Calendar, 
  CheckCircle,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { SalesDashboardData, DailyClosingReport } from '../types';
import { api } from '../services/api';
import { CloseDayModal } from '../components/CloseDayModal';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

export const SalesDashboard: React.FC = () => {
  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Close Day modal
  const [closingReport, setClosingReport] = useState<DailyClosingReport | null>(null);
  const [isClosingOpen, setIsClosingOpen] = useState<boolean>(false);
  const [isClosingDay, setIsClosingDay] = useState<boolean>(false);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    setLoading(true);
    try {
      const res = await api.getSalesDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load sales analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCloseDay = async () => {
    if (!window.confirm('Are you sure you want to CLOSE THE DAY? This will generate today\'s final net sales and closing summary.')) return;
    setIsClosingDay(true);
    try {
      const res = await api.closeDay('Admin POS Manager');
      setClosingReport(res.report);
      setIsClosingOpen(true);
    } catch (err: any) {
      alert(`Close day failed: ${err.message}`);
    } finally {
      setIsClosingDay(false);
    }
  };

  const PIE_COLORS = ['#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kovai-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <BarChart3 size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              SALES ANALYTICS & DAILY REPORTS
            </h1>
            <p className="text-xs text-slate-400">Executive financial dashboard for Kovai Bun Parotta</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSalesData}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleTriggerCloseDay}
            disabled={isClosingDay}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-lg transition-all"
          >
            <FileCheck size={16} />
            <span>{isClosingDay ? 'Closing Day...' : 'CLOSE DAY & GENERATE REPORT'}</span>
          </button>
        </div>
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-12">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-32 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Key Performance Indicators (KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Today's Sales */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-kovai-500/10 rounded-full blur-2xl"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TODAY'S SALES</span>
              <div className="text-3xl font-black text-amber-400 font-mono mt-2">
                ₹{data.todaySales.toFixed(2)}
              </div>
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp size={13} /> Gross Revenue Collected Today
              </p>
            </div>

            {/* Total Orders */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL ORDERS</span>
              <div className="text-3xl font-black text-white font-mono mt-2">
                {data.totalOrdersCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                <ShoppingBag size={13} className="text-kovai-400" /> Completed & Active Bills
              </p>
            </div>

            {/* Average Order Value */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AVERAGE ORDER VALUE</span>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-2">
                ₹{data.avgOrderValue}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Per customer table spending</p>
            </div>

            {/* Best Selling Item */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-kovai-500/30 shadow-lg relative">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">🔥 BEST SELLING ITEM</span>
              <div className="text-xl font-extrabold text-white mt-2 truncate">
                {data.bestSellingItem}
              </div>
              <p className="text-[11px] text-amber-400 mt-2 flex items-center gap-1 font-semibold">
                <Award size={13} /> Most Ordered Dish Today
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 7-Day Revenue Trend Bar Chart */}
            <div className="lg:col-span-2 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} className="text-kovai-400" />
                7-Day Sales Trend (₹ Revenue)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.dailySalesChart}>
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`₹${val}`, 'Sales']}
                    />
                    <Bar dataKey="totalSales" fill="#d97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Method Split Pie Chart */}
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieChartIcon size={16} className="text-kovai-400" />
                Payment Collection Breakdown
              </h3>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.paymentBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {data.paymentBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`₹${val}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                {data.paymentBreakdown.map((item, idx) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                      <span className="text-slate-300 font-semibold">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">₹{item.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Closing Report Modal */}
      <CloseDayModal
        isOpen={isClosingOpen}
        onClose={() => setIsClosingOpen(false)}
        report={closingReport}
      />
    </div>
  );
};
