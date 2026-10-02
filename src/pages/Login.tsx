import React, { useState } from 'react';
import { Building2, KeyRound, ShieldCheck, ArrowRight, Activity, Cpu } from 'lucide-react';
import { api } from '../services/api';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(username, password);
      localStorage.setItem('smart_building_token', res.token);
      onLoginSuccess(res.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Radial Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 border border-emerald-400">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">SMART BUILDINGS</h1>
            <p className="text-xs text-emerald-400 font-bold tracking-wide">TECHNOVA BMS PORTAL</p>
          </div>
          <p className="text-xs text-slate-400 italic">“Making every square metre smarter, greener, and more comfortable.”</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Operator Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Control Portal'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500 space-y-1 border-t border-slate-800">
          <div className="flex justify-center items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck size={13} />
            <span>Prototype Simulation • Role: Building Manager</span>
          </div>
          <p>ESP32 Gateway Mesh & ML Forecasting Online</p>
        </div>
      </div>
    </div>
  );
};
