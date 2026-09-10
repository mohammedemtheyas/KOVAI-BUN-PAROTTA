import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle, Flame, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';

export const KitchenDisplay: React.FC = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');

  useEffect(() => {
    fetchKdsOrders();
    const interval = setInterval(fetchKdsOrders, 5000); // Live poll kitchen queue
    return () => clearInterval(interval);
  }, []);

  const fetchKdsOrders = async () => {
    try {
      const orders = await api.getKdsActiveOrders();
      setActiveOrders(orders);
    } catch (err) {
      console.error('KDS load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceStatus = async (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'PREPARING';
    if (currentStatus === 'NEW') nextStatus = 'PREPARING';
    else if (currentStatus === 'PREPARING') nextStatus = 'READY';
    else if (currentStatus === 'READY') nextStatus = 'COMPLETED';

    try {
      await api.updateOrderStatus(orderId, nextStatus);
      fetchKdsOrders();
    } catch (err) {
      alert('Failed to update kitchen status');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-red-500 text-white font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider animate-pulse">NEW ORDER</span>;
      case 'PREPARING':
        return <span className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider">PREPARING 🍳</span>;
      case 'READY':
        return <span className="bg-emerald-500 text-slate-950 font-extrabold px-3 py-1 rounded-lg text-xs tracking-wider">READY TO SERVE 🔔</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 font-bold px-3 py-1 rounded-lg text-xs">COMPLETED</span>;
    }
  };

  const getElapsedTimeStr = (createdAt: string) => {
    const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <ChefHat size={26} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span>KITCHEN DISPLAY SYSTEM (KDS)</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                LIVE QUEUE
              </span>
            </h1>
            <p className="text-xs text-slate-400">Order preparation flow for Kovai Bun Parotta chefs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchKdsOrders}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Active Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 max-w-lg mx-auto space-y-3">
          <CheckCircle size={48} className="text-emerald-400 mx-auto stroke-[1.5]" />
          <h3 className="text-lg font-bold text-white">Kitchen Queue is Clear!</h3>
          <p className="text-xs text-slate-400">All pending food orders have been prepared and completed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeOrders.map(order => {
            const isNew = order.status === 'NEW';
            const isPreparing = order.status === 'PREPARING';
            const elapsedMins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
            const isUrgent = elapsedMins >= 15;

            return (
              <div
                key={order._id}
                className={`bg-slate-900 border-2 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all ${
                  isUrgent
                    ? 'border-red-500 bg-red-950/20'
                    : isNew
                    ? 'border-amber-500/80'
                    : isPreparing
                    ? 'border-emerald-500/60'
                    : 'border-slate-800'
                }`}
              >
                {/* Header info */}
                <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-white font-mono">{order.orderNumber}</h3>
                    <div className="text-xs text-amber-400 font-bold">
                      {order.orderType} {order.orderType === 'Dine In' ? `• ${order.tableNumber}` : ''}
                    </div>
                  </div>

                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400 mt-1 font-mono">
                      <Clock size={12} className={isUrgent ? 'text-red-400' : ''} />
                      <span className={isUrgent ? 'text-red-400 font-bold' : ''}>
                        {getElapsedTimeStr(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 flex-1 space-y-2.5 bg-slate-950/60">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800"
                    >
                      <div className="flex-1 pr-2">
                        <span className="font-extrabold text-base text-white block">
                          {item.name}
                        </span>
                        {item.notes && (
                          <span className="text-[11px] text-amber-400 italic block mt-0.5">
                            Note: "{item.notes}"
                          </span>
                        )}
                      </div>
                      <span className="w-8 h-8 rounded-lg bg-kovai-500/20 text-kovai-400 font-black text-base flex items-center justify-center border border-kovai-500/40 shrink-0 font-mono">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}

                  {order.notes && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-lg text-xs text-amber-300">
                      <strong>Order Notes:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Status Progression Action Button */}
                <div className="p-3 bg-slate-850 border-t border-slate-800">
                  {order.status === 'NEW' && (
                    <button
                      onClick={() => handleAdvanceStatus(order._id, 'NEW')}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Flame size={16} />
                      <span>START PREPARING</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleAdvanceStatus(order._id, 'PREPARING')}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <CheckCircle size={16} />
                      <span>MARK AS READY</span>
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleAdvanceStatus(order._id, 'READY')}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all"
                    >
                      <CheckCircle size={16} className="text-emerald-400" />
                      <span>COMPLETE & SERVED</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
