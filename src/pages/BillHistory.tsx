import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  RefreshCw, 
  Eye, 
  Printer, 
  XCircle, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { ReceiptModal } from '../components/ReceiptModal';

export const BillHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickDateFilter, setQuickDateFilter] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterPayment, setFilterPayment] = useState<string>('ALL');

  // Selected Order for Receipt modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, [filterType, filterPayment]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders({
        search: searchQuery,
        orderType: filterType,
        paymentMethod: filterPayment,
        status: 'ALL'
      });
      setOrders(data);
    } catch (err) {
      console.error('Error fetching bill history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBill = (order: Order) => {
    setSelectedOrder(order);
    setIsReceiptOpen(true);
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderNumber}?`)) return;
    try {
      await api.updateOrderStatus(orderId, 'CANCELLED');
      fetchOrders();
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  // Filter bills by quick date buttons
  const filteredOrders = orders.filter(o => {
    const oDate = new Date(o.createdAt);
    const now = new Date();

    if (quickDateFilter === 'TODAY') {
      const isToday = oDate.toDateString() === now.toDateString();
      if (!isToday) return false;
    } else if (quickDateFilter === 'YESTERDAY') {
      const yest = new Date(now);
      yest.setDate(now.getDate() - 1);
      if (oDate.toDateString() !== yest.toDateString()) return false;
    } else if (quickDateFilter === 'WEEK') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
      if (oDate < weekAgo) return false;
    } else if (quickDateFilter === 'MONTH') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
      if (oDate < monthAgo) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) ||
             o.tableNumber.toLowerCase().includes(q) ||
             o.cashierName.toLowerCase().includes(q) ||
             o.items.some(i => i.name.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-charcoal-950 text-stone-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-charcoal-900 p-5 rounded-3xl border border-charcoal-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-chilli-600 to-chilli-800 flex items-center justify-center text-white font-black shadow-lg">
            <History size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">
              HISTORICAL BILLS REPOSITORY (100 SEEDED BILLS)
            </h1>
            <p className="text-xs text-stone-400">Search, filter, and reprint past Kovai restaurant receipts</p>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-charcoal-800 hover:bg-charcoal-750 text-stone-200 px-4 py-2 rounded-xl text-xs font-bold border border-charcoal-700 transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-charcoal-900 p-5 rounded-3xl border border-charcoal-800 shadow-lg space-y-4">
        
        {/* Quick Date Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-extrabold text-stone-400 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <Calendar size={14} className="text-turmeric-400" /> Quick Date Range:
          </span>
          {[
            { label: 'All Past 30 Days', key: 'ALL' },
            { label: 'Today', key: 'TODAY' },
            { label: 'Yesterday', key: 'YESTERDAY' },
            { label: 'This Week', key: 'WEEK' },
            { label: 'This Month', key: 'MONTH' },
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setQuickDateFilter(btn.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                quickDateFilter === btn.key
                  ? 'bg-chilli-700 text-white shadow'
                  : 'bg-charcoal-850 text-stone-400 hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search & Selectors */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Bill #KB-1021, Table, Item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal-950 border border-charcoal-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-turmeric-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-charcoal-950 text-stone-200 text-xs font-bold border border-charcoal-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Order Types</option>
              <option value="Dine In">Dine In</option>
              <option value="Takeaway">Takeaway</option>
              <option value="Parcel">Parcel</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-charcoal-950 text-stone-200 text-xs font-bold border border-charcoal-800 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bill Records Table */}
      <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-charcoal-850 border-b border-charcoal-800 text-stone-400 font-bold uppercase tracking-wider">
                <th className="p-4">Bill No.</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Type / Table</th>
                <th className="p-4">Items Breakdown</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-850">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-400">
                    Loading 100 historical bills...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No historical bills found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-charcoal-850/50 transition-colors">
                    <td className="p-4 font-mono font-black text-white text-sm">
                      {order.orderNumber}
                    </td>

                    <td className="p-4 text-stone-300">
                      <div>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-white">{order.orderType}</span>
                      {order.orderType === 'Dine In' && (
                        <span className="block text-[10px] text-turmeric-400 font-mono">{order.tableNumber}</span>
                      )}
                    </td>

                    <td className="p-4 max-w-xs truncate text-stone-300">
                      {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                    </td>

                    <td className="p-4 font-mono font-black text-turmeric-400 text-sm">
                      ₹{order.grandTotal.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span className="bg-charcoal-800 text-stone-200 border border-charcoal-700 font-extrabold px-2.5 py-1 rounded-lg text-[11px]">
                        {order.paymentMethod}
                      </span>
                    </td>

                    <td className="p-4">
                      {order.status === 'CANCELLED' ? (
                        <span className="bg-chilli-950 text-chilli-400 border border-chilli-700/50 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          CANCELLED
                        </span>
                      ) : (
                        <span className="bg-leaf-950 text-leaf-400 border border-leaf-600/40 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                          PAID
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenBill(order)}
                          className="flex items-center gap-1 bg-chilli-700 hover:bg-chilli-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow transition-all"
                        >
                          <Printer size={13} />
                          <span>Reprint</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal
        order={selectedOrder}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
