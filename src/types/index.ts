export interface User {
  id: string;
  name: string;
  username: string;
  role: 'building_manager' | 'energy_engineer' | 'facility_operator' | 'admin';
}

export interface BuildingMetrics {
  energyTodayKwh: number;        // 24.8 kWh
  currentPowerKw: number;        // 4.2 kW
  occupancyPercent: number;      // 68%
  indoorTempC: number;           // 24.6°C
  co2Ppm: number;                // 720 ppm
  energySavingPercent: number;   // 18.4%
  peakLoadKw: number;            // 3.8 kW
  comfortScore: number;          // 94/100
}

export type SensorStatus = 'NORMAL' | 'WARNING' | 'MONITOR';

export interface SensorItem {
  id: string;
  name: string;
  type: 'Temperature' | 'Humidity' | 'CO2' | 'Occupancy' | 'Light intensity' | 'Power consumption' | 'Equipment status';
  value: string;
  numericValue: number;
  unit: string;
  status: SensorStatus;
  lastUpdated: string;
  zone: string;
  floor: string;
  optimalRange: string;
}

export interface HourlyChartData {
  hour: string;
  actualEnergyKw: number;
  predictedEnergyKw: number;
  baselineEnergyKw: number;
  occupancyPercent: number;
  temperatureC: number;
}

export interface ZoneConsumptionData {
  zone: string;
  floor: string;
  energyKwh: number;
  percentage: number;
  activeOccupants: number;
  status: 'OPTIMAL' | 'MODERATE' | 'HIGH';
  hvacState: string;
  lightingState: string;
}

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  zone: string;
  potentialSavingsKw: number;
  confidence: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionType: 'HVAC' | 'LIGHTING' | 'PEAK_SHIFT' | 'INSPECT';
  isApplied: boolean;
}

export type SystemControlMode = 'ON' | 'OFF' | 'AUTO' | 'SCHEDULED' | 'PEAK-SHIFT';

export interface ControllableSystem {
  id: string;
  name: string;
  category: 'LIGHTING' | 'HVAC' | 'FANS' | 'FLEXIBLE LOAD';
  currentMode: SystemControlMode;
  allowedModes: SystemControlMode[];
  setpoint?: string;
  powerKw: number;
  zone: string;
  occupancyDriven: boolean;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

export interface AlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  location: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface DemandResponseSimulation {
  normalLoadKw: number;          // 5.6 kW
  predictedPeakKw: number;       // 6.4 kW
  recommendedFlexibleShiftKw: number; // 1.2 kW
  postOptimizationKw: number;    // 5.2 kW
  isShiftActive: boolean;
  gridStatus: 'NORMAL' | 'PEAK_ALERT' | 'OPTIMIZED';
  label: 'Prototype Simulation';
}

export interface OccupantExperienceMetrics {
  temperatureC: number;
  tempStatus: string;           // "24.6°C — Comfortable"
  co2Ppm: number;
  co2Status: string;            // "720 ppm — Good"
  humidityPercent: number;
  humidityStatus: string;       // "52% — Comfortable"
  lightingLux: number;
  lightingStatus: string;       // "780 lux — Suitable"
  occupancyPercent: number;
  comfortScore: number;         // 94/100
}

export interface ArchitectureEntity {
  entity: string;
  table: string;
  description: string;
  fields: string[];
}

export interface ValidationMetric {
  metric: string;
  description: string;
  status: 'Testing Planned' | 'In Progress';
  target: string;
}
