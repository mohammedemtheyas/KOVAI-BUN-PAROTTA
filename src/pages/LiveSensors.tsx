import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Thermometer, 
  Wind, 
  Users, 
  Sun, 
  Zap, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { SensorItem, SensorStatus } from '../types';
import { api } from '../services/api';

export const LiveSensors: React.FC = () => {
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const data = await api.getLiveSensors();
      setSensors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSensors = sensors.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.floor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: SensorStatus) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            <CheckCircle2 size={12} /> NORMAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono animate-pulse">
            <AlertTriangle size={12} /> WARNING
          </span>
        );
      case 'MONITOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
            <Activity size={12} /> MONITOR
          </span>
        );
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'Temperature': return Thermometer;
      case 'Humidity': return Wind;
      case 'CO2': return Wind;
      case 'Occupancy': return Users;
      case 'Light intensity': return Sun;
      case 'Power consumption': return Zap;
      default: return Cpu;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Radio className="text-emerald-400" />
              <span>LIVE SENSORS MONITORING</span>
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              ESP32 Telemetry Mesh
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-Time Environmental & Power Sensor Diagnostics</p>
        </div>

        <button
          onClick={fetchSensors}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-800 transition-all self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-400' : ''} />
          <span>Refresh Sensors</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search sensor name, zone, or floor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NORMAL">Normal</option>
            <option value="MONITOR">Monitor</option>
            <option value="WARNING">Warning</option>
          </select>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);

          return (
            <div
              key={sensor.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 hover:border-emerald-500/40 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 flex items-center justify-center group-hover:border-emerald-500/40 transition-all">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{sensor.name}</h3>
                    <span className="text-[11px] text-slate-400 block">{sensor.zone} • {sensor.floor}</span>
                  </div>
                </div>
                {getStatusBadge(sensor.status)}
              </div>

              {/* Sensor Reading Big Display */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex justify-between items-baseline">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Current Value</span>
                  <span className="text-2xl font-black text-white font-mono">{sensor.value}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Optimal Range</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{sensor.optimalRange}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-850">
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={11} className="text-slate-500" />
                  Last Updated: {sensor.lastUpdated}
                </span>
                <span className="text-slate-400 font-mono">ID: {sensor.id}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
