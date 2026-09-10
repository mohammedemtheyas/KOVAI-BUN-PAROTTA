import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, Heart } from 'lucide-react';
import { Order } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, isOpen, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 160]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 80, 160);
      pdf.save(`Receipt_${order.orderNumber}.pdf`);
    } catch (err) {
      console.error('PDF export error', err);
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-slate-850 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={20} />
            <h3 className="font-bold text-sm text-white">Bill Generated Successfully</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Receipt Container (Scrollable Preview) */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex justify-center">
          <div
            id="printable-thermal-receipt"
            ref={receiptRef}
            className="w-[280px] bg-white text-black p-5 rounded-md font-mono text-xs shadow-md border border-slate-200 leading-tight select-text"
          >
            {/* Restaurant Brand Header */}
            <div className="text-center pb-3 border-b border-dashed border-gray-400">
              <h2 className="font-extrabold text-base tracking-tight uppercase">KOVAI BUN PAROTTA</h2>
              <p className="text-[10px] text-gray-600 font-sans italic">Authentic South Indian Flavours</p>
              <p className="text-[9px] text-gray-500 mt-1">Cross Cut Road, Gandhipuram, Kovai</p>
              <p className="text-[9px] text-gray-500">GSTIN: 33ABCDE1234F1Z5 | Ph: 98765 43210</p>
            </div>

            {/* Order Details */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px]">
              <div className="flex justify-between">
                <span className="font-bold">Order #:</span>
                <span className="font-bold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span>{formattedDate} | {formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Type / Table:</span>
                <span className="font-semibold">{order.orderType} {order.orderType === 'Dine In' ? `(${order.tableNumber})` : ''}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{order.cashierName || 'Cashier'}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-2 border-b border-dashed border-gray-400">
              <div className="flex justify-between font-bold pb-1 text-[10px] uppercase border-b border-gray-300">
                <span className="w-1/2">Item</span>
                <span className="w-1/6 text-center">Qty</span>
                <span className="w-1/3 text-right">Price</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 text-[11px]">
                  <span className="w-1/2 truncate font-sans font-medium">{item.name}</span>
                  <span className="w-1/6 text-center font-bold">x{item.quantity}</span>
                  <span className="w-1/3 text-right">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-1">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Discount:</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>GST ({order.taxRate || 5}%):</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm border-t border-black pt-1 mt-1">
                <span>TOTAL:</span>
                <span>₹{order.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="py-2 border-b border-dashed border-gray-400 text-[10px]">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold">{order.paymentMethod}</span>
              </div>
              {order.paymentMethod === 'Cash' && (
                <>
                  <div className="flex justify-between">
                    <span>Cash Received:</span>
                    <span>₹{order.amountReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Change Returned:</span>
                    <span className="font-bold">₹{order.change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Message */}
            <div className="text-center pt-3 text-[10px]">
              <p className="font-bold font-sans">Thank you!</p>
              <p className="flex items-center justify-center gap-1 font-sans mt-0.5 text-red-600 font-semibold">
                Visit Again <Heart size={10} className="fill-red-600" />
              </p>
              <p className="text-[8px] text-gray-400 mt-2 font-mono">Software by Kovai POS v2.4</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex flex-wrap gap-2 justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-kovai-500 to-amber-600 hover:from-kovai-600 hover:to-amber-700 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-kovai-500/20 transition-all"
            >
              <Printer size={15} />
              <span>Print Thermal Bill</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-700 transition-all"
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs border border-slate-700 transition-all"
          >
            New Order
          </button>
        </div>
      </div>
    </div>
  );
};
