import express from 'express';

const router = express.Router();

// Mock telemetry store for backend server
const metrics = {
  energyTodayKwh: 24.8,
  currentPowerKw: 4.2,
  occupancyPercent: 68,
  indoorTempC: 24.6,
  co2Ppm: 720,
  energySavingPercent: 18.4,
  peakLoadKw: 3.8,
  comfortScore: 94
};

const sensors = [
  { id: 'sens-01', name: 'Temperature', type: 'Temperature', value: '24.6°C', numericValue: 24.6, unit: '°C', status: 'NORMAL', lastUpdated: '10s ago', zone: 'Zone 1 - Main Floor', floor: 'Floor 1', optimalRange: '22.0°C - 26.0°C' },
  { id: 'sens-02', name: 'Humidity', type: 'Humidity', value: '52%', numericValue: 52, unit: '%', status: 'NORMAL', lastUpdated: '12s ago', zone: 'Zone 1 - Main Floor', floor: 'Floor 1', optimalRange: '40% - 60%' },
  { id: 'sens-03', name: 'CO₂ Concentration', type: 'CO2', value: '720 ppm', numericValue: 720, unit: 'ppm', status: 'NORMAL', lastUpdated: '5s ago', zone: 'Meeting Room A', floor: 'Floor 2', optimalRange: '< 800 ppm' },
  { id: 'sens-04', name: 'Occupancy Sensor', type: 'Occupancy', value: '68%', numericValue: 68, unit: '%', status: 'NORMAL', lastUpdated: 'Live', zone: 'Open Workspace B', floor: 'Floor 1', optimalRange: '0% - 100%' },
  { id: 'sens-05', name: 'Light Intensity', type: 'Light intensity', value: '780 lux', numericValue: 780, unit: 'lux', status: 'NORMAL', lastUpdated: '15s ago', zone: 'Executive Suite', floor: 'Floor 2', optimalRange: '500 - 850 lux' },
  { id: 'sens-06', name: 'Power Consumption', type: 'Power consumption', value: '4.2 kW', numericValue: 4.2, unit: 'kW', status: 'MONITOR', lastUpdated: 'Real-time', zone: 'HVAC Main Plant', floor: 'Basement', optimalRange: '< 4.5 kW' },
  { id: 'sens-07', name: 'Equipment Status', type: 'Equipment status', value: 'Active / Auto', numericValue: 1, unit: 'State', status: 'NORMAL', lastUpdated: '2s ago', zone: 'AHU Unit #3', floor: 'Rooftop', optimalRange: 'Operational' }
];

const hourlyChart = [
  { hour: '00:00', actualEnergyKw: 1.8, predictedEnergyKw: 1.9, baselineEnergyKw: 2.5, occupancyPercent: 5, temperatureC: 22.1 },
  { hour: '02:00', actualEnergyKw: 1.6, predictedEnergyKw: 1.7, baselineEnergyKw: 2.4, occupancyPercent: 0, temperatureC: 22.0 },
  { hour: '04:00', actualEnergyKw: 1.7, predictedEnergyKw: 1.8, baselineEnergyKw: 2.3, occupancyPercent: 0, temperatureC: 21.9 },
  { hour: '06:00', actualEnergyKw: 2.4, predictedEnergyKw: 2.3, baselineEnergyKw: 3.1, occupancyPercent: 12, temperatureC: 22.5 },
  { hour: '08:00', actualEnergyKw: 4.1, predictedEnergyKw: 4.0, baselineEnergyKw: 5.2, occupancyPercent: 45, temperatureC: 23.8 },
  { hour: '10:00', actualEnergyKw: 5.4, predictedEnergyKw: 5.2, baselineEnergyKw: 6.8, occupancyPercent: 82, temperatureC: 24.5 },
  { hour: '12:00', actualEnergyKw: 5.8, predictedEnergyKw: 5.6, baselineEnergyKw: 7.2, occupancyPercent: 88, temperatureC: 25.1 },
  { hour: '14:00', actualEnergyKw: 4.2, predictedEnergyKw: 4.4, baselineEnergyKw: 5.9, occupancyPercent: 68, temperatureC: 24.6 },
  { hour: '16:00', actualEnergyKw: 4.8, predictedEnergyKw: 4.8, baselineEnergyKw: 6.1, occupancyPercent: 74, temperatureC: 24.8 },
  { hour: '18:00', actualEnergyKw: 3.2, predictedEnergyKw: 3.1, baselineEnergyKw: 4.5, occupancyPercent: 32, temperatureC: 23.9 },
  { hour: '20:00', actualEnergyKw: 2.1, predictedEnergyKw: 2.2, baselineEnergyKw: 3.0, occupancyPercent: 10, temperatureC: 23.0 },
  { hour: '22:00', actualEnergyKw: 1.9, predictedEnergyKw: 1.9, baselineEnergyKw: 2.6, occupancyPercent: 2, temperatureC: 22.4 }
];

const zones = [
  { zone: 'Zone 1 - Open Workstations', floor: 'Floor 1', energyKwh: 8.4, percentage: 33.8, activeOccupants: 34, status: 'OPTIMAL', hvacState: '24.0°C Auto', lightingState: 'Auto Dimmed' },
  { zone: 'Zone 2 - Meeting & Conference', floor: 'Floor 2', energyKwh: 5.2, percentage: 20.9, activeOccupants: 14, status: 'OPTIMAL', hvacState: '24.5°C Eco', lightingState: '780 Lux Auto' },
  { zone: 'Zone 3 - Executive Offices', floor: 'Floor 2', energyKwh: 3.6, percentage: 14.5, activeOccupants: 8, status: 'OPTIMAL', hvacState: '24.0°C Comfort', lightingState: 'Auto On' },
  { zone: 'Zone 4 - Cafeteria & Common', floor: 'Floor 1', energyKwh: 4.1, percentage: 16.5, activeOccupants: 12, status: 'MODERATE', hvacState: '24.2°C Auto', lightingState: 'Occupancy Sensing' },
  { zone: 'Zone 5 - Data & Server Rack', floor: 'Basement', energyKwh: 3.5, percentage: 14.3, activeOccupants: 0, status: 'HIGH', hvacState: '21.0°C Precision', lightingState: 'Off' }
];

const aiRecommendations = [
  { id: 'rec-1', title: 'Reduce HVAC load in Zone 2', description: 'Meeting Room occupancy has dropped to 15%. Pre-cooling can be reduced by 0.6 kW while maintaining 24.6°C comfort.', zone: 'Zone 2 - Floor 2', potentialSavingsKw: 0.6, confidence: 94, priority: 'HIGH', actionType: 'HVAC', isApplied: false },
  { id: 'rec-2', title: 'Turn off unused lighting in Zone 4', description: 'No movement detected in Cafeteria Annex for 18 minutes. Automated dimming to 20% recommended.', zone: 'Zone 4 - Floor 1', potentialSavingsKw: 0.35, confidence: 98, priority: 'MEDIUM', actionType: 'LIGHTING', isApplied: false },
  { id: 'rec-3', title: 'Shift flexible equipment operation away from peak demand', description: 'Upcoming 15:00 grid tariff surge predicted. Defer water heating pump cycle by 45 minutes.', zone: 'Utility Plant', potentialSavingsKw: 1.2, confidence: 91, priority: 'HIGH', actionType: 'PEAK_SHIFT', isApplied: false },
  { id: 'rec-4', title: 'Investigate abnormal consumption in Floor 1', description: 'Power draw in East Corridor is 14% higher than historical baseline for current occupancy.', zone: 'Floor 1 East', potentialSavingsKw: 0.5, confidence: 88, priority: 'LOW', actionType: 'INSPECT', isApplied: false }
];

const controllableSystems = [
  { id: 'sys-light', name: 'LIGHTING', category: 'LIGHTING', currentMode: 'AUTO', allowedModes: ['ON', 'OFF', 'AUTO'], setpoint: '780 Lux', powerKw: 0.8, zone: 'Building-Wide (Floors 1 & 2)', occupancyDriven: true },
  { id: 'sys-hvac', name: 'HVAC', category: 'HVAC', currentMode: 'AUTO', allowedModes: ['AUTO', 'ON', 'OFF'], setpoint: '24.6°C', powerKw: 2.4, zone: 'AHU Units #1-#4', occupancyDriven: true },
  { id: 'sys-fans', name: 'FANS', category: 'FANS', currentMode: 'AUTO', allowedModes: ['ON', 'OFF', 'AUTO'], setpoint: 'Speed Level 2', powerKw: 0.4, zone: 'Indoor Circulation', occupancyDriven: true },
  { id: 'sys-flex', name: 'FLEXIBLE LOAD', category: 'FLEXIBLE LOAD', currentMode: 'SCHEDULED', allowedModes: ['SCHEDULED', 'PEAK-SHIFT'], setpoint: 'Grid Responsive', powerKw: 0.6, zone: 'Pumps & Thermal Storage', occupancyDriven: false }
];

const alerts = [
  { id: 'alt-01', severity: 'WARNING', title: 'High energy consumption detected — Floor 2', message: 'Zone 2 power usage spiked by 1.1 kW above baseline prediction.', location: 'Floor 2 Executive Suite', timestamp: '14:22:05', acknowledged: false },
  { id: 'alt-02', severity: 'WARNING', title: 'CO₂ increasing — Meeting Room A', message: 'Indoor CO₂ level rose to 720 ppm during 14-person strategy workshop.', location: 'Meeting Room A (Floor 2)', timestamp: '14:18:30', acknowledged: false },
  { id: 'alt-03', severity: 'SUCCESS', title: 'HVAC optimization completed', message: 'Chiller setpoint adjusted to 24.6°C automatically saving 0.45 kW.', location: 'Central Plant', timestamp: '13:45:00', acknowledged: true },
  { id: 'alt-04', severity: 'INFO', title: 'Peak-load reduction recommendation available', message: 'Grid demand forecast indicates potential 6.4 kW peak at 15:30.', location: 'System-wide', timestamp: '13:00:00', acknowledged: true }
];

const demandResponse = {
  normalLoadKw: 5.6,
  predictedPeakKw: 6.4,
  recommendedFlexibleShiftKw: 1.2,
  postOptimizationKw: 5.2,
  isShiftActive: false,
  gridStatus: 'NORMAL',
  label: 'Prototype Simulation'
};

router.get('/metrics', (req, res) => res.json(metrics));
router.get('/sensors', (req, res) => res.json(sensors));
router.get('/hourly', (req, res) => res.json(hourlyChart));
router.get('/zones', (req, res) => res.json(zones));
router.get('/ai-recommendations', (req, res) => res.json(aiRecommendations));
router.get('/controls', (req, res) => res.json(controllableSystems));
router.get('/alerts', (req, res) => res.json(alerts));
router.get('/demand-response', (req, res) => res.json(demandResponse));

export default router;
