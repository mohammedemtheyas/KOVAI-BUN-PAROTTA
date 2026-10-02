import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sun, 
  Thermometer, 
  Wind, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Power,
  RotateCcw
} from 'lucide-react';
import { ControllableSystem, SystemControlMode } from '../types';
import { api } from '../services/api';

export const IntelligentControl: React.FC = () => {
  const [systems, setSystems] = useState<ControllableSystem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    setLoading(true);
    try {
      const data = await api.getControllableSystems();
      setSystems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (id: string, newMode: SystemControlMode) => {
    try {
      const updated = await api.updateSystemControl(id, newMode);
      setSystems(prev => prev.map(s => s.id === id ? updated : s));
      setFeedback(`System mode updated to ${newMode} successfully! Live building load recalculating...`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LIGHTING': return Sun;
      case 'HVAC': return Thermometer;
      case 'FANS': return Wind;
      case 'FLEXIBLE LOAD': return Zap;
      default: return Sliders;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Sliders className="text-emerald-400" />
              <span>INTELLIGENT EQUIPMENT CONTROL</span>
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Closed-Loop Automation
            </span>
          </div>
          <p className="text-xs text-slate-400">Automated Occupancy-Driven Controls & Manual Operator Override</p>
        </div>

        <button
          onClick={loadSystems}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all"
        >
          <RotateCcw size={14} />
          <span>Reset Defaults</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Visual Workflow Steps Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
        <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">CONTROL PIPELINE</h3>
        <div className="text-sm font-black text-white tracking-wider flex flex-wrap items-center gap-2 font-mono">
          <span>IoT Sensors</span>
          <span className="text-slate-600">↓</span>
          <span>Real-Time Building Data</span>
          <span className="text-slate-600">↓</span>
          <span>AI Energy Analytics</span>
          <span className="text-slate-600">↓</span>
          <span>Demand Prediction</span>
          <span className="text-slate-600">↓</span>
          <span className="text-emerald-400">Smart Control</span>
          <span className="text-slate-600">↓</span>
          <span className="text-cyan-400">Energy + Comfort Optimization</span>
        </div>
      </div>

      {/* Controllable Systems List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systems.map((sys) => {
          const Icon = getCategoryIcon(sys.category);

          return (
            <div
              key={sys.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 hover:border-emerald-500/40 transition-all shadow-xl"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white uppercase tracking-tight">{sys.name}</h3>
                    <span className="text-xs text-slate-400 block">{sys.zone}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Active Power Draw</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">{sys.powerKw} kW</span>
                </div>
              </div>

              {/* Setpoint / Mode details */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 flex justify-between items-center text-xs">
                <span className="text-slate-400">Setpoint / Target:</span>
                <span className="font-mono font-bold text-white">{sys.setpoint}</span>
              </div>

              {/* Controllable Mode Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Control Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {sys.allowedModes.map((mode) => {
                    const isActive = sys.currentMode === mode;

                    return (
                      <button
                        key={mode}
                        onClick={() => handleModeChange(sys.id, mode)}
                        className={`py-3 px-3 rounded-2xl border text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Power size={13} />
                        <span>{mode}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex justify-between items-center pt-2 border-t border-slate-850">
                <span>Occupancy Driven: {sys.occupancyDriven ? 'YES (Automated)' : 'NO (Scheduled)'}</span>
                <span className="text-emerald-400 font-bold">Feedback Loop Active</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
