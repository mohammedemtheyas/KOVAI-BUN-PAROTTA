import React from 'react';
import { X, Printer, Building2, CheckCircle2, FileText, Activity } from 'lucide-react';

interface BuildingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: any;
}

export const ReceiptModal: React.FC<BuildingReportModalProps> = ({
  isOpen,
  onClose,
  reportData
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl transition-all"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">ENERGY AUDIT REPORT</h3>
            <p className="text-xs text-slate-400">TECHNOVA Smart Buildings Prototype</p>
          </div>
        </div>

        {/* Printable thermal style / clean audit report card */}
        <div id="printable-thermal-receipt" className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs text-slate-200">
          <div className="text-center pb-3 border-b border-dashed border-slate-800">
            <h4 className="font-bold text-emerald-400 text-sm">TECHNOVA SMART BUILDINGS</h4>
            <p className="text-[10px] text-slate-400">Low-cost IoT & AI/ML Energy Management</p>
            <p className="text-[10px] text-slate-500 mt-1">Audit Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span>Energy Today:</span>
              <span className="font-bold text-emerald-400">24.8 kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Current Power:</span>
              <span className="font-bold text-white">4.2 kW</span>
            </div>
            <div className="flex justify-between">
              <span>Building Occupancy:</span>
              <span className="font-bold text-white">68%</span>
            </div>
            <div className="flex justify-between">
              <span>Indoor Temperature:</span>
              <span className="font-bold text-white">24.6°C</span>
            </div>
            <div className="flex justify-between">
              <span>CO₂ Concentration:</span>
              <span className="font-bold text-white">720 ppm</span>
            </div>
            <div className="flex justify-between">
              <span>Energy Saving:</span>
              <span className="font-bold text-emerald-400">18.4%</span>
            </div>
            <div className="flex justify-between">
              <span>Comfort Score:</span>
              <span className="font-bold text-emerald-400">94 / 100</span>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-slate-800 text-[10px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300 uppercase">System Status:</p>
            <p>• IoT ESP32 Sensors: Operational (7/7 Online)</p>
            <p>• Machine Learning Model: Active Demand Forecasting</p>
            <p>• Peak-Load Shift: Ready (1.2 kW flexible load available)</p>
            <p>• Label: Prototype Simulation</p>
          </div>

          <div className="text-center pt-2 text-[10px] text-emerald-400 font-bold">
            “Making every square metre smarter, greener, and more comfortable.”
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs rounded-2xl border border-slate-700 transition-all"
          >
            Close Report
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Printer size={16} />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
