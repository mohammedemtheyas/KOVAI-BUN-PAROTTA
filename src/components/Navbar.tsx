import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Clock, Zap, LogOut, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenQuickBill: () => void;
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
    <header className="h-16 bg-charcoal-900 border-b border-charcoal-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Brand & Bilingual Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chilli-600 to-chilli-800 flex items-center justify-center text-white font-black shadow-lg shadow-chilli-700/30 border border-chilli-500/30">
          <UtensilsCrossed size={22} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
              KOVAI BUN PAROTTA
            </h1>
            <span className="text-xs text-turmeric-400 font-bold hidden sm:inline-block font-serif">
              • கோவை பன் பரோட்டா
            </span>
          </div>
          <p className="text-[11px] text-turmeric-500 font-semibold tracking-wide">
            Authentic South Indian Flavours
          </p>
        </div>
      </div>

      {/* Center Clock & Quick Bill Hotkey Trigger */}
      <div className="hidden lg:flex items-center gap-4">
        <div className="flex items-center gap-2 bg-charcoal-850 px-3 py-1.5 rounded-xl border border-charcoal-800 text-xs text-stone-300">
          <Clock size={14} className="text-turmeric-500" />
          <span className="font-mono font-semibold text-turmeric-400">{time}</span>
          <span className="text-charcoal-700">|</span>
          <span className="text-stone-400">{date}</span>
        </div>

        <button
          onClick={onOpenQuickBill}
          className="flex items-center gap-2 bg-gradient-to-r from-turmeric-500 to-chilli-600 hover:from-turmeric-600 hover:to-chilli-700 text-charcoal-950 px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-md shadow-turmeric-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap size={14} className="fill-charcoal-950" />
          <span>QUICK BILL MODE (Hotkeys 1-5)</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('/menu')}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            currentRoute === '/menu'
              ? 'bg-chilli-600 text-white border-chilli-500 shadow-md'
              : 'bg-charcoal-850 hover:bg-charcoal-800 text-stone-200 border-charcoal-750'
          }`}
        >
          <span>Digital Menu</span>
          <ExternalLink size={13} />
        </button>

        <button
          onClick={onLogout}
          title="Sign Out POS Operator"
          className="p-2 text-stone-400 hover:text-chilli-500 hover:bg-chilli-950/40 rounded-xl border border-transparent hover:border-chilli-700/30 transition-all"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
};
