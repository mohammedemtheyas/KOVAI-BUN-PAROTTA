import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  ChefHat, 
  BookOpen, 
  BarChart3, 
  History, 
  Package, 
  LogOut,
  Utensils
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, onLogout }) => {
  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, route: '/' },
    { label: 'New Bill', icon: Receipt, route: '/pos' },
    { label: 'Orders', icon: ChefHat, route: '/kitchen' },
    { label: 'Menu Catalog', icon: BookOpen, route: '/menu' },
    { label: 'Bill History', icon: History, route: '/bill-history' },
    { label: 'Kitchen KDS', icon: ChefHat, route: '/kitchen' },
    { label: 'Sales Reports', icon: BarChart3, route: '/sales' },
    { label: 'Menu Manager', icon: Package, route: '/inventory' },
  ];

  return (
    <aside className="w-16 md:w-56 bg-charcoal-900 border-r border-charcoal-800 flex flex-col justify-between shrink-0 select-none py-4">
      <div className="flex flex-col gap-1">
        
        {/* Brand Sidebar Pill */}
        <div className="px-4 mb-3 hidden md:block">
          <div className="flex items-center gap-2 bg-charcoal-850 p-2 rounded-xl border border-charcoal-800">
            <span className="w-7 h-7 rounded-lg bg-chilli-700 text-white font-extrabold text-xs flex items-center justify-center">
              KBP
            </span>
            <div>
              <span className="text-xs font-bold text-white block leading-none">KOVAI POS</span>
              <span className="text-[9px] text-turmeric-500 font-serif">கோவை பரோட்டா</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route + idx}
              onClick={() => onNavigate(item.route)}
              className={`flex items-center gap-3 px-3.5 md:px-4 py-3 mx-2 rounded-xl text-xs font-bold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-chilli-700 to-chilli-800 text-white shadow-md shadow-chilli-900/40 border border-chilli-600/30'
                  : 'text-stone-400 hover:text-white hover:bg-charcoal-850'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-stone-400 group-hover:text-turmeric-400'} />
              <span className="hidden md:inline-block tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Action */}
      <div className="px-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center md:justify-start gap-3 px-3.5 md:px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-900/30 transition-all"
        >
          <LogOut size={18} />
          <span className="hidden md:inline-block">Sign Out Operator</span>
        </button>
      </div>
    </aside>
  );
};
