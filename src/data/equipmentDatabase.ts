import { 
  EquipmentLocation, 
  SolarPanelEquipment, 
  BatteryEquipment, 
  EVChargerEquipment, 
  BuildingEquipment 
} from '../types/equipment';

// Campus locations with GPS coordinates (University of California, Berkeley area)
export const locations: EquipmentLocation[] = [
  { id: 'loc_001', name: 'Engineering Building Rooftop', type: 'solar', latitude: 37.8735, longitude: -122.2585, address: '2594 Hearst Ave, Berkeley, CA' },
  { id: 'loc_002', name: 'Library Complex Rooftop', type: 'solar', latitude: 37.8725, longitude: -122.2595, address: '2000 Bancroft Way, Berkeley, CA' },
  { id: 'loc_003', name: 'Student Center Rooftop', type: 'solar', latitude: 37.8715, longitude: -122.2605, address: '2495 Bancroft Way, Berkeley, CA' },
  { id: 'loc_004', name: 'Parking Structure Solar Canopy', type: 'solar', latitude: 37.8705, longitude: -122.2615, address: '2400 Durant Ave, Berkeley, CA' },
  { id: 'loc_005', name: 'Science Building Rooftop', type: 'solar', latitude: 37.8745, longitude: -122.2575, address: '2120 Berkeley Way, Berkeley, CA' },
  { id: 'loc_006', name: 'Sports Complex Rooftop', type: 'solar', latitude: 37.8695, longitude: -122.2625, address: '2301 Bancroft Way, Berkeley, CA' },
  { id: 'loc_007', name: 'Life Science Laboratory Rooftop', type: 'solar', latitude: 37.8760, longitude: -122.2555, address: '2800 Hearst Ave, Berkeley, CA' },
  
  { id: 'loc_101', name: 'Main Battery Facility', type: 'battery', latitude: 37.8720, longitude: -122.2590, address: '2450 Haste St, Berkeley, CA' },
  { id: 'loc_102', name: 'Engineering Building Battery Room', type: 'battery', latitude: 37.8735, longitude: -122.2585, address: '2594 Hearst Ave, Berkeley, CA' },
  { id: 'loc_103', name: 'Student Center Battery Storage', type: 'battery', latitude: 37.8715, longitude: -122.2605, address: '2495 Bancroft Way, Berkeley, CA' },
  { id: 'loc_104', name: 'Life Science Laboratory Battery Room', type: 'battery', latitude: 37.8760, longitude: -122.2555, address: '2800 Hearst Ave, Berkeley, CA' },
  
  { id: 'loc_201', name: 'Main Parking Lot A', type: 'ev_charger', latitude: 37.8710, longitude: -122.2600, address: '2400 Channing Way, Berkeley, CA' },
  { id: 'loc_202', name: 'Faculty Parking B', type: 'ev_charger', latitude: 37.8730, longitude: -122.2580, address: '2500 Hearst Ave, Berkeley, CA' },
  { id: 'loc_203', name: 'Student Parking C', type: 'ev_charger', latitude: 37.8700, longitude: -122.2620, address: '2300 Durant Ave, Berkeley, CA' },
  { id: 'loc_204', name: 'Visitor Parking D', type: 'ev_charger', latitude: 37.8740, longitude: -122.2570, address: '2600 Bancroft Way, Berkeley, CA' },
  { id: 'loc_205', name: 'Life Science Laboratory Parking', type: 'ev_charger', latitude: 37.8765, longitude: -122.2550, address: '2850 Hearst Ave, Berkeley, CA' },
  
  { id: 'loc_301', name: 'Engineering Building', type: 'building', latitude: 37.8735, longitude: -122.2585, address: '2594 Hearst Ave, Berkeley, CA' },
  { id: 'loc_302', name: 'Library Complex', type: 'building', latitude: 37.8725, longitude: -122.2595, address: '2000 Bancroft Way, Berkeley, CA' },
  { id: 'loc_303', name: 'Student Center', type: 'building', latitude: 37.8715, longitude: -122.2605, address: '2495 Bancroft Way, Berkeley, CA' },
  { id: 'loc_304', name: 'Science Laboratory', type: 'building', latitude: 37.8745, longitude: -122.2575, address: '2120 Berkeley Way, Berkeley, CA' },
  { id: 'loc_305', name: 'Dormitory A', type: 'building', latitude: 37.8685, longitude: -122.2635, address: '2200 Durant Ave, Berkeley, CA' },
  { id: 'loc_306', name: 'Dormitory B', type: 'building', latitude: 37.8675, longitude: -122.2645, address: '2150 Durant Ave, Berkeley, CA' },
  { id: 'loc_307', name: 'Sports Complex', type: 'building', latitude: 37.8695, longitude: -122.2625, address: '2301 Bancroft Way, Berkeley, CA' },
  { id: 'loc_308', name: 'Administration Building', type: 'building', latitude: 37.8750, longitude: -122.2565, address: '2700 Hearst Ave, Berkeley, CA' },
  { id: 'loc_309', name: 'Life Science Laboratory', type: 'building', latitude: 37.8760, longitude: -122.2555, address: '2800 Hearst Ave, Berkeley, CA' },
];

export const solarPanelEquipment: SolarPanelEquipment[] = [
  {
    id: 'solar_001',
    locationId: 'loc_001',
    modelNumber: 'SunPower SPR-X22-370',
    manufacturer: 'SunPower Corporation',
    capacity: 200,
    installationDate: '2022-03-15',
    panelCount: 540,
    inverterModel: 'SMA Sunny Central 200-US',
    tiltAngle: 25,
    azimuthAngle: 180
  },
  {
    id: 'solar_002',
    locationId: 'loc_002',
    modelNumber: 'Canadian Solar CS3W-400P',
    manufacturer: 'Canadian Solar Inc.',
    capacity: 120,
    installationDate: '2021-08-20',
    panelCount: 300,
    inverterModel: 'Fronius Symo 100-3-M',
    tiltAngle: 30,
    azimuthAngle: 185
  },
  {
    id: 'solar_003',
    locationId: 'loc_003',
    modelNumber: 'LG NeON R LG370Q1C-A5',
    manufacturer: 'LG Electronics',
    capacity: 180,
    installationDate: '2022-11-10',
    panelCount: 486,
    inverterModel: 'SolarEdge SE150K-US',
    tiltAngle: 20,
    azimuthAngle: 175
  },
  {
    id: 'solar_004',
    locationId: 'loc_004',
    modelNumber: 'Jinko Solar JKM400M-72HL4-V',
    manufacturer: 'JinkoSolar',
    capacity: 250,
    installationDate: '2023-05-05',
    panelCount: 625,
    inverterModel: 'Huawei SUN2000-215KTL-H1',
    tiltAngle: 15,
    azimuthAngle: 180
  },
  {
    id: 'solar_005',
    locationId: 'loc_005',
    modelNumber: 'REC Alpha Pure-R REC400AA',
    manufacturer: 'REC Group',
    capacity: 160,
    installationDate: '2021-12-01',
    panelCount: 400,
    inverterModel: 'ABB TRIO-50.0-TL-OUTD',
    tiltAngle: 35,
    azimuthAngle: 190
  },
  {
    id: 'solar_006',
    locationId: 'loc_006',
    modelNumber: 'Trina Solar TSM-DE09.08',
    manufacturer: 'Trina Solar',
    capacity: 150,
    installationDate: '2020-06-15',
    panelCount: 375,
    inverterModel: 'SMA Sunny Central 150-US',
    tiltAngle: 25,
    azimuthAngle: 180
  },
  {
    id: 'solar_007',
    locationId: 'loc_007',
    modelNumber: 'First Solar Series 6 Plus',
    manufacturer: 'First Solar Inc.',
    capacity: 220,
    installationDate: '2024-01-10',
    panelCount: 500,
    inverterModel: 'SMA Sunny Central 220-US',
    tiltAngle: 30,
    azimuthAngle: 180
  }
];

export const batteryEquipment: BatteryEquipment[] = [
  {
    id: 'battery_001',
    locationId: 'loc_101',
    modelNumber: 'Tesla Megapack 2XL',
    manufacturer: 'Tesla Inc.',
    capacity: 1000,
    maxChargeRate: 250,
    maxDischargeRate: 250,
    installationDate: '2023-01-15',
    chemistry: 'Lithium Iron Phosphate (LiFePO4)',
    warrantyYears: 20
  },
  {
    id: 'battery_002',
    locationId: 'loc_102',
    modelNumber: 'LG Chem RESU16H Prime',
    manufacturer: 'LG Energy Solution',
    capacity: 500,
    maxChargeRate: 125,
    maxDischargeRate: 125,
    installationDate: '2022-09-20',
    chemistry: 'Lithium Nickel Manganese Cobalt (NMC)',
    warrantyYears: 15
  },
  {
    id: 'battery_003',
    locationId: 'loc_103',
    modelNumber: 'BYD Battery-Box Premium HVS',
    manufacturer: 'BYD Company Ltd.',
    capacity: 500,
    maxChargeRate: 100,
    maxDischargeRate: 100,
    installationDate: '2022-11-10',
    chemistry: 'Lithium Iron Phosphate (LiFePO4)',
    warrantyYears: 15
  },
  {
    id: 'battery_004',
    locationId: 'loc_104',
    modelNumber: 'Fluence Gridstack Pro',
    manufacturer: 'Fluence Energy',
    capacity: 750,
    maxChargeRate: 200,
    maxDischargeRate: 200,
    installationDate: '2024-02-01',
    chemistry: 'Lithium Iron Phosphate (LiFePO4)',
    warrantyYears: 20
  }
];

export const evChargerEquipment: EVChargerEquipment[] = [
  {
    id: 'ev_001',
    locationId: 'loc_201',
    modelNumber: 'ChargePoint CT4000',
    manufacturer: 'ChargePoint Inc.',
    maxPower: 7.2,
    connectorType: 'J1772',
    installationDate: '2022-04-10',
    networkProvider: 'ChargePoint',
    level: 'Level 2'
  },
  {
    id: 'ev_002',
    locationId: 'loc_201',
    modelNumber: 'ChargePoint CT4000',
    manufacturer: 'ChargePoint Inc.',
    maxPower: 7.2,
    connectorType: 'J1772',
    installationDate: '2022-04-10',
    networkProvider: 'ChargePoint',
    level: 'Level 2'
  },
  {
    id: 'ev_003',
    locationId: 'loc_202',
    modelNumber: 'Tesla Wall Connector',
    manufacturer: 'Tesla Inc.',
    maxPower: 11.5,
    connectorType: 'Tesla Proprietary',
    installationDate: '2023-02-15',
    networkProvider: 'Tesla Supercharger Network',
    level: 'Level 2'
  },
  {
    id: 'ev_004',
    locationId: 'loc_202',
    modelNumber: 'Electrify America 150kW',
    manufacturer: 'ABB',
    maxPower: 150,
    connectorType: 'CCS1',
    installationDate: '2023-06-01',
    networkProvider: 'Electrify America',
    level: 'DC Fast'
  },
  {
    id: 'ev_005',
    locationId: 'loc_203',
    modelNumber: 'EVgo Fast Charger',
    manufacturer: 'BTC Power',
    maxPower: 50,
    connectorType: 'CHAdeMO',
    installationDate: '2022-08-20',
    networkProvider: 'EVgo',
    level: 'DC Fast'
  },
  {
    id: 'ev_006',
    locationId: 'loc_203',
    modelNumber: 'Blink IQ 200',
    manufacturer: 'Blink Charging',
    maxPower: 7.2,
    connectorType: 'J1772',
    installationDate: '2021-11-30',
    networkProvider: 'Blink Network',
    level: 'Level 2'
  },
  {
    id: 'ev_007',
    locationId: 'loc_204',
    modelNumber: 'Webasto TurboDX',
    manufacturer: 'Webasto',
    maxPower: 22,
    connectorType: 'CCS1',
    installationDate: '2023-03-25',
    networkProvider: 'Webasto Live',
    level: 'DC Fast'
  },
  {
    id: 'ev_008',
    locationId: 'loc_204',
    modelNumber: 'ClipperCreek HCS-40',
    manufacturer: 'ClipperCreek',
    maxPower: 7.2,
    connectorType: 'J1772',
    installationDate: '2021-09-15',
    networkProvider: 'Independent',
    level: 'Level 2'
  },
  {
    id: 'ev_009',
    locationId: 'loc_205',
    modelNumber: 'ChargePoint Express Plus',
    manufacturer: 'ChargePoint Inc.',
    maxPower: 62.5,
    connectorType: 'CCS1',
    installationDate: '2024-02-15',
    networkProvider: 'ChargePoint',
    level: 'DC Fast'
  },
  {
    id: 'ev_010',
    locationId: 'loc_205',
    modelNumber: 'ChargePoint CT4000',
    manufacturer: 'ChargePoint Inc.',
    maxPower: 7.2,
    connectorType: 'J1772',
    installationDate: '2024-02-15',
    networkProvider: 'ChargePoint',
    level: 'Level 2'
  }
];

export const buildingEquipment: BuildingEquipment[] = [
  {
    id: 'building_001',
    locationId: 'loc_301',
    name: 'Engineering Building',
    type: 'academic',
    maxCapacity: 1200,
    floorArea: 250000,
    occupancy: 2500,
    hvacSystem: 'Variable Air Volume (VAV)',
    constructionYear: 1985
  },
  {
    id: 'building_002',
    locationId: 'loc_302',
    name: 'Library Complex',
    type: 'academic',
    maxCapacity: 600,
    floorArea: 180000,
    occupancy: 1200,
    hvacSystem: 'Constant Air Volume (CAV)',
    constructionYear: 1970
  },
  {
    id: 'building_003',
    locationId: 'loc_303',
    name: 'Student Center',
    type: 'recreational',
    maxCapacity: 800,
    floorArea: 120000,
    occupancy: 1500,
    hvacSystem: 'Variable Refrigerant Flow (VRF)',
    constructionYear: 1995
  },
  {
    id: 'building_004',
    locationId: 'loc_304',
    name: 'Science Laboratory',
    type: 'academic',
    maxCapacity: 1000,
    floorArea: 200000,
    occupancy: 1800,
    hvacSystem: '100% Outside Air System',
    constructionYear: 2010
  },
  {
    id: 'building_005',
    locationId: 'loc_305',
    name: 'Dormitory A',
    type: 'residential',
    maxCapacity: 500,
    floorArea: 150000,
    occupancy: 800,
    hvacSystem: 'Heat Pump System',
    constructionYear: 2005
  },
  {
    id: 'building_006',
    locationId: 'loc_306',
    name: 'Dormitory B',
    type: 'residential',
    maxCapacity: 500,
    floorArea: 150000,
    occupancy: 800,
    hvacSystem: 'Heat Pump System',
    constructionYear: 2008
  },
  {
    id: 'building_007',
    locationId: 'loc_307',
    name: 'Sports Complex',
    type: 'recreational',
    maxCapacity: 700,
    floorArea: 100000,
    occupancy: 1000,
    hvacSystem: 'Dedicated Outdoor Air System (DOAS)',
    constructionYear: 2015
  },
  {
    id: 'building_008',
    locationId: 'loc_308',
    name: 'Administration Building',
    type: 'administrative',
    maxCapacity: 400,
    floorArea: 80000,
    occupancy: 300,
    hvacSystem: 'Variable Air Volume (VAV)',
    constructionYear: 1960
  },
  {
    id: 'building_009',
    locationId: 'loc_309',
    name: 'Life Science Laboratory',
    type: 'academic',
    maxCapacity: 1850, // Total calculated power consumption: 18.5 kW
    floorArea: 320000,
    occupancy: 1200,
    hvacSystem: '100% Outside Air System with HEPA Filtration',
    constructionYear: 2024
  }
];

// Life Science Laboratory Equipment Specifications
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

export const lifeScienceLabEquipment: LabEquipmentSpec[] = [
  {
    id: 'lab_incubators',
    name: 'Laboratory Incubators',
    quantity: 32,
    powerPerUnit: 313, // W
    totalPower: 10.016, // kW (32 × 313W = 10,016W)
    annualEnergyPerUnit: 2738, // kWh/year
    totalAnnualEnergy: 87616, // kWh/year (32 × 2,738)
    operatingHours: '24/7 continuous operation',
    category: 'incubation'
  },
  {
    id: 'lab_misc_equipment',
    name: 'Miscellaneous Department Equipment',
    quantity: 51,
    powerPerUnit: 184, // W
    totalPower: 9.384, // kW (51 × 184W = 9,384W)
    annualEnergyPerUnit: 1609, // kWh/year
    totalAnnualEnergy: 82059, // kWh/year (51 × 1,609)
    operatingHours: '8 AM - 6 PM weekdays',
    category: 'analysis'
  },
  {
    id: 'lab_water_baths',
    name: 'Laboratory Water Baths',
    quantity: 8,
    powerPerUnit: 289, // W
    totalPower: 2.312, // kW (8 × 289W = 2,312W)
    annualEnergyPerUnit: 2528, // kWh/year
    totalAnnualEnergy: 20224, // kWh/year (8 × 2,528)
    operatingHours: '7 AM - 8 PM daily',
    category: 'preparation'
  },
  {
    id: 'lab_centrifuges',
    name: 'Laboratory Centrifuges',
    quantity: 18,
    powerPerUnit: 128, // W
    totalPower: 2.304, // kW (18 × 128W = 2,304W)
    annualEnergyPerUnit: 1118, // kWh/year
    totalAnnualEnergy: 20124, // kWh/year (18 × 1,118)
    operatingHours: '6 AM - 10 PM daily',
    category: 'analysis'
  },
  {
    id: 'lab_ovens',
    name: 'Laboratory Ovens',
    quantity: 4,
    powerPerUnit: 302, // W
    totalPower: 1.208, // kW (4 × 302W = 1,208W)
    annualEnergyPerUnit: 2649, // kWh/year
    totalAnnualEnergy: 10596, // kWh/year (4 × 2,649)
    operatingHours: '6 AM - 11 PM daily',
    category: 'preparation'
  },
  {
    id: 'lab_fume_cupboards',
    name: 'Laboratory Fume Cupboards',
    quantity: 16,
    powerPerUnit: 50, // W
    totalPower: 0.8, // kW (16 × 50W = 800W)
    annualEnergyPerUnit: 436, // kWh/year
    totalAnnualEnergy: 6976, // kWh/year (16 × 436)
    operatingHours: '24/7 safety ventilation',
    category: 'safety'
  },
  {
    id: 'lab_shakers',
    name: 'Laboratory Shakers',
    quantity: 8,
    powerPerUnit: 96, // W
    totalPower: 0.768, // kW (8 × 96W = 768W)
    annualEnergyPerUnit: 841, // kWh/year
    totalAnnualEnergy: 6728, // kWh/year (8 × 841)
    operatingHours: '6 AM - 10 PM daily',
    category: 'mixing'
  }
];

// Calculate total laboratory power consumption
export const getTotalLabPowerConsumption = (): number => {
  return lifeScienceLabEquipment.reduce((total, equipment) => total + equipment.totalPower, 0);
};

// Calculate total annual energy consumption
export const getTotalLabAnnualEnergy = (): number => {
  return lifeScienceLabEquipment.reduce((total, equipment) => total + equipment.totalAnnualEnergy, 0);
};

// Laboratory power consumption summary
export const labPowerSummary = {
  totalEquipmentPower: getTotalLabPowerConsumption(), // 26.792 kW
  totalAnnualEnergy: getTotalLabAnnualEnergy(), // 234,323 kWh/year
  averageDailyEnergy: getTotalLabAnnualEnergy() / 365, // 642 kWh/day
  peakOperatingHours: '6 AM - 10 PM',
  continuousOperationEquipment: ['Incubators', 'Fume Cupboards'],
  equipmentCategories: {
    incubation: lifeScienceLabEquipment.filter(eq => eq.category === 'incubation').length,
    analysis: lifeScienceLabEquipment.filter(eq => eq.category === 'analysis').length,
    preparation: lifeScienceLabEquipment.filter(eq => eq.category === 'preparation').length,
    safety: lifeScienceLabEquipment.filter(eq => eq.category === 'safety').length,
    mixing: lifeScienceLabEquipment.filter(eq => eq.category === 'mixing').length
  }
};