import React, { useState, useEffect } from 'react';
import { X, Zap, Plus, ShoppingBag, Command } from 'lucide-react';
import { MenuItem } from '../types';

interface QuickBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  quickBillItems: MenuItem[];
  onAddItem: (item: MenuItem, quantity: number) => void;
}

export const QuickBillModal: React.FC<QuickBillModalProps> = ({
  isOpen,
  onClose,
  quickBillItems,
  onAddItem
}) => {
  const [selectedKey, setSelectedKey] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const keyNum = parseInt(e.key, 10);
        const item = quickBillItems.find(i => i.quickBillKey === keyNum);
        if (item) {
          onAddItem(item, quantity);
          setSelectedKey(keyNum);
          setTimeout(() => setSelectedKey(null), 300);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, quickBillItems, quantity, onAddItem, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-kovai-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl shadow-kovai-500/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-kovai-600 to-amber-700 p-4 flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2 font-black text-base">
            <Zap size={20} className="fill-slate-950" />
            <span>QUICK BILL MODE (Rush Hour Speed)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-900/20 text-slate-950 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 bg-slate-850 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Default Quantity Multiplier:</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 5, 10].map(qty => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    quantity === qty
                      ? 'bg-kovai-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  x{qty}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <Command size={14} className="text-kovai-400" />
            <span>Press keys <strong>1 - 5</strong> on your keyboard to instantly add to bill:</span>
          </p>

          {/* Hotkey Cards */}
          <div className="grid grid-cols-1 gap-2.5">
            {quickBillItems.map((item) => {
              const key = item.quickBillKey;
              const isFlashing = selectedKey === key;

              return (
                <button
                  key={item._id}
                  onClick={() => {
                    onAddItem(item, quantity);
                    setSelectedKey(key || null);
                    setTimeout(() => setSelectedKey(null), 300);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isFlashing
                      ? 'bg-kovai-500 text-slate-950 border-kovai-400 scale-[1.02]'
                      : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold text-base flex items-center justify-center border border-amber-500/40">
                      {key}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm leading-none">{item.name}</h4>
                      <span className="text-xs text-kovai-400 font-semibold">₹{item.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2 py-1 rounded">
                      + Add x{quantity}
                    </span>
                    <Plus size={16} className="text-kovai-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Press <strong>ESC</strong> to exit Quick Bill</span>
          <button
            onClick={onClose}
            className="bg-kovai-500 hover:bg-kovai-600 text-slate-950 font-bold px-4 py-2 rounded-xl transition-all"
          >
            Done & View Cart
          </button>
        </div>
      </div>
    </div>
  );
};
