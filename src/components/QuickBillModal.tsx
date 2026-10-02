import React, { useState } from 'react';
import { X, Zap, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

interface QuickControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QuickBillModal: React.FC<QuickControlModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [selectedShiftKw, setSelectedShiftKw] = useState<number>(1.2);

  if (!isOpen) return null;

  const handleExecuteShift = async () => {
    setLoading(true);
    try {
      await api.togglePeakShift(true);
      setSuccessMsg('Peak Load Reduction executed! Flexible HVAC and lighting loads shifted by 1.2 kW.');
      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) onSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">QUICK PEAK LOAD SHIFT</h3>
            <p className="text-xs text-slate-400">Demand Response Emergency Override</p>
          </div>
        </div>

        {successMsg ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
            <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{successMsg}</span>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-750 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Grid Demand Status:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <ShieldAlert size={14} /> Peak Tariff Imminent
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Target Flexible Shift:</span>
                <span className="text-emerald-400 font-mono font-bold">{selectedShiftKw} kW</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Post-Shift Building Load:</span>
                <span className="text-white font-mono font-bold">5.2 kW (from 6.4 kW)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Flexible Shift Magnitude:</label>
              <div className="grid grid-cols-3 gap-2">
                {[0.8, 1.2, 1.8].map(val => (
                  <button
                    key={val}
                    onClick={() => setSelectedShiftKw(val)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold font-mono transition-all ${
                      selectedShiftKw === val
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    -{val} kW
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-2xl border border-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteShift}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sliders size={16} />
                <span>{loading ? 'Executing Shift...' : 'Trigger Peak Shift'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
