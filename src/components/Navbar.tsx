import React, { useState, useEffect } from 'react';
import { Building2, Clock, Zap, LogOut, Activity, Cpu, LayoutDashboard, Compass } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenQuickBill: () => void; // Used as Quick Control / Load Shift drawer trigger
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenQuickBill,
  onLogout
}) => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/20 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-lg">
      {/* Brand & Smart Building Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
          <Building2 size={22} className="text-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
              SMART BUILDINGS
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold px-2 py-0.5 rounded-md hidden sm:inline-block">
              TECHNOVA
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/80 font-medium tracking-wide">
            Energy Efficiency & Occupant Experience
          </p>
        </div>
      </div>

      {/* Center Status, Live Gateway Telemetry & Clock */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Gateway Pulse */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Cpu size={14} className="text-emerald-400" />
          <span className="font-semibold text-slate-200">ESP32 IoT Mesh</span>
          <span className="text-slate-600">|</span>
          <Activity size={14} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 font-mono">AI Model: Active</span>
        </div>

        {/* Live Clock */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 font-mono">
          <Clock size={14} className="text-emerald-400" />
          <span className="font-bold text-emerald-400">{time}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{date}</span>
        </div>

        {/* Quick Control Drawer Hotkey */}
        <button
          onClick={onOpenQuickBill}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap size={14} className="fill-slate-950" />
          <span>QUICK LOAD SHIFT</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onNavigate('/')}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
            currentRoute === '/'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
              : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
          }`}
        >
          <Compass size={14} />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <button
          onClick={() => onNavigate('/dashboard')}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
            currentRoute === '/dashboard'
              ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
              : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border-emerald-500/30'
          }`}
        >
          <LayoutDashboard size={14} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={onLogout}
          title="Sign Out Building Operator"
          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-700/60 transition-all"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
};
