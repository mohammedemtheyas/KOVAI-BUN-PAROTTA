import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Users, 
  Thermometer, 
  Wind, 
  TrendingDown, 
  ShieldCheck, 
  Activity, 
  Filter, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Sliders, 
  CheckCircle2,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { BuildingMetrics, HourlyChartData, ZoneConsumptionData, SensorItem, AlertItem } from '../types';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

interface DashboardOverviewProps {
  onNavigate: (route: string) => void;
  onOpenReportDetail?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenReportDetail
}) => {
  const [metrics, setMetrics] = useState<BuildingMetrics | null>(null);
  const [hourlyChart, setHourlyChart] = useState<HourlyChartData[]>([]);
  const [zoneData, setZoneData] = useState<ZoneConsumptionData[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('24H');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedZoneFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [m, h, z, a] = await Promise.all([
        api.getDashboardMetrics(),
        api.getHourlyChartData(),
        api.getZoneData(),
        api.getAlerts()
      ]);
      setMetrics(m);
      setHourlyChart(h);
      setZoneData(z);
      setAlerts(a);
    } catch (err) {
      console.error('Failed to load building dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Top Welcome Title Bar & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              SMART BUILDING COMMAND CENTER
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Prototype Simulation
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-time IoT Telemetry, AI Forecasting & Load Control</p>
        </div>

        {/* Interactive Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Zone Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter size={14} className="text-emerald-400" />
            <select
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">All Building Zones</option>
              <option value="Floor 1" className="bg-slate-900">Floor 1 Workspaces</option>
              <option value="Floor 2" className="bg-slate-900">Floor 2 Executive Suite</option>
              <option value="HVAC" className="bg-slate-900">HVAC Central Plant</option>
            </select>
          </div>

          {/* Time Range Filter Buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['1H', '24H', '7D', '30D'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeframe(t)}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedTimeframe === t
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={loadDashboardData}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-all"
            title="Refresh Telemetry"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-emerald-400' : ''} />
          </button>
        </div>
      </div>

      {/* 7 MANDATORY METRIC CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Metric 1: ENERGY TODAY */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ENERGY TODAY</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {metrics?.energyTodayKwh ?? 24.8} <span className="text-xs font-normal">kWh</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">Baseline: 30.4 kWh</span>
        </div>

        {/* Metric 2: CURRENT POWER */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">CURRENT POWER</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1">
            <Zap size={16} className="text-emerald-400 fill-emerald-400" />
            {metrics?.currentPowerKw ?? 4.2} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">Live Telemetry</span>
        </div>

        {/* Metric 3: OCCUPANCY */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">OCCUPANCY</span>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono flex items-center gap-1">
            <Users size={16} />
            {metrics?.occupancyPercent ?? 68}%
          </div>
          <span className="text-[10px] text-slate-400 block">56 Active Occupants</span>
        </div>

        {/* Metric 4: INDOOR TEMPERATURE */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">INDOOR TEMP</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1">
            <Thermometer size={16} className="text-emerald-400" />
            {metrics?.indoorTempC ?? 24.6}°C
          </div>
          <span className="text-[10px] text-emerald-400 block">Comfort Target: 24.5°C</span>
        </div>

        {/* Metric 5: CO2 */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">CO₂ LEVEL</span>
          <div className="text-xl sm:text-2xl font-black text-slate-200 font-mono flex items-center gap-1">
            <Wind size={16} className="text-cyan-400" />
            {metrics?.co2Ppm ?? 720} <span className="text-xs font-normal text-slate-400">ppm</span>
          </div>
          <span className="text-[10px] text-emerald-400 block">Fresh Air: Optimal</span>
        </div>

        {/* Metric 6: ENERGY SAVING */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">ENERGY SAVING</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono flex items-center gap-1">
            <TrendingDown size={16} />
            {metrics?.energySavingPercent ?? 18.4}%
          </div>
          <span className="text-[10px] text-slate-400 block">vs Unoptimized Base</span>
        </div>

        {/* Metric 7: PEAK LOAD */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">PEAK LOAD</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono flex items-center gap-1">
            <Gauge size={16} />
            {metrics?.peakLoadKw ?? 3.8} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Cap Limit: 4.5 kW</span>
        </div>
      </div>

      {/* DYNAMIC RECHARTS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Hourly Energy Consumption & Demand Prediction Chart */}
        <div className="lg:col-span-8 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <span>HOURLY ENERGY CONSUMPTION & AI PREDICTION</span>
              </h3>
              <p className="text-xs text-slate-400">Actual vs AI Forecasted Demand vs Baseline</p>
            </div>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold">
              Next Hour Prediction: 4.8 kW
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyChart}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kW" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="actualEnergyKw" name="Actual Load (kW)" stroke="#10b981" fillOpacity={1} fill="url(#actualGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="predictedEnergyKw" name="AI Predicted Demand (kW)" stroke="#06b6d4" strokeDasharray="4 4" fillOpacity={1} fill="url(#predGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="baselineEnergyKw" name="Unoptimized Baseline (kW)" stroke="#64748b" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Zone Consumption Breakdown */}
        <div className="lg:col-span-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
              ENERGY CONSUMPTION BY ZONE
            </h3>
            <p className="text-xs text-slate-400">Live zone power allocation & state</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} unit=" kWh" />
                <YAxis type="category" dataKey="zone" stroke="#64748b" fontSize={9} width={100} tickFormatter={(v) => v.split(' ')[0] + ' ' + v.split(' ')[1]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="energyKwh" name="Energy (kWh)" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {zoneData.slice(0, 3).map((z, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 truncate max-w-[160px]">{z.zone}</span>
                <span className="font-mono font-bold text-emerald-400">{z.energyKwh} kWh ({z.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OCCUPANCY VS ENERGY CORRELATION & TEMPERATURE TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Occupancy vs Energy Chart */}
        <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
              OCCUPANCY VS ENERGY CORRELATION
            </h3>
            <p className="text-xs text-slate-400">How building load dynamically scales with occupants</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} unit=" kW" />
                <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" fontSize={11} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                <Line yAxisId="left" type="monotone" dataKey="actualEnergyKw" name="Power (kW)" stroke="#10b981" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="occupancyPercent" name="Occupancy (%)" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature Trends Chart */}
        <div className="lg:col-span-6 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
              TEMPERATURE & CO₂ TRENDS
            </h3>
            <p className="text-xs text-slate-400">Thermal comfort stability and ventilation quality</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#f59e0b" fontSize={11} domain={[20, 28]} unit="°C" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }} />
                <Line type="monotone" dataKey="temperatureC" name="Indoor Temp (°C)" stroke="#f59e0b" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS & LIVE ALERTS PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <span>LIVE ALERTS & SYSTEM INCIDENTS</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">Real-time telemetry event log</p>
          </div>

          <button
            onClick={() => onNavigate('/alerts')}
            className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>View All Alerts ({alerts.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    alt.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    alt.severity === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {alt.severity}
                  </span>
                  <span className="font-bold text-white">{alt.title}</span>
                </div>
                <p className="text-[11px] text-slate-400">{alt.message}</p>
                <div className="text-[10px] text-slate-500 font-mono">{alt.location} • {alt.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
