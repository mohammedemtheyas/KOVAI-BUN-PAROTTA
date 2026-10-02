import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  TrendingDown, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Cpu, 
  Sparkles,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AiRecommendation, HourlyChartData } from '../types';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const AiAnalytics: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    loadAiData();
  }, []);

  const loadAiData = async () => {
    setLoading(true);
    try {
      const [recs, chart] = await Promise.all([
        api.getAiRecommendations(),
        api.getHourlyChartData()
      ]);
      setRecommendations(recs);
      setHourlyData(chart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRec = async (id: string) => {
    try {
      await api.applyAiRecommendation(id);
      setRecommendations(prev => prev.map(r => r.id === id ? { ...r, isApplied: true } : r));
      setFeedback('AI Recommendation applied! Building power updated.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <BrainCircuit className="text-emerald-400" />
              <span>AI ENERGY INTELLIGENCE</span>
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Machine Learning Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">Demand Forecasting, Anomaly Detection & Rule-Based Optimization</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <Sparkles size={14} className="text-cyan-400" />
          <span className="text-slate-300">Next-Hour Predicted Demand:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">4.8 kW</span>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* THREE CORE EXPLANATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Machine Learning */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Cpu size={20} />
          </div>
          <h3 className="text-base font-bold text-white uppercase">Machine Learning</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Energy-demand forecasting based on historical energy consumption, occupancy, temperature and time.
          </p>
        </div>

        {/* Rule-Based Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Sliders size={20} />
          </div>
          <h3 className="text-base font-bold text-white uppercase">Rule-Based Control</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Controls or recommends actions for lighting, HVAC and other flexible loads based on occupancy and operating conditions.
          </p>
        </div>

        {/* Analytics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <BarChart3 size={20} />
          </div>
          <h3 className="text-base font-bold text-white uppercase">Analytics</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Detects abnormal energy consumption and provides actionable recommendations.
          </p>
        </div>
      </div>

      {/* PREDICTION CHART SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <TrendingDown size={18} className="text-emerald-400" />
              <span>ACTUAL ENERGY VS PREDICTED ENERGY</span>
            </h3>
            <p className="text-xs text-slate-400">ML Forecast Model vs Real-Time ESP32 Smart Meter Telemetry</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-emerald-400">
            Next-hour predicted demand: 4.8 kW
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="predGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit=" kW" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="actualEnergyKw" name="Actual Energy (kW)" stroke="#10b981" fill="url(#actGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="predictedEnergyKw" name="Predicted Energy (kW)" stroke="#06b6d4" strokeDasharray="4 4" fill="url(#predGrad2)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI RECOMMENDATIONS LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400" />
          <span>ACTIONABLE AI RECOMMENDATIONS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-5 rounded-3xl border transition-all space-y-3 ${
                rec.isApplied
                  ? 'bg-slate-950 border-emerald-500/40 opacity-80'
                  : 'bg-slate-950 border-slate-800 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {rec.actionType} • {rec.zone}
                  </span>
                  <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400">
                  -{rec.potentialSavingsKw} kW
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-850 text-xs">
                <span className="text-slate-400 text-[11px]">AI Confidence: {rec.confidence}%</span>

                {rec.isApplied ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 size={14} /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyRec(rec.id)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1 shadow-md shadow-emerald-500/20"
                  >
                    <span>Apply Recommendation</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
