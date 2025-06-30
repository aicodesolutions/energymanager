export interface Building {
  id: string;
  name: string;
  consumption: number;
  capacity: number;
  status: 'normal' | 'high' | 'critical';
}

export interface SolarPanel {
  id: string;
  location: string;
  generation: number;
  capacity: number;
  efficiency: number;
  status: 'online' | 'offline' | 'maintenance';
}

export interface BatterySystem {
  id: string;
  name: string;
  charge: number;
  capacity: number;
  status: 'charging' | 'discharging' | 'idle';
  power: number;
}

export interface EVCharger {
  id: string;
  location: string;
  status: 'available' | 'occupied' | 'offline';
  power: number;
  vehicleConnected?: string;
  sessionDuration?: number;
}

export interface EnergyMetrics {
  totalConsumption: number;
  totalGeneration: number;
  batteryLevel: number;
  activeEVs: number;
  carbonOffset: number;
  costSavings: number;
}