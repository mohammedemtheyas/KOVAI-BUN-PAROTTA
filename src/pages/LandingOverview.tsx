import React from 'react';
import { 
  Building2, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Radio, 
  BrainCircuit, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  Database, 
  MapPin, 
  Gauge, 
  Thermometer, 
  Wind, 
  Sun, 
  Users, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  Server,
  Activity,
  Cpu,
  ChevronRight,
  TrendingDown,
  Lock
} from 'lucide-react';

interface LandingOverviewProps {
  onNavigate: (route: string) => void;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans space-y-16 pb-20 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* ==================================================
          1. HERO SECTION
         ================================================== */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        {/* Glowing Background Radial Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Prototype Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>TECHNOVA • Smart Building Energy Management Prototype</span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-[1.08]">
                SMART BUILDINGS
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                Energy Efficiency & Occupant Experience
              </p>
            </div>

            {/* Tagline */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-slate-200 font-medium text-base sm:text-lg italic border-l-4 border-l-emerald-500">
              “Making every square metre smarter, greener, and more comfortable.”
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              An intelligent IoT and AI-powered building management platform that monitors energy, occupancy and indoor conditions, predicts demand and helps optimize lighting, HVAC and other flexible loads without sacrificing occupant comfort.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-7 py-4 rounded-2xl text-sm uppercase tracking-wider shadow-xl shadow-emerald-900/40 border border-emerald-400/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap size={18} className="fill-slate-950" />
                <span>View Live Dashboard</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('challenge-section');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold px-6 py-4 rounded-2xl text-sm border border-slate-750 transition-all hover:border-emerald-500/30"
              >
                <span>Explore the Solution</span>
                <ArrowRight size={16} className="text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Right Modern Building / IoT Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-slate-900 border border-emerald-500/30 p-6 shadow-2xl overflow-hidden group">
              {/* Isometric / Modern Building Floor & Mesh Visual */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Building2 size={16} className="text-emerald-400" />
                    <span>BUILDING TELEMETRY MAP</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    PROTOTYPE SIMULATION
                  </span>
                </div>

                {/* Building Floor Plan Blueprint Visual */}
                <div className="relative h-64 rounded-2xl bg-slate-950 p-4 border border-slate-800 flex flex-col justify-between overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                  
                  {/* Zone Badges */}
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="bg-slate-900/90 border border-emerald-500/40 p-2.5 rounded-xl shadow-lg space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Zone 1 — Workspaces</div>
                      <div className="text-xs font-mono font-bold text-emerald-400">24.6°C • 720 ppm CO₂</div>
                      <div className="text-[9px] text-cyan-400 font-semibold">Occupancy: 68%</div>
                    </div>
                    
                    <div className="bg-slate-900/90 border border-cyan-500/40 p-2.5 rounded-xl shadow-lg space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Zone 2 — Conf. Rooms</div>
                      <div className="text-xs font-mono font-bold text-cyan-400">24.2°C • 680 ppm CO₂</div>
                      <div className="text-[9px] text-emerald-400 font-semibold">HVAC Eco Mode</div>
                    </div>
                  </div>

                  {/* Central IoT Node Pulse */}
                  <div className="relative z-10 flex items-center justify-center my-auto">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
                      <Cpu size={28} className="text-emerald-400" />
                    </div>
                  </div>

                  {/* Footer Stats Bar inside Visual */}
                  <div className="relative z-10 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-slate-400 block">Today Energy</span>
                      <span className="font-mono font-bold text-emerald-400">24.8 kWh</span>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-slate-400 block">Current Power</span>
                      <span className="font-mono font-bold text-white">4.2 kW</span>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-lg">
                      <span className="text-slate-400 block">Energy Saving</span>
                      <span className="font-mono font-bold text-emerald-400">18.4%</span>
                    </div>
                  </div>
                </div>

                {/* IoT Feature Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-300">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-800">
                    <Radio size={14} className="text-emerald-400" />
                    <span>Low-Cost ESP32 Mesh</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-800">
                    <BrainCircuit size={14} className="text-cyan-400" />
                    <span>AI Energy Forecasting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. PROBLEM SECTION
         ================================================== */}
      <section id="challenge-section" className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">INDUSTRY PAIN POINTS</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            THE CHALLENGE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Traditional commercial facilities struggle with soaring utility costs, unmonitored flexible loads, and poor occupant comfort balance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 01 */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all group space-y-3 relative overflow-hidden">
            <div className="text-xs font-black font-mono text-emerald-400/60 uppercase">PROBLEM 01</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">01 — ENERGY WASTE</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Buildings consume significant electricity, while unnecessary lighting, HVAC operation and equipment usage can increase energy waste.
            </p>
          </div>

          {/* Card 02 */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all group space-y-3 relative overflow-hidden">
            <div className="text-xs font-black font-mono text-cyan-400/60 uppercase">PROBLEM 02</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">02 — LIMITED REAL-TIME VISIBILITY</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Building managers often lack a single real-time view of energy consumption, occupancy and equipment performance.
            </p>
          </div>

          {/* Card 03 */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all group space-y-3 relative overflow-hidden">
            <div className="text-xs font-black font-mono text-emerald-400/60 uppercase">PROBLEM 03</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">03 — PEAK DEMAND</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Flexible loads can sometimes be shifted away from peak periods to reduce demand and improve grid responsiveness.
            </p>
          </div>

          {/* Card 04 */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all group space-y-3 relative overflow-hidden">
            <div className="text-xs font-black font-mono text-cyan-400/60 uppercase">PROBLEM 04</div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">04 — OCCUPANT COMFORT</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Energy savings should not come at the expense of thermal comfort, indoor air quality, lighting quality or productivity.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. INTELLIGENT CONTROL WORKFLOW (SENSE -> CONTROL)
         ================================================== */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">CLOSED-LOOP SYSTEM ARCHITECTURE</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            SENSE → ANALYZE → PREDICT → CONTROL → OPTIMIZE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            End-to-end telemetry and automated equipment feedback loop
          </p>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', title: 'IoT Sensors', icon: Radio, color: 'text-emerald-400' },
            { step: '02', title: 'Real-Time Data', icon: Activity, color: 'text-cyan-400' },
            { step: '03', title: 'AI Analytics', icon: BrainCircuit, color: 'text-emerald-400' },
            { step: '04', title: 'Demand Forecast', icon: TrendingDown, color: 'text-cyan-400' },
            { step: '05', title: 'Smart Control', icon: Sliders, color: 'text-emerald-400' },
            { step: '06', title: 'Optimization', icon: CheckCircle2, color: 'text-teal-400' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 hover:border-emerald-500/40 transition-all">
              <span className="text-[10px] font-mono font-bold text-slate-500">STEP {item.step}</span>
              <item.icon size={22} className={`mx-auto ${item.color}`} />
              <h4 className="text-xs font-bold text-white uppercase tracking-tight">{item.title}</h4>
            </div>
          ))}
        </div>

        {/* Controllable Systems Overview Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold text-white uppercase">CONTROLLABLE BUILDING SYSTEMS</h3>
              <p className="text-xs text-slate-400">Automated or operator-override load management</p>
            </div>
            <button
              onClick={() => onNavigate('/controls')}
              className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage System Controls</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">LIGHTING</span>
                <span className="text-emerald-400 font-bold font-mono text-[10px]">ON / OFF / AUTO</span>
              </div>
              <p className="text-[11px] text-slate-400">Occupancy-driven 780 lux daylight harvesting.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">HVAC</span>
                <span className="text-emerald-400 font-bold font-mono text-[10px]">24°C / AUTO</span>
              </div>
              <p className="text-[11px] text-slate-400">Dynamic setpoint modulation based on thermal comfort.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">FANS</span>
                <span className="text-emerald-400 font-bold font-mono text-[10px]">ON / OFF / AUTO</span>
              </div>
              <p className="text-[11px] text-slate-400">Indoor air circulation & variable speed control.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">FLEXIBLE LOAD</span>
                <span className="text-emerald-400 font-bold font-mono text-[10px]">SCHEDULED / PEAK-SHIFT</span>
              </div>
              <p className="text-[11px] text-slate-400">Grid tariff responsive thermal & pump storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          7. OCCUPANT EXPERIENCE & DEMAND RESPONSE
         ================================================== */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Occupant Experience */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">OCCUPANT EXPERIENCE</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">COMFORT WITHOUT COMPROMISE</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Thermometer size={16} className="text-emerald-400" />
                <span className="font-semibold text-white">Temperature</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">24.6°C — Comfortable</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Wind size={16} className="text-cyan-400" />
                <span className="font-semibold text-white">CO₂ Level</span>
              </div>
              <span className="font-mono font-bold text-cyan-400">720 ppm — Good</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-emerald-400" />
                <span className="font-semibold text-white">Relative Humidity</span>
              </div>
              <span className="font-mono font-bold text-slate-200">52% — Comfortable</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Sun size={16} className="text-amber-400" />
                <span className="font-semibold text-white">Lighting Intensity</span>
              </div>
              <span className="font-mono font-bold text-amber-400">780 lux — Suitable</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-emerald-400" />
                <span className="font-semibold text-white">Building Occupancy</span>
              </div>
              <span className="font-mono font-bold text-white">68%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Overall Comfort Score</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">94 / 100</span>
            </div>
            <div className="text-[11px] text-slate-300 max-w-xs text-right">
              System does NOT optimize energy blindly. It balances energy efficiency with occupant comfort and safety.
            </div>
          </div>
        </div>

        {/* Demand Response */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">GRID-RESPONSIVE BUILDING</span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
                Prototype Simulation
              </span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">DEMAND RESPONSE</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When peak demand is detected, the platform identifies flexible loads that can be shifted without significantly affecting occupants.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Normal Load</span>
              <span className="font-mono text-lg font-bold text-slate-200">5.6 kW</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30">
              <span className="text-amber-400 block text-[11px]">Predicted Peak</span>
              <span className="font-mono text-lg font-bold text-amber-400">6.4 kW</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30">
              <span className="text-emerald-400 block text-[11px]">Recommended Shift</span>
              <span className="font-mono text-lg font-bold text-emerald-400">1.2 kW</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-teal-500/30">
              <span className="text-teal-400 block text-[11px]">Post-Optimization</span>
              <span className="font-mono text-lg font-bold text-teal-300">5.2 kW</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/demand-response')}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition-all"
          >
            Explore Grid Demand Response Simulation
          </button>
        </div>
      </section>

      {/* ==================================================
          9. SYSTEM ARCHITECTURE & DATABASE
         ================================================== */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">TECHNICAL SPECIFICATIONS</span>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">
            DATABASE & BACKEND ARCHITECTURE
          </h2>
        </div>

        {/* Stack Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Frontend', tech: 'React', icon: Layers },
            { label: 'Backend', tech: 'FastAPI', icon: Server },
            { label: 'Database', tech: 'PostgreSQL', icon: Database },
            { label: 'IoT Microcontroller', tech: 'ESP32 + Sensors', icon: Cpu },
            { label: 'Communication', tech: 'MQTT / Wi-Fi', icon: Radio },
            { label: 'AI/ML Analytics', tech: 'Python + ML', icon: BrainCircuit },
          ].map((stack, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5 hover:border-emerald-500/30 transition-all">
              <stack.icon size={20} className="text-emerald-400" />
              <div className="text-[10px] text-slate-400 font-bold uppercase">{stack.label}</div>
              <div className="text-xs font-bold text-white font-mono">{stack.tech}</div>
            </div>
          ))}
        </div>

        {/* Architecture Flow Diagram Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h4 className="text-sm font-bold text-white uppercase">SYSTEM DATA FLOW DIAGRAM</h4>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono text-emerald-400 flex items-center justify-between min-w-[650px] gap-2">
            <span>ESP32 Sensors</span>
            <span className="text-slate-600">→</span>
            <span>MQTT / API</span>
            <span className="text-slate-600">→</span>
            <span className="text-white font-bold">FastAPI Backend</span>
            <span className="text-slate-600">→</span>
            <span className="text-cyan-400">PostgreSQL</span>
            <span className="text-slate-600">→</span>
            <span className="text-emerald-400">AI/ML Analytics</span>
            <span className="text-slate-600">→</span>
            <span className="text-white font-bold">React Dashboard</span>
            <span className="text-slate-600">→</span>
            <span className="text-amber-400">Building Manager</span>
          </div>
        </div>
      </section>

      {/* ==================================================
          11. VALIDATION & ROADMAP
         ================================================== */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Validation & Feasibility */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">PROTOTYPE TESTING</span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">VALIDATION & FEASIBILITY</h3>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
              Testing Planned
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Prototype testing with 3–5 users / building operators will evaluate performance across key target metrics:
          </p>

          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li>Energy consumption before vs after optimization</li>
            <li>Time required to identify an energy issue</li>
            <li>Dashboard task completion time</li>
            <li>UI error rate</li>
            <li>Alert accuracy</li>
            <li>Sensor reliability</li>
            <li>Occupant comfort feedback</li>
          </ul>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 italic">
            Note: Real-world pilot results are pending scheduled deployment. Data above reflects prototype simulation model.
          </div>
        </div>

        {/* Roadmap */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">DEVELOPMENT MILESTONES</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">PROJECT ROADMAP</h3>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { phase: 'Phase 01', name: 'Prototype', desc: 'IoT sensors + interactive dashboard', current: true },
              { phase: 'Phase 02', name: 'AI Prediction', desc: 'Energy-demand forecasting model', current: false },
              { phase: 'Phase 03', name: 'Smart Control', desc: 'Automated lighting & HVAC optimization', current: false },
              { phase: 'Phase 04', name: 'Demand Response', desc: 'Peak-load shifting integration', current: false },
              { phase: 'Phase 05', name: 'Real Deployment', desc: 'Pilot testing & operator validation', current: false },
            ].map((p, idx) => (
              <div key={idx} className={`p-3 rounded-2xl border flex justify-between items-center ${p.current ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300'}`}>
                <div>
                  <span className="font-bold text-white font-mono">{p.phase} — {p.name}</span>
                  <span className="text-[11px] text-slate-400 block">{p.desc}</span>
                </div>
                {p.current && <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">ACTIVE</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          15. FINAL CTA
         ================================================== */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/60 border border-emerald-500/40 p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            MAKE EVERY SQUARE METRE SMARTER.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Monitor energy. Understand occupancy. Predict demand. Optimize operations. Improve comfort.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl transition-all"
            >
              View Dashboard
            </button>
            <button
              onClick={() => onNavigate('/architecture')}
              className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all"
            >
              Explore Technology
            </button>
            <button
              onClick={() => onNavigate('/roadmap')}
              className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/30 transition-all"
            >
              Contact Team
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/80 max-w-xs mx-auto text-xs text-slate-400 font-bold">
            DEVELOPED BY <span className="text-emerald-400">TECHNOVA</span>
          </div>
        </div>
      </section>

    </div>
  );
};
