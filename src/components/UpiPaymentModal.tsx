import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  grandTotal: number;
  orderNumber: string;
  onConfirmPayment: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  grandTotal,
  orderNumber,
  onConfirmPayment
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-850 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-kovai-400" />
            <h3 className="font-bold text-sm text-white">Scan UPI QR Code</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-2 text-xs text-slate-400">
            Order <strong className="text-white">{orderNumber}</strong> Total Amount
          </div>
          <div className="text-3xl font-extrabold text-amber-400 mb-4 font-mono">
            ₹{grandTotal.toFixed(2)}
          </div>

          {/* QR Box */}
          <div className="bg-white p-4 rounded-2xl inline-block shadow-lg border-2 border-kovai-500/40 relative">
            <svg viewBox="0 0 100 100" className="w-44 h-44 mx-auto">
              <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
              {/* Corner Targets */}
              <rect x="10" y="10" width="25" height="25" fill="#000000" />
              <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="18" y="18" width="9" height="9" fill="#000000" />

              <rect x="65" y="10" width="25" height="25" fill="#000000" />
              <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
              <rect x="73" y="18" width="9" height="9" fill="#000000" />

              <rect x="10" y="65" width="25" height="25" fill="#000000" />
              <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
              <rect x="18" y="73" width="9" height="9" fill="#000000" />

              {/* Data Blocks */}
              <rect x="40" y="12" width="10" height="10" fill="#000000" />
              <rect x="45" y="25" width="12" height="8" fill="#000000" />
              <rect x="12" y="42" width="14" height="12" fill="#000000" />
              <rect x="32" y="38" width="30" height="30" fill="#000000" />
              <rect x="38" y="44" width="18" height="18" fill="#ffffff" />
              <rect x="42" y="48" width="10" height="10" fill="#d97706" />
              <rect x="70" y="45" width="15" height="12" fill="#000000" />
              <rect x="68" y="65" width="18" height="18" fill="#000000" />
              <rect x="45" y="75" width="15" height="10" fill="#000000" />
            </svg>
            <p className="text-[10px] text-slate-700 font-mono font-bold mt-2">
              UPI ID: kovaibunparotta@upi
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-1.5 px-3 rounded-lg border border-emerald-500/30">
            <ShieldCheck size={16} />
            <span>GPay, PhonePe, Paytm, BHIM Accepted</span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-850 border-t border-slate-800">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all"
          >
            {isProcessing ? (
              <span className="animate-pulse">Verifying UPI Payment...</span>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Simulate UPI Payment Success</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
