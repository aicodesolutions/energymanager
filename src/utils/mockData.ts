import { Building, SolarPanel, BatterySystem, EVCharger, EnergyMetrics } from '../types';

export const buildings: Building[] = [
  { id: '1', name: 'Engineering Building', consumption: 850, capacity: 1200, status: 'normal' },
  { id: '2', name: 'Library Complex', consumption: 420, capacity: 600, status: 'normal' },
  { id: '3', name: 'Student Center', consumption: 680, capacity: 800, status: 'high' },
  { id: '4', name: 'Science Laboratory', consumption: 950, capacity: 1000, status: 'critical' },
  { id: '5', name: 'Dormitory A', consumption: 320, capacity: 500, status: 'normal' },
  { id: '6', name: 'Dormitory B', consumption: 380, capacity: 500, status: 'normal' },
  { id: '7', name: 'Sports Complex', consumption: 540, capacity: 700, status: 'normal' },
  { id: '8', name: 'Administration', consumption: 280, capacity: 400, status: 'normal' },
  { id: '9', name: 'Life Science Laboratory', consumption: 1650, capacity: 1850, status: 'high' }, // High consumption due to specialized equipment
];

export const solarPanels: SolarPanel[] = [
  { id: '1', location: 'Engineering Rooftop', generation: 145, capacity: 200, efficiency: 72.5, status: 'online' },
  { id: '2', location: 'Library Rooftop', generation: 89, capacity: 120, efficiency: 74.2, status: 'online' },
  { id: '3', location: 'Student Center', generation: 156, capacity: 180, efficiency: 86.7, status: 'online' },
  { id: '4', location: 'Parking Structure', generation: 198, capacity: 250, efficiency: 79.2, status: 'online' },
  { id: '5', location: 'Sports Complex', generation: 0, capacity: 150, efficiency: 0, status: 'maintenance' },
  { id: '6', location: 'Science Building', generation: 134, capacity: 160, efficiency: 83.8, status: 'online' },
  { id: '7', location: 'Life Science Lab', generation: 185, capacity: 220, efficiency: 84.1, status: 'online' }, // New solar installation
];

export const batteries: BatterySystem[] = [
  { id: '1', name: 'Main Battery Bank', charge: 75, capacity: 1000, status: 'discharging', power: -85 },
  { id: '2', name: 'Backup System A', charge: 92, capacity: 500, status: 'idle', power: 0 },
  { id: '3', name: 'Backup System B', charge: 68, capacity: 500, status: 'charging', power: 45 },
  { id: '4', name: 'Life Science Lab Battery', charge: 82, capacity: 750, status: 'charging', power: 120 }, // Dedicated lab battery
];

export const evChargers: EVCharger[] = [
  { id: '1', location: 'Main Parking Lot A1', status: 'occupied', power: 7.2, vehicleConnected: 'Toyota Prius', sessionDuration: 45 },
  { id: '2', location: 'Main Parking Lot A2', status: 'available', power: 0 },
  { id: '3', location: 'Faculty Parking B1', status: 'occupied', power: 11.5, vehicleConnected: 'Tesla Model 3', sessionDuration: 120 },
  { id: '4', location: 'Faculty Parking B2', status: 'occupied', power: 7.2, vehicleConnected: 'Nissan Leaf', sessionDuration: 90 },
  { id: '5', location: 'Student Parking C1', status: 'available', power: 0 },
  { id: '6', location: 'Student Parking C2', status: 'offline', power: 0 },
  { id: '7', location: 'Visitor Parking D1', status: 'occupied', power: 22, vehicleConnected: 'BMW i3', sessionDuration: 30 },
  { id: '8', location: 'Visitor Parking D2', status: 'available', power: 0 },
  { id: '9', location: 'Life Science Lab Parking E1', status: 'occupied', power: 62.5, vehicleConnected: 'Ford Mustang Mach-E', sessionDuration: 75 }, // DC Fast charger
  { id: '10', location: 'Life Science Lab Parking E2', status: 'available', power: 0 },
];

// Life Science Laboratory Equipment Status
export interface LabEquipmentStatus {
  incubators: { active: number; power: number; status: string };
  miscEquipment: { active: number; power: number; status: string };
  waterBaths: { active: number; power: number; status: string };
  centrifuges: { active: number; power: number; status: string };
  ovens: { active: number; power: number; status: string };
  fumeCupboards: { active: number; power: number; status: string };
  shakers: { active: number; power: number; status: string };
}

export const lifeScienceLabStatus: LabEquipmentStatus = {
  incubators: { active: 30, power: 9.39, status: 'continuous_operation' }, // 30/32 active
  miscEquipment: { active: 42, power: 7.73, status: 'daytime_operation' }, // 42/51 active during day
  waterBaths: { active: 7, power: 2.02, status: 'active' }, // 7/8 active
  centrifuges: { active: 12, power: 1.54, status: 'intermittent' }, // 12/18 active
  ovens: { active: 3, power: 0.91, status: 'active' }, // 3/4 active
  fumeCupboards: { active: 16, power: 0.8, status: 'continuous_safety' }, // All 16 active for safety
  shakers: { active: 6, power: 0.58, status: 'active' } // 6/8 active
};

export const getEnergyMetrics = (): EnergyMetrics => {
  const totalConsumption = buildings.reduce((sum, building) => sum + building.consumption, 0);
  const totalGeneration = solarPanels.reduce((sum, panel) => sum + panel.generation, 0);
  const totalBatteryCapacity = batteries.reduce((sum, battery) => sum + battery.capacity, 0);
  const totalBatteryCharge = batteries.reduce((sum, battery) => sum + (battery.charge * battery.capacity / 100), 0);
  const batteryLevel = (totalBatteryCharge / totalBatteryCapacity) * 100;
  const activeEVs = evChargers.filter(charger => charger.status === 'occupied').length;
  
  return {
    totalConsumption,
    totalGeneration,
    batteryLevel,
    activeEVs,
    carbonOffset: totalGeneration * 0.45, // kg CO2 saved
    costSavings: totalGeneration * 0.12, // $ saved
  };
};

// Get Life Science Laboratory specific metrics
export const getLabMetrics = () => {
  const totalLabPower = Object.values(lifeScienceLabStatus).reduce((sum, equipment) => sum + equipment.power, 0);
  const totalActiveEquipment = Object.values(lifeScienceLabStatus).reduce((sum, equipment) => sum + equipment.active, 0);
  const totalEquipmentCount = 32 + 51 + 8 + 18 + 4 + 16 + 8; // Sum of all equipment quantities
  const operationalEfficiency = (totalActiveEquipment / totalEquipmentCount) * 100;
  
  return {
    totalLabPower: totalLabPower.toFixed(2),
    totalActiveEquipment,
    totalEquipmentCount,
    operationalEfficiency: operationalEfficiency.toFixed(1),
    annualEnergyProjection: 234323, // kWh/year
    dailyAverageEnergy: 642, // kWh/day
    criticalSystems: ['incubators', 'fumeCupboards'], // 24/7 operation
    peakOperationHours: '6 AM - 10 PM'
  };
};