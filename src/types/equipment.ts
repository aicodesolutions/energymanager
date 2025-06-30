export interface EquipmentLocation {
  id: string;
  name: string;
  type: 'solar' | 'battery' | 'ev_charger' | 'building';
  latitude: number;
  longitude: number;
  address: string;
}

export interface SolarPanelEquipment {
  id: string;
  locationId: string;
  modelNumber: string;
  manufacturer: string;
  capacity: number; // kW
  installationDate: string;
  panelCount: number;
  inverterModel: string;
  tiltAngle: number;
  azimuthAngle: number;
}

export interface BatteryEquipment {
  id: string;
  locationId: string;
  modelNumber: string;
  manufacturer: string;
  capacity: number; // kWh
  maxChargeRate: number; // kW
  maxDischargeRate: number; // kW
  installationDate: string;
  chemistry: string;
  warrantyYears: number;
}

export interface EVChargerEquipment {
  id: string;
  locationId: string;
  modelNumber: string;
  manufacturer: string;
  maxPower: number; // kW
  connectorType: string;
  installationDate: string;
  networkProvider: string;
  level: 'Level 2' | 'DC Fast';
}

export interface BuildingEquipment {
  id: string;
  locationId: string;
  name: string;
  type: 'academic' | 'residential' | 'administrative' | 'recreational';
  maxCapacity: number; // kW
  floorArea: number; // sq ft
  occupancy: number;
  hvacSystem: string;
  constructionYear: number;
}

export interface LabEquipmentSpec {
  id: string;
  name: string;
  quantity: number;
  powerPerUnit: number; // Watts
  totalPower: number; // kW
  annualEnergyPerUnit: number; // kWh/year
  totalAnnualEnergy: number; // kWh/year
  operatingHours: string;
  category: 'incubation' | 'analysis' | 'preparation' | 'safety' | 'mixing';
}

export interface EnergyDataPoint {
  timestamp: string;
  equipmentId: string;
  equipmentType: 'solar' | 'battery' | 'ev_charger' | 'building' | 'laboratory';
  powerGeneration?: number; // kW (solar only)
  voltage?: number; // V (solar only)
  current?: number; // A (solar only)
  chargeLevel?: number; // % (battery only)
  chargingRate?: number; // kW (battery - positive for charging, negative for discharging)
  powerConsumption?: number; // kW (EV charger, building, and laboratory)
  chargingStatus?: 'available' | 'occupied' | 'offline'; // EV charger only
  labEquipmentStatus?: { // Laboratory equipment only
    incubators: { active: number; power: number };
    miscEquipment: { active: number; power: number };
    waterBaths: { active: number; power: number };
    centrifuges: { active: number; power: number };
    ovens: { active: number; power: number };
    fumeCupboards: { active: number; power: number };
    shakers: { active: number; power: number };
  };
  temperature?: number; // °C
  weatherCondition?: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy';
}

// New interfaces for manual status control
export type EquipmentStatus = 'ON' | 'OFF' | 'STANDBY' | 'MAINTENANCE';

export interface EquipmentStatusChange {
  id: string;
  equipmentId: string;
  equipmentType: string;
  previousStatus: EquipmentStatus;
  newStatus: EquipmentStatus;
  timestamp: Date;
  userId: string;
  reason?: string;
  scheduledOperation?: boolean;
  energyImpact: {
    previousConsumption: number;
    newConsumption: number;
    previousGeneration?: number;
    newGeneration?: number;
  };
}

export interface EquipmentSpecs {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  capacity: number;
  optimalOperatingConditions: {
    temperature: { min: number; max: number };
    humidity?: { min: number; max: number };
    voltage?: { min: number; max: number };
  };
  maintenanceSchedule: {
    lastMaintenance: Date;
    nextMaintenance: Date;
    frequency: string;
  };
  energyProfile: {
    onConsumption: number;
    standbyConsumption: number;
    offConsumption: number;
    onGeneration?: number;
    standbyGeneration?: number;
  };
}

export interface StatusAlert {
  id: string;
  type: 'WARNING' | 'ERROR' | 'INFO';
  message: string;
  equipmentId: string;
  timestamp: Date;
  acknowledged: boolean;
  conflictType?: 'SCHEDULED_OPERATION' | 'ENERGY_OPTIMIZATION' | 'MAINTENANCE_DUE';
}