import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  Filter, 
  Check,
  Clock,
  MapPin
} from 'lucide-react';
import { AlertItem, AlertSeverity } from '../types';
import { api } from '../services/api';

export const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    const updated = await api.acknowledgeAlert(id);
    setAlerts(updated);
  };

  const filteredAlerts = alerts.filter(a => severityFilter === 'ALL' || a.severity === severityFilter);

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
            WARNING
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
            SUCCESS
          </span>
        );
      case 'INFO':
        return (
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
            INFO
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Bell className="text-emerald-400" />
              <span>LIVE INCIDENTS & ALERT SYSTEM</span>
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Real-Time Event Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-400">Automated Building Anomaly Alerts & Operator Notifications</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="WARNING">Warnings</option>
            <option value="SUCCESS">Success</option>
            <option value="INFO">Info</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg ${
              alt.acknowledged
                ? 'bg-slate-950 border-slate-850 opacity-75'
                : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {getSeverityBadge(alt.severity)}
                <h3 className="font-bold text-sm text-white">{alt.title}</h3>
              </div>
              <p className="text-xs text-slate-300">{alt.message}</p>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={11} className="text-slate-400" />
                  {alt.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-slate-400" />
                  {alt.timestamp}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {alt.acknowledged ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <CheckCircle2 size={15} /> Acknowledged
                </span>
              ) : (
                <button
                  onClick={() => handleAcknowledge(alt.id)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  <Check size={14} />
                  <span>Acknowledge Alert</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
