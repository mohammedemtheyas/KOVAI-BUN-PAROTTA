import React from 'react';
import { 
  Compass,
  LayoutDashboard, 
  Radio, 
  Sliders, 
  BrainCircuit, 
  Zap, 
  Bell, 
  Database, 
  Map, 
  LogOut,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, onLogout }) => {
  const navItems = [
    { label: 'Solution Overview', icon: Compass, route: '/' },
    { label: 'Smart Dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Live Sensors', icon: Radio, route: '/sensors' },
    { label: 'Intelligent Control', icon: Sliders, route: '/controls' },
    { label: 'AI Energy Intelligence', icon: BrainCircuit, route: '/analytics' },
    { label: 'Demand Response', icon: Zap, route: '/demand-response' },
    { label: 'Live Alerts', icon: Bell, route: '/alerts' },
    { label: 'DB & Architecture', icon: Database, route: '/architecture' },
    { label: 'Validation & Roadmap', icon: Map, route: '/roadmap' },
  ];

  return (
    <aside className="w-16 md:w-60 bg-slate-900 border-r border-emerald-500/20 flex flex-col justify-between shrink-0 select-none py-4">
      <div className="flex flex-col gap-1">
        
        {/* Brand Sidebar Pill */}
        <div className="px-3 mb-3 hidden md:block">
          <div className="flex items-center gap-2.5 bg-slate-800/80 p-2.5 rounded-xl border border-emerald-500/20 shadow-inner">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
              <Building2 size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-none">TECHNOVA</span>
              <span className="text-[10px] text-emerald-400 font-mono">BMS Prototype v1.0</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`flex items-center gap-3 px-3.5 md:px-4 py-2.5 mx-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold shadow-lg shadow-emerald-900/40 border border-emerald-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'} />
              <span className="hidden md:inline-block tracking-wide truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Simulation Badge & Logout Action */}
      <div className="px-2 space-y-2">
        <div className="hidden md:block p-2.5 rounded-xl bg-slate-850 border border-emerald-500/20 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
            <ShieldCheck size={12} />
            <span>Prototype Simulation</span>
          </div>
          <p className="leading-tight text-slate-400">Low-cost IoT + AI/ML optimization active.</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center md:justify-start gap-3 px-3.5 md:px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/30 transition-all"
        >
          <LogOut size={18} />
          <span className="hidden md:inline-block">Sign Out Operator</span>
        </button>
      </div>
    </aside>
  );
};
