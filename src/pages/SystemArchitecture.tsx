import React from 'react';
import { 
  Database, 
  Server, 
  Layers, 
  Cpu, 
  Radio, 
  BrainCircuit, 
  Layout, 
  UserCheck, 
  ArrowRight,
  Code,
  Table,
  CheckCircle2
} from 'lucide-react';
import { ArchitectureEntity } from '../types';

export const SystemArchitecture: React.FC = () => {
  const dbEntities: ArchitectureEntity[] = [
    {
      entity: 'Building',
      table: 'buildings',
      description: 'Physical facility metadata, total area sq.m, geographic location & grid connection parameters.',
      fields: ['id (UUID)', 'name (VARCHAR)', 'address (TEXT)', 'total_area_sqm (FLOAT)', 'peak_tariff_cap (FLOAT)', 'created_at']
    },
    {
      entity: 'Sensor',
      table: 'sensors',
      description: 'IoT sensor hardware nodes deployed across floors and zones.',
      fields: ['id (UUID)', 'building_id (FK)', 'sensor_type (ENUM)', 'zone (VARCHAR)', 'esp32_mac (VARCHAR)', 'status (ENUM)', 'optimal_min', 'optimal_max']
    },
    {
      entity: 'Occupancy',
      table: 'occupancy_logs',
      description: 'Real-time and aggregated headcount & motion detection data per zone.',
      fields: ['id (UUID)', 'sensor_id (FK)', 'zone_id (FK)', 'headcount (INT)', 'occupancy_percentage (FLOAT)', 'timestamp']
    },
    {
      entity: 'EnergyConsumption',
      table: 'energy_consumptions',
      description: 'Smart meter power draw and cumulative energy telemetry.',
      fields: ['id (UUID)', 'building_id (FK)', 'zone_id (FK)', 'power_kw (FLOAT)', 'energy_kwh (FLOAT)', 'timestamp']
    },
    {
      entity: 'Temperature',
      table: 'temperature_telemetry',
      description: 'Indoor environmental thermal readings and humidity stats.',
      fields: ['id (UUID)', 'sensor_id (FK)', 'temperature_c (FLOAT)', 'humidity_percent (FLOAT)', 'timestamp']
    },
    {
      entity: 'Equipment',
      table: 'equipment_controls',
      description: 'Controllable HVAC chillers, AHU units, lighting relays, and fans.',
      fields: ['id (UUID)', 'name (VARCHAR)', 'category (ENUM)', 'current_mode (ENUM)', 'power_rating_kw (FLOAT)', 'zone']
    },
    {
      entity: 'EnergyPrediction',
      table: 'energy_predictions',
      description: 'ML model hourly forecasted energy demand and confidence intervals.',
      fields: ['id (UUID)', 'forecast_time', 'predicted_demand_kw (FLOAT)', 'confidence (FLOAT)', 'model_version']
    },
    {
      entity: 'Alert',
      table: 'alerts',
      description: 'System anomaly alerts, threshold warnings, and load shift triggers.',
      fields: ['id (UUID)', 'severity (ENUM)', 'title (VARCHAR)', 'message (TEXT)', 'is_acknowledged (BOOL)', 'created_at']
    },
    {
      entity: 'DemandResponse',
      table: 'demand_response_events',
      description: 'DISCOM grid peak load reduction events and shift logs.',
      fields: ['id (UUID)', 'event_time', 'target_shift_kw (FLOAT)', 'actual_shift_kw (FLOAT)', 'status (ENUM)']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Database className="text-emerald-400" />
              <span>DATABASE & TECHNICAL ARCHITECTURE</span>
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
              Production System Blueprint
            </span>
          </div>
          <p className="text-xs text-slate-400">PostgreSQL Schema, FastAPI Services & IoT Telemetry Architecture</p>
        </div>
      </div>

      {/* TECH STACK GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Frontend Framework', name: 'React', icon: Layers, desc: 'Responsive Dashboard UI & Recharts' },
          { label: 'Backend API', name: 'FastAPI', icon: Server, desc: 'Python Asynchronous Async REST' },
          { label: 'Database', name: 'PostgreSQL', icon: Database, desc: 'Relational Telemetry & Logs' },
          { label: 'IoT Sensing', name: 'ESP32 + Sensors', icon: Cpu, desc: 'Environmental & Power Hardware' },
          { label: 'Communication', name: 'MQTT / Wi-Fi', icon: Radio, desc: 'Real-Time Message Broker' },
          { label: 'AI/ML Analytics', name: 'Python + ML', icon: BrainCircuit, desc: 'Demand Forecasting & Rules' }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 hover:border-emerald-500/40 transition-all shadow-lg">
            <item.icon size={22} className="text-emerald-400" />
            <div className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</div>
            <div className="text-sm font-bold text-white font-mono">{item.name}</div>
            <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CLEAN ARCHITECTURE DIAGRAM */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h3 className="text-base font-extrabold text-white uppercase tracking-tight">
          SYSTEM DATA FLOW DIAGRAM
        </h3>

        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-mono text-slate-200">
          <div className="flex items-center justify-between min-w-[850px] text-center">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <Cpu size={20} className="mx-auto text-emerald-400" />
              <div className="font-bold text-emerald-400">ESP32 Sensors</div>
              <span className="text-[10px] text-slate-400">Hardware Layer</span>
            </div>

            <span className="text-slate-600 font-bold text-lg">→</span>

            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1">
              <Radio size={20} className="mx-auto text-cyan-400" />
              <div className="font-bold text-cyan-400">MQTT / API</div>
              <span className="text-[10px] text-slate-400">Transport Layer</span>
            </div>

            <span className="text-slate-600 font-bold text-lg">→</span>

            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <Server size={20} className="mx-auto text-white" />
              <div className="font-bold text-white">FastAPI Backend</div>
              <span className="text-[10px] text-slate-400">REST & Business Logic</span>
            </div>

            <span className="text-slate-600 font-bold text-lg">→</span>

            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-1">
              <Database size={20} className="mx-auto text-cyan-400" />
              <div className="font-bold text-cyan-400">PostgreSQL</div>
              <span className="text-[10px] text-slate-400">Persistence Layer</span>
            </div>

            <span className="text-slate-600 font-bold text-lg">→</span>

            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <BrainCircuit size={20} className="mx-auto text-emerald-400" />
              <div className="font-bold text-emerald-400">AI/ML Analytics</div>
              <span className="text-[10px] text-slate-400">Prediction & Control</span>
            </div>

            <span className="text-slate-600 font-bold text-lg">→</span>

            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <Layers size={20} className="mx-auto text-white" />
              <div className="font-bold text-white">React Dashboard</div>
              <span className="text-[10px] text-slate-400">Web UI</span>
            </div>

            <span className="text-slate-600 font-bold text-lg">→</span>

            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-1">
              <UserCheck size={20} className="mx-auto text-amber-400" />
              <div className="font-bold text-amber-400">Building Manager</div>
              <span className="text-[10px] text-slate-400">Operator</span>
            </div>

          </div>
        </div>
      </div>

      {/* DATABASE ENTITIES ERD OVERVIEW */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
            <Table size={18} className="text-emerald-400" />
            <span>POSTGRESQL DATABASE ENTITIES SCHEMA</span>
          </h3>
          <p className="text-xs text-slate-400">9 Core Entities powering the Smart Building Data Model</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dbEntities.map((ent, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="font-bold text-sm text-white font-mono">{ent.entity}</span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {ent.table}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{ent.description}</p>
              
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Key Attributes:</span>
                <div className="flex flex-wrap gap-1">
                  {ent.fields.map((f, fi) => (
                    <span key={fi} className="text-[9px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
