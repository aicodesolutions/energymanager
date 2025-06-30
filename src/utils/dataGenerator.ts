import { EnergyDataPoint } from '../types/equipment';
import { 
  solarPanelEquipment, 
  batteryEquipment, 
  evChargerEquipment, 
  buildingEquipment,
  lifeScienceLabEquipment
} from '../data/equipmentDatabase';

// Weather conditions affecting solar generation
const weatherPatterns = [
  { condition: 'sunny', solarMultiplier: 1.0, probability: 0.4 },
  { condition: 'partly_cloudy', solarMultiplier: 0.7, probability: 0.35 },
  { condition: 'cloudy', solarMultiplier: 0.3, probability: 0.2 },
  { condition: 'rainy', solarMultiplier: 0.1, probability: 0.05 }
] as const;

// Seasonal variations (0-1 multiplier)
const getSeasonalMultiplier = (month: number): number => {
  const seasonalFactors = [0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6];
  return seasonalFactors[month - 1];
};

// Solar irradiance curve (simplified)
const getSolarIrradiance = (hour: number): number => {
  if (hour < 6 || hour >= 19) return 0;
  const solarHours = hour - 6;
  const peakHour = 6.5; // 12:30 PM
  const maxIrradiance = 1000; // W/m²
  
  // Bell curve approximation
  const normalizedHour = (solarHours - peakHour) / 3;
  return maxIrradiance * Math.exp(-0.5 * normalizedHour * normalizedHour);
};

// Building consumption patterns
const getBuildingConsumption = (
  building: typeof buildingEquipment[0], 
  hour: number, 
  dayOfWeek: number
): number => {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  let baseLoad = 0.15; // 15% minimum load
  let peakLoad = 0.85; // 85% peak load
  
  switch (building.type) {
    case 'academic':
      if (isWeekend) {
        baseLoad = 0.1;
        peakLoad = 0.3;
      }
      // Peak hours: 8 AM - 5 PM on weekdays
      if (hour >= 8 && hour <= 17 && !isWeekend) {
        return building.maxCapacity * (peakLoad + Math.random() * 0.15);
      } else {
        return building.maxCapacity * (baseLoad + Math.random() * 0.15);
      }
      
    case 'residential':
      // Peak hours: 6-8 AM and 6-11 PM
      if ((hour >= 6 && hour <= 8) || (hour >= 18 && hour <= 23)) {
        return building.maxCapacity * (0.7 + Math.random() * 0.2);
      } else if (hour >= 23 || hour <= 6) {
        return building.maxCapacity * (0.4 + Math.random() * 0.1);
      } else {
        return building.maxCapacity * (0.5 + Math.random() * 0.15);
      }
      
    case 'recreational':
      if (isWeekend) {
        peakLoad = 0.9;
      }
      // Peak hours: 6 AM - 10 PM
      if (hour >= 6 && hour <= 22) {
        return building.maxCapacity * (peakLoad + Math.random() * 0.1);
      } else {
        return building.maxCapacity * (0.2 + Math.random() * 0.1);
      }
      
    case 'administrative':
      if (isWeekend) {
        return building.maxCapacity * (0.1 + Math.random() * 0.05);
      }
      // Peak hours: 8 AM - 5 PM on weekdays
      if (hour >= 8 && hour <= 17) {
        return building.maxCapacity * (0.8 + Math.random() * 0.15);
      } else {
        return building.maxCapacity * (0.2 + Math.random() * 0.1);
      }
      
    default:
      return building.maxCapacity * (0.3 + Math.random() * 0.2);
  }
};

// Life Science Laboratory consumption patterns
const getLabConsumption = (hour: number, dayOfWeek: number): { 
  totalConsumption: number;
  equipmentStatus: {
    incubators: { active: number; power: number };
    miscEquipment: { active: number; power: number };
    waterBaths: { active: number; power: number };
    centrifuges: { active: number; power: number };
    ovens: { active: number; power: number };
    fumeCupboards: { active: number; power: number };
    shakers: { active: number; power: number };
  };
} => {
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const equipmentStatus = {
    incubators: { active: 0, power: 0 },
    miscEquipment: { active: 0, power: 0 },
    waterBaths: { active: 0, power: 0 },
    centrifuges: { active: 0, power: 0 },
    ovens: { active: 0, power: 0 },
    fumeCupboards: { active: 0, power: 0 },
    shakers: { active: 0, power: 0 }
  };

  lifeScienceLabEquipment.forEach(equipment => {
    let activeRatio = 0;
    
    switch (equipment.id) {
      case 'lab_incubators':
        // 24/7 continuous operation with 90-95% active
        activeRatio = 0.90 + Math.random() * 0.05;
        equipmentStatus.incubators.active = Math.floor(equipment.quantity * activeRatio);
        equipmentStatus.incubators.power = (equipmentStatus.incubators.active * equipment.powerPerUnit) / 1000;
        break;
        
      case 'lab_misc_equipment':
        // 8 AM - 6 PM weekdays, reduced weekends
        if (isWeekend) {
          activeRatio = 0.2 + Math.random() * 0.1;
        } else if (hour >= 8 && hour <= 18) {
          activeRatio = 0.75 + Math.random() * 0.15;
        } else {
          activeRatio = 0.1 + Math.random() * 0.1;
        }
        equipmentStatus.miscEquipment.active = Math.floor(equipment.quantity * activeRatio);
        equipmentStatus.miscEquipment.power = (equipmentStatus.miscEquipment.active * equipment.powerPerUnit) / 1000;
        break;
        
      case 'lab_water_baths':
        // 7 AM - 8 PM daily
        if (hour >= 7 && hour <= 20) {
          activeRatio = 0.8 + Math.random() * 0.15;
        } else {
          activeRatio = 0.3 + Math.random() * 0.2;
        }
        equipmentStatus.waterBaths.active = Math.floor(equipment.quantity * activeRatio);
        equipmentStatus.waterBaths.power = (equipmentStatus.waterBaths.active * equipment.powerPerUnit) / 1000;
        break;
        
      case 'lab_centrifuges':
        // 6 AM - 10 PM daily, intermittent use
        if (hour >= 6 && hour <= 22) {
          activeRatio = 0.4 + Math.random() * 0.3; // Intermittent operation
        } else {
          activeRatio = 0.1 + Math.random() * 0.1;
        }
        equipmentStatus.centrifuges.active = Math.floor(equipment.quantity * activeRatio);
        equipmentStatus.centrifuges.power = (equipmentStatus.centrifuges.active * equipment.powerPerUnit) / 1000;
        break;
        
      case 'lab_ovens':
        // 6 AM - 11 PM daily
        if (hour >= 6 && hour <= 23) {
          activeRatio = 0.6 + Math.random() * 0.25;
        } else {
          activeRatio = 0.2 + Math.random() * 0.1;
        }
        equipmentStatus.ovens.active = Math.floor(equipment.quantity * activeRatio);
        equipmentStatus.ovens.power = (equipmentStatus.ovens.active * equipment.powerPerUnit) / 1000;
        break;
        
      case 'lab_fume_cupboards':
        // 24/7 safety ventilation - always 100% active
        activeRatio = 1.0;
        equipmentStatus.fumeCupboards.active = equipment.quantity;
        equipmentStatus.fumeCupboards.power = (equipmentStatus.fumeCupboards.active * equipment.powerPerUnit) / 1000;
        break;
        
      case 'lab_shakers':
        // 6 AM - 10 PM daily
        if (hour >= 6 && hour <= 22) {
          activeRatio = 0.65 + Math.random() * 0.25;
        } else {
          activeRatio = 0.15 + Math.random() * 0.1;
        }
        equipmentStatus.shakers.active = Math.floor(equipment.quantity * activeRatio);
        equipmentStatus.shakers.power = (equipmentStatus.shakers.active * equipment.powerPerUnit) / 1000;
        break;
    }
  });

  const totalConsumption = Object.values(equipmentStatus).reduce((sum, eq) => sum + eq.power, 0);
  
  return { totalConsumption, equipmentStatus };
};

// EV charging patterns
const getEVChargingStatus = (hour: number, chargerId: string): { status: 'available' | 'occupied' | 'offline', power: number } => {
  const random = Math.random();
  
  // Higher occupancy during work hours and evening
  let occupancyProbability = 0.2;
  if (hour >= 8 && hour <= 17) occupancyProbability = 0.6; // Work hours
  if (hour >= 18 && hour <= 22) occupancyProbability = 0.8; // Evening
  
  // 5% chance of being offline
  if (random < 0.05) {
    return { status: 'offline', power: 0 };
  }
  
  if (random < occupancyProbability) {
    const charger = evChargerEquipment.find(eq => eq.id === chargerId);
    const power = charger ? charger.maxPower * (0.7 + Math.random() * 0.3) : 7.2;
    return { status: 'occupied', power };
  }
  
  return { status: 'available', power: 0 };
};

// Battery management logic
let batteryStates: { [key: string]: { charge: number, mode: 'charging' | 'discharging' | 'idle' } } = {};

const getBatteryState = (
  batteryId: string, 
  hour: number, 
  totalSolarGeneration: number, 
  totalConsumption: number
): { charge: number, chargingRate: number, mode: 'charging' | 'discharging' | 'idle' } => {
  const battery = batteryEquipment.find(b => b.id === batteryId);
  if (!battery) return { charge: 50, chargingRate: 0, mode: 'idle' };
  
  // Initialize battery state if not exists
  if (!batteryStates[batteryId]) {
    batteryStates[batteryId] = { charge: 50 + Math.random() * 30, mode: 'idle' };
  }
  
  const currentState = batteryStates[batteryId];
  const netGeneration = totalSolarGeneration - totalConsumption;
  
  let newCharge = currentState.charge;
  let chargingRate = 0;
  let mode: 'charging' | 'discharging' | 'idle' = 'idle';
  
  // Charging logic: excess solar generation
  if (netGeneration > 50 && currentState.charge < 95) {
    mode = 'charging';
    chargingRate = Math.min(battery.maxChargeRate, netGeneration * 0.3);
    newCharge = Math.min(100, currentState.charge + (chargingRate / battery.capacity) * 100 * 0.25);
  }
  // Discharging logic: high demand or peak hours
  else if ((netGeneration < -100 || (hour >= 17 && hour <= 21)) && currentState.charge > 20) {
    mode = 'discharging';
    chargingRate = -Math.min(battery.maxDischargeRate, Math.abs(netGeneration) * 0.4);
    newCharge = Math.max(0, currentState.charge + (chargingRate / battery.capacity) * 100 * 0.25);
  }
  // Natural discharge (standby losses)
  else {
    newCharge = Math.max(0, currentState.charge - 0.1);
  }
  
  batteryStates[batteryId] = { charge: newCharge, mode };
  
  return { charge: newCharge, chargingRate, mode };
};

export const generateEnergyData = (startDate: Date = new Date()): EnergyDataPoint[] => {
  const data: EnergyDataPoint[] = [];
  const currentMonth = startDate.getMonth() + 1;
  const seasonalMultiplier = getSeasonalMultiplier(currentMonth);
  
  // Generate weather pattern for the day
  const dailyWeather = weatherPatterns[Math.floor(Math.random() * weatherPatterns.length)];
  
  // Generate data for 24 hours, every 15 minutes (96 data points per equipment)
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timestamp = new Date(startDate);
      timestamp.setHours(hour, minute, 0, 0);
      const timestampStr = timestamp.toISOString().replace('T', ' ').substring(0, 19);
      
      const dayOfWeek = timestamp.getDay();
      const temperature = 20 + Math.sin((hour - 6) * Math.PI / 12) * 8 + Math.random() * 4;
      
      // Calculate total solar generation for battery management
      let totalSolarGeneration = 0;
      
      // Solar panel data
      solarPanelEquipment.forEach(solar => {
        const irradiance = getSolarIrradiance(hour + minute / 60);
        const weatherMultiplier = dailyWeather.solarMultiplier;
        const efficiency = 0.18 + Math.random() * 0.04; // 18-22% efficiency
        
        let powerGeneration = 0;
        let voltage = 0;
        let current = 0;
        
        if (irradiance > 0) {
          powerGeneration = (solar.capacity * (irradiance / 1000) * weatherMultiplier * seasonalMultiplier * efficiency);
          voltage = 400 + Math.random() * 50; // DC voltage
          current = powerGeneration * 1000 / voltage; // I = P/V
        }
        
        totalSolarGeneration += powerGeneration;
        
        data.push({
          timestamp: timestampStr,
          equipmentId: solar.id,
          equipmentType: 'solar',
          powerGeneration: Math.round(powerGeneration * 100) / 100,
          voltage: Math.round(voltage * 10) / 10,
          current: Math.round(current * 100) / 100,
          temperature: Math.round(temperature * 10) / 10,
          weatherCondition: dailyWeather.condition
        });
      });
      
      // Calculate total building consumption for battery management
      let totalConsumption = 0;
      
      // Building consumption data (excluding Life Science Laboratory)
      buildingEquipment.filter(building => building.id !== 'building_009').forEach(building => {
        const consumption = getBuildingConsumption(building, hour, dayOfWeek);
        totalConsumption += consumption;
        
        data.push({
          timestamp: timestampStr,
          equipmentId: building.id,
          equipmentType: 'building',
          powerConsumption: Math.round(consumption * 100) / 100,
          temperature: Math.round(temperature * 10) / 10,
          weatherCondition: dailyWeather.condition
        });
      });

      // Life Science Laboratory data (special handling)
      const labData = getLabConsumption(hour, dayOfWeek);
      totalConsumption += labData.totalConsumption;
      
      data.push({
        timestamp: timestampStr,
        equipmentId: 'building_009',
        equipmentType: 'laboratory',
        powerConsumption: Math.round(labData.totalConsumption * 100) / 100,
        labEquipmentStatus: labData.equipmentStatus,
        temperature: Math.round(temperature * 10) / 10,
        weatherCondition: dailyWeather.condition
      });
      
      // Battery data (depends on solar generation and consumption)
      batteryEquipment.forEach(battery => {
        const batteryState = getBatteryState(battery.id, hour, totalSolarGeneration, totalConsumption);
        
        data.push({
          timestamp: timestampStr,
          equipmentId: battery.id,
          equipmentType: 'battery',
          chargeLevel: Math.round(batteryState.charge * 10) / 10,
          chargingRate: Math.round(batteryState.chargingRate * 100) / 100,
          temperature: Math.round(temperature * 10) / 10,
          weatherCondition: dailyWeather.condition
        });
      });
      
      // EV charger data
      evChargerEquipment.forEach(charger => {
        const chargingData = getEVChargingStatus(hour, charger.id);
        
        data.push({
          timestamp: timestampStr,
          equipmentId: charger.id,
          equipmentType: 'ev_charger',
          powerConsumption: Math.round(chargingData.power * 100) / 100,
          chargingStatus: chargingData.status,
          temperature: Math.round(temperature * 10) / 10,
          weatherCondition: dailyWeather.condition
        });
      });
    }
  }
  
  return data;
};

export const generateCSVData = (data: EnergyDataPoint[]): string => {
  const headers = [
    'Timestamp',
    'Equipment_ID',
    'Equipment_Type',
    'Power_Generation_kW',
    'Voltage_V',
    'Current_A',
    'Charge_Level_%',
    'Charging_Rate_kW',
    'Power_Consumption_kW',
    'Charging_Status',
    'Lab_Incubators_Active',
    'Lab_Incubators_Power_kW',
    'Lab_MiscEquipment_Active',
    'Lab_MiscEquipment_Power_kW',
    'Lab_WaterBaths_Active',
    'Lab_WaterBaths_Power_kW',
    'Lab_Centrifuges_Active',
    'Lab_Centrifuges_Power_kW',
    'Lab_Ovens_Active',
    'Lab_Ovens_Power_kW',
    'Lab_FumeCupboards_Active',
    'Lab_FumeCupboards_Power_kW',
    'Lab_Shakers_Active',
    'Lab_Shakers_Power_kW',
    'Temperature_C',
    'Weather_Condition'
  ];
  
  const csvRows = [headers.join(',')];
  
  data.forEach(point => {
    const row = [
      point.timestamp,
      point.equipmentId,
      point.equipmentType,
      point.powerGeneration || '',
      point.voltage || '',
      point.current || '',
      point.chargeLevel || '',
      point.chargingRate || '',
      point.powerConsumption || '',
      point.chargingStatus || '',
      point.labEquipmentStatus?.incubators?.active || '',
      point.labEquipmentStatus?.incubators?.power || '',
      point.labEquipmentStatus?.miscEquipment?.active || '',
      point.labEquipmentStatus?.miscEquipment?.power || '',
      point.labEquipmentStatus?.waterBaths?.active || '',
      point.labEquipmentStatus?.waterBaths?.power || '',
      point.labEquipmentStatus?.centrifuges?.active || '',
      point.labEquipmentStatus?.centrifuges?.power || '',
      point.labEquipmentStatus?.ovens?.active || '',
      point.labEquipmentStatus?.ovens?.power || '',
      point.labEquipmentStatus?.fumeCupboards?.active || '',
      point.labEquipmentStatus?.fumeCupboards?.power || '',
      point.labEquipmentStatus?.shakers?.active || '',
      point.labEquipmentStatus?.shakers?.power || '',
      point.temperature || '',
      point.weatherCondition || ''
    ];
    csvRows.push(row.join(','));
  });
  
  return csvRows.join('\n');
};