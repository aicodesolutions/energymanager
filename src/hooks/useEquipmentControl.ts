import { useState, useCallback, useEffect } from 'react';
import { EquipmentStatus, EquipmentStatusChange, StatusAlert, EquipmentSpecs } from '../types/equipment';

interface EquipmentControlState {
  [equipmentId: string]: {
    status: EquipmentStatus;
    consumption: number;
    generation?: number;
    lastUpdate: Date;
    isChanging: boolean;
  };
}

interface UseEquipmentControlReturn {
  equipmentStates: EquipmentControlState;
  statusHistory: EquipmentStatusChange[];
  alerts: StatusAlert[];
  changeEquipmentStatus: (
    equipmentId: string,
    newStatus: EquipmentStatus,
    reason?: string
  ) => Promise<boolean>;
  acknowledgeAlert: (alertId: string) => void;
  getHistoricalData: (equipmentId: string, days: number) => EquipmentStatusChange[];
  isStatusChangeAllowed: (equipmentId: string, newStatus: EquipmentStatus) => {
    allowed: boolean;
    conflicts: string[];
  };
}

// Mock equipment specifications
const equipmentSpecs: { [key: string]: EquipmentSpecs } = {
  'solar_001': {
    id: 'solar_001',
    name: 'Engineering Building Solar Array',
    type: 'solar',
    manufacturer: 'SunPower Corporation',
    model: 'SPR-X22-370',
    capacity: 200,
    optimalOperatingConditions: {
      temperature: { min: -40, max: 85 },
      voltage: { min: 380, max: 450 }
    },
    maintenanceSchedule: {
      lastMaintenance: new Date('2024-01-15'),
      nextMaintenance: new Date('2024-07-15'),
      frequency: 'Semi-annual'
    },
    energyProfile: {
      onConsumption: 2,
      standbyConsumption: 0.5,
      offConsumption: 0,
      onGeneration: 200,
      standbyGeneration: 0
    }
  },
  'battery_001': {
    id: 'battery_001',
    name: 'Main Battery Storage',
    type: 'battery',
    manufacturer: 'Tesla Inc.',
    model: 'Megapack 2XL',
    capacity: 1000,
    optimalOperatingConditions: {
      temperature: { min: -20, max: 50 },
      humidity: { min: 5, max: 95 }
    },
    maintenanceSchedule: {
      lastMaintenance: new Date('2024-02-01'),
      nextMaintenance: new Date('2024-08-01'),
      frequency: 'Semi-annual'
    },
    energyProfile: {
      onConsumption: 5,
      standbyConsumption: 2,
      offConsumption: 0
    }
  },
  'ev_001': {
    id: 'ev_001',
    name: 'Main Parking EV Charger',
    type: 'ev_charger',
    manufacturer: 'ChargePoint Inc.',
    model: 'CT4000',
    capacity: 7.2,
    optimalOperatingConditions: {
      temperature: { min: -30, max: 50 },
      humidity: { min: 5, max: 95 }
    },
    maintenanceSchedule: {
      lastMaintenance: new Date('2024-01-10'),
      nextMaintenance: new Date('2024-07-10'),
      frequency: 'Semi-annual'
    },
    energyProfile: {
      onConsumption: 7.2,
      standbyConsumption: 0.1,
      offConsumption: 0
    }
  }
};

// Mock scheduled operations
const scheduledOperations = [
  {
    equipmentId: 'solar_001',
    operation: 'MAINTENANCE',
    startTime: new Date('2024-12-20T09:00:00'),
    endTime: new Date('2024-12-20T17:00:00')
  },
  {
    equipmentId: 'battery_001',
    operation: 'PEAK_SHAVING',
    startTime: new Date('2024-12-19T17:00:00'),
    endTime: new Date('2024-12-19T21:00:00')
  }
];

export const useEquipmentControl = (): UseEquipmentControlReturn => {
  const [equipmentStates, setEquipmentStates] = useState<EquipmentControlState>({});
  const [statusHistory, setStatusHistory] = useState<EquipmentStatusChange[]>([]);
  const [alerts, setAlerts] = useState<StatusAlert[]>([]);

  // Initialize equipment states
  useEffect(() => {
    const initialStates: EquipmentControlState = {};
    
    // Initialize with some default states
    Object.keys(equipmentSpecs).forEach(equipmentId => {
      const spec = equipmentSpecs[equipmentId];
      initialStates[equipmentId] = {
        status: 'ON',
        consumption: spec.energyProfile.onConsumption,
        generation: spec.energyProfile.onGeneration,
        lastUpdate: new Date(),
        isChanging: false
      };
    });

    setEquipmentStates(initialStates);
  }, []);

  const isStatusChangeAllowed = useCallback((
    equipmentId: string,
    newStatus: EquipmentStatus
  ): { allowed: boolean; conflicts: string[] } => {
    const conflicts: string[] = [];
    const now = new Date();

    // Check for scheduled operations
    const scheduledOp = scheduledOperations.find(op => 
      op.equipmentId === equipmentId &&
      now >= op.startTime &&
      now <= op.endTime
    );

    if (scheduledOp) {
      conflicts.push(`Scheduled ${scheduledOp.operation} in progress until ${scheduledOp.endTime.toLocaleTimeString()}`);
    }

    // Check maintenance schedule
    const spec = equipmentSpecs[equipmentId];
    if (spec && spec.maintenanceSchedule.nextMaintenance < now) {
      conflicts.push('Equipment maintenance is overdue');
    }

    // Check energy optimization conflicts
    if (newStatus === 'OFF' && spec?.type === 'solar') {
      const currentHour = now.getHours();
      if (currentHour >= 10 && currentHour <= 16) {
        conflicts.push('Turning off solar during peak generation hours may impact energy optimization');
      }
    }

    return {
      allowed: conflicts.length === 0,
      conflicts
    };
  }, []);

  const changeEquipmentStatus = useCallback(async (
    equipmentId: string,
    newStatus: EquipmentStatus,
    reason?: string
  ): Promise<boolean> => {
    const currentState = equipmentStates[equipmentId];
    if (!currentState) return false;

    // Check if change is allowed
    const { allowed, conflicts } = isStatusChangeAllowed(equipmentId, newStatus);
    
    if (!allowed) {
      // Create alert for conflicts
      const alert: StatusAlert = {
        id: `alert_${Date.now()}`,
        type: 'WARNING',
        message: `Status change blocked: ${conflicts.join(', ')}`,
        equipmentId,
        timestamp: new Date(),
        acknowledged: false,
        conflictType: 'SCHEDULED_OPERATION'
      };
      setAlerts(prev => [alert, ...prev]);
      return false;
    }

    // Set changing state
    setEquipmentStates(prev => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        isChanging: true
      }
    }));

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const spec = equipmentSpecs[equipmentId];
    if (!spec) return false;

    // Calculate new consumption/generation based on status
    let newConsumption = 0;
    let newGeneration = 0;

    switch (newStatus) {
      case 'ON':
        newConsumption = spec.energyProfile.onConsumption;
        newGeneration = spec.energyProfile.onGeneration || 0;
        break;
      case 'STANDBY':
        newConsumption = spec.energyProfile.standbyConsumption;
        newGeneration = spec.energyProfile.standbyGeneration || 0;
        break;
      case 'OFF':
      case 'MAINTENANCE':
        newConsumption = spec.energyProfile.offConsumption;
        newGeneration = 0;
        break;
    }

    // Update equipment state
    setEquipmentStates(prev => ({
      ...prev,
      [equipmentId]: {
        status: newStatus,
        consumption: newConsumption,
        generation: newGeneration,
        lastUpdate: new Date(),
        isChanging: false
      }
    }));

    // Log status change
    const statusChange: EquipmentStatusChange = {
      id: `change_${Date.now()}`,
      equipmentId,
      equipmentType: spec.type,
      previousStatus: currentState.status,
      newStatus,
      timestamp: new Date(),
      userId: 'energy_manager', // In real app, get from auth
      reason,
      scheduledOperation: false,
      energyImpact: {
        previousConsumption: currentState.consumption,
        newConsumption,
        previousGeneration: currentState.generation,
        newGeneration
      }
    };

    setStatusHistory(prev => [statusChange, ...prev]);

    // Create success alert
    const successAlert: StatusAlert = {
      id: `alert_${Date.now()}`,
      type: 'INFO',
      message: `${spec.name} status changed to ${newStatus}`,
      equipmentId,
      timestamp: new Date(),
      acknowledged: false
    };
    setAlerts(prev => [successAlert, ...prev]);

    return true;
  }, [equipmentStates, isStatusChangeAllowed]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const getHistoricalData = useCallback((equipmentId: string, days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return statusHistory.filter(change => 
      change.equipmentId === equipmentId && 
      change.timestamp >= cutoffDate
    );
  }, [statusHistory]);

  return {
    equipmentStates,
    statusHistory,
    alerts,
    changeEquipmentStatus,
    acknowledgeAlert,
    getHistoricalData,
    isStatusChangeAllowed
  };
};