import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Map, 
  ShieldCheck, 
  TrendingDown, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  Building2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { DemandResponseSimulation } from '../types';
import { api } from '../services/api';

interface ValidationRoadmapProps {
  onNavigate: (route: string) => void;
}

export const ValidationRoadmap: React.FC<ValidationRoadmapProps> = ({ onNavigate }) => {
  const [drSimulation, setDrSimulation] = useState<DemandResponseSimulation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    loadDrData();
  }, []);

  const loadDrData = async () => {
    setLoading(true);
    try {
      const data = await api.getDemandResponse();
      setDrSimulation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShift = async () => {
    if (!drSimulation) return;
    const newState = !drSimulation.isShiftActive;
    try {
      const updated = await api.togglePeakShift(newState);
      setDrSimulation(updated);
      setFeedback(newState ? 'Flexible peak load shift activated! 1.2 kW shifted.' : 'Demand response returned to normal baseline.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Zap className="text-emerald-400" />
              <span>DEMAND RESPONSE, VALIDATION & ROADMAP</span>
            </h1>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Prototype Simulation
            </span>
          </div>
          <p className="text-xs text-slate-400">Grid Peak-Load Shifting, Validation Feasibility & Milestones</p>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* SECTION 8: GRID-RESPONSIVE BUILDING & DEMAND RESPONSE SIMULATION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">SECTION 08</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              GRID-RESPONSIVE BUILDING
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
            Prototype Simulation
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          “When peak demand is detected, the platform identifies flexible loads that can be shifted without significantly affecting occupants.”
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-semibold">Normal Load</span>
            <span className="font-mono text-2xl font-black text-slate-200">5.6 kW</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30">
            <span className="text-[11px] text-amber-400 block font-semibold">Predicted Peak</span>
            <span className="font-mono text-2xl font-black text-amber-400">6.4 kW</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
            <span className="text-[11px] text-emerald-400 block font-semibold">Recommended Shift</span>
            <span className="font-mono text-2xl font-black text-emerald-400">1.2 kW</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/30">
            <span className="text-[11px] text-teal-400 block font-semibold">Post-Optimization</span>
            <span className="font-mono text-2xl font-black text-teal-300">
              {drSimulation?.isShiftActive ? '5.2 kW' : '5.2 kW (Target)'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-bold text-white block">Simulation Control:</span>
            <span className="text-[11px] text-slate-400">
              {drSimulation?.isShiftActive ? 'Peak Shift Active (-1.2 kW)' : 'Normal Load Curve'}
            </span>
          </div>

          <button
            onClick={handleToggleShift}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all font-mono ${
              drSimulation?.isShiftActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {drSimulation?.isShiftActive ? 'Deactivate Load Shift' : 'Trigger Grid Load Shift (-1.2 kW)'}
          </button>
        </div>
      </div>

      {/* SECTION 11: VALIDATION & FEASIBILITY */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">SECTION 11</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              VALIDATION & FEASIBILITY
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            Testing Planned
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          Prototype testing with 3–5 users / building operators will quantitatively evaluate performance across the following 7 target metrics:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { metric: 'Energy consumption before vs after optimization', target: 'Target: > 15% Reduction' },
            { metric: 'Time required to identify an energy issue', target: 'Target: < 2 Minutes' },
            { metric: 'Dashboard task completion time', target: 'Target: < 45 Seconds' },
            { metric: 'UI error rate', target: 'Target: < 2%' },
            { metric: 'Alert accuracy', target: 'Target: > 95%' },
            { metric: 'Sensor reliability', target: 'Target: 99.9% Uptime' },
            { metric: 'Occupant comfort feedback', target: 'Target: > 90% Satisfaction' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white block">{item.metric}</span>
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded inline-block border border-amber-500/20">
                Testing Planned • {item.target}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 12: ROADMAP */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">SECTION 12</span>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            PROJECT ROADMAP
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[
            { phase: 'Phase 01', title: 'Prototype', desc: 'IoT sensors + dashboard', active: true },
            { phase: 'Phase 02', title: 'AI Prediction', desc: 'Energy-demand forecasting', active: false },
            { phase: 'Phase 03', title: 'Smart Control', desc: 'Lighting + HVAC optimization', active: false },
            { phase: 'Phase 04', title: 'Demand Response', desc: 'Peak-load shifting', active: false },
            { phase: 'Phase 05', title: 'Real Building Deployment', desc: 'Pilot testing and validation', active: false }
          ].map((p, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-3xl border space-y-2 ${
                p.active
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[10px] font-mono font-bold uppercase block">{p.phase}</span>
              <h4 className="font-bold text-sm text-white">{p.title}</h4>
              <p className="text-xs text-slate-400 leading-tight">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 15: FINAL CTA */}
      <div className="relative rounded-3xl bg-slate-900 border border-emerald-500/40 p-8 text-center space-y-6 shadow-2xl">
        <h2 className="text-3xl font-black text-white uppercase">MAKE EVERY SQUARE METRE SMARTER.</h2>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Monitor energy. Understand occupancy. Predict demand. Optimize operations. Improve comfort.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
          >
            View Dashboard
          </button>
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold text-xs uppercase border border-slate-700"
          >
            Explore Technology
          </button>
        </div>

        <div className="text-xs font-bold text-slate-400">Team: <span className="text-emerald-400">TECHNOVA</span></div>
      </div>

    </div>
  );
};
