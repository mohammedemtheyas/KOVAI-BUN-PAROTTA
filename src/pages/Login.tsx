import React, { useState } from 'react';
import { UtensilsCrossed, LogIn, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('demo123');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(username, password);
      localStorage.setItem('kovai_pos_token', res.token);
      onLoginSuccess(res.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-950 flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* LEFT: Full-Height Tamil Nadu Parotta Food Photography */}
      <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-screen bg-charcoal-900 overflow-hidden flex items-end p-8 sm:p-12">
        <img
          src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1600&q=85"
          alt="Authentic Kovai Bun Parotta & Chicken Gravy"
          className="absolute inset-0 w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent"></div>

        <div className="relative z-10 space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-chilli-600/30 border border-chilli-500/40 text-chilli-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Coimbatore Signature Cuisine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none uppercase">
            KOVAI BUN PAROTTA
          </h1>
          <p className="text-xl text-turmeric-400 font-serif font-bold">
            கோவை பன் பரோட்டா
          </p>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Enterprise restaurant management & speed billing POS engineered for South Indian parotta shops and dining halls.
          </p>
        </div>
      </div>

      {/* RIGHT: Restaurant Login Credentials Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-charcoal-950 z-10">
        <div className="max-w-md w-full space-y-6 bg-charcoal-900 border border-charcoal-800 p-8 rounded-3xl shadow-2xl">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-chilli-600 to-chilli-800 flex items-center justify-center text-white font-black shadow-lg shadow-chilli-900/40">
              <UtensilsCrossed size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                RESTAURANT POS SIGN IN
              </h2>
              <p className="text-xs text-stone-400">
                Single Restaurant Operator Control Portal
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-chilli-950/60 border border-chilli-700/50 text-chilli-400 p-3 rounded-xl text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-stone-300 uppercase tracking-wider block">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-charcoal-950 border border-charcoal-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-turmeric-500 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-extrabold text-stone-300 uppercase tracking-wider block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal-950 border border-charcoal-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-turmeric-500 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-chilli-600 to-chilli-700 hover:from-chilli-500 hover:to-chilli-600 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-xl shadow-chilli-900/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <LogIn size={16} />
              <span>{loading ? 'Authenticating POS...' : 'SIGN IN TO RESTAURANT POS'}</span>
            </button>
          </form>

          {/* Demo Hint */}
          <div className="pt-4 border-t border-charcoal-800 text-center space-y-2">
            <div className="bg-charcoal-850 p-3 rounded-xl border border-charcoal-800 text-xs text-stone-400">
              <span className="font-bold text-turmeric-400 block mb-0.5">Demo System Access Credentials:</span>
              <span className="font-mono text-white">Username: <strong>admin</strong> | Password: <strong>demo123</strong></span>
            </div>
            <p className="text-[11px] text-stone-500">Kovai Bun Parotta POS System v2.4 • Demo Version</p>
          </div>
        </div>
      </div>
    </div>
  );
};
