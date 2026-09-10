import React from 'react';
import { X, CheckCircle, FileText, Printer, DollarSign, ShoppingBag, PieChart } from 'lucide-react';
import { DailyClosingReport } from '../types';

interface CloseDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: DailyClosingReport | null;
}

export const CloseDayModal: React.FC<CloseDayModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-kovai-600 to-amber-700 p-4 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2 font-black text-base">
            <CheckCircle size={20} className="fill-slate-950" />
            <span>DAILY CLOSING REPORT SUMMARY</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-900/20 text-slate-950">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 font-sans text-xs">
          <div className="flex justify-between items-center bg-slate-850 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400">Date of Closing:</span>
              <h4 className="text-base font-bold text-white">{report.dateStr}</h4>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Closed By:</span>
              <h4 className="text-sm font-semibold text-kovai-400">{report.closedBy || 'Admin POS'}</h4>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Orders</span>
              <p className="text-xl font-bold text-white">{report.totalOrders}</p>
            </div>
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Cancelled Orders</span>
              <p className="text-xl font-bold text-red-400">{report.cancelledOrders}</p>
            </div>
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Gross Sales</span>
              <p className="text-xl font-bold text-emerald-400">₹{report.totalSales.toFixed(2)}</p>
            </div>
            <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Discounts Given</span>
              <p className="text-xl font-bold text-amber-400">₹{report.totalDiscount.toFixed(2)}</p>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2">
            <h5 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <PieChart size={14} className="text-kovai-400" />
              Payment Collection Breakdown
            </h5>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Cash Collections:</span>
              <span className="font-bold text-white">₹{report.cashSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">UPI Digital Payments:</span>
              <span className="font-bold text-white">₹{report.upiSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Card Payments:</span>
              <span className="font-bold text-white">₹{report.cardSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 font-extrabold text-sm text-kovai-400">
              <span>NET DAY REVENUE:</span>
              <span>₹{report.netSales.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-between">
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 transition-all"
          >
            <Printer size={15} />
            <span>Print Closing Report</span>
          </button>
          <button
            onClick={onClose}
            className="bg-kovai-500 hover:bg-kovai-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
