import React from 'react';
import { 
  Info, 
  Thermometer, 
  Zap, 
  Calendar,
  Wrench,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface EquipmentTooltipProps {
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  position: { x: number; y: number };
  onClose: () => void;
}

// Mock equipment specifications for tooltip
const equipmentSpecs: { [key: string]: any } = {
  'solar_001': {
    manufacturer: 'SunPower Corporation',
    model: 'SPR-X22-370',
    capacity: '200 kW',
    efficiency: '22.8%',
    optimalTemp: '25°C',
    optimalIrradiance: '1000 W/m²',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    currentOutput: '145 kW',
    status: 'Optimal'
  },
  'battery_001': {
    manufacturer: 'Tesla Inc.',
    model: 'Megapack 2XL',
    capacity: '1000 kWh',
    maxChargeRate: '250 kW',
    maxDischargeRate: '250 kW',
    optimalTemp: '15-25°C',
    currentCharge: '75%',
    cycleCount: '1,247',
    efficiency: '95.2%',
    status: 'Good'
  },
  'ev_001': {
    manufacturer: 'ChargePoint Inc.',
    model: 'CT4000',
    maxPower: '7.2 kW',
    connectorType: 'J1772',
    networkProvider: 'ChargePoint',
    optimalTemp: '-30 to 50°C',
    currentSession: 'Active',
    totalSessions: '2,847',
    uptime: '99.2%',
    status: 'Online'
  }
};

const EquipmentTooltip: React.FC<EquipmentTooltipProps> = ({
  equipmentId,
  equipmentName,
  equipmentType,
  position,
  onClose
}) => {
  const specs = equipmentSpecs[equipmentId] || {};

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar':
        return <TrendingUp className="h-4 w-4 text-amber-600" />;
      case 'battery':
        return <Zap className="h-4 w-4 text-green-600" />;
      case 'ev_charger':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'optimal':
      case 'good':
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div 
      className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 max-w-sm"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
        marginTop: '-10px'
      }}
    >
      {/* Arrow */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getTypeIcon(equipmentType)}
          <h3 className="font-semibold text-gray-900 text-sm">{equipmentName}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Status */}
      {specs.status && (
        <div className="mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(specs.status)}`}>
            {specs.status}
          </span>
        </div>
      )}

      {/* Specifications */}
      <div className="space-y-2 text-xs">
        {specs.manufacturer && (
          <div className="flex justify-between">
            <span className="text-gray-600">Manufacturer:</span>
            <span className="font-medium text-gray-900">{specs.manufacturer}</span>
          </div>
        )}
        
        {specs.model && (
          <div className="flex justify-between">
            <span className="text-gray-600">Model:</span>
            <span className="font-medium text-gray-900">{specs.model}</span>
          </div>
        )}
        
        {specs.capacity && (
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-medium text-gray-900">{specs.capacity}</span>
          </div>
        )}

        {/* Type-specific information */}
        {equipmentType === 'solar' && (
          <>
            {specs.currentOutput && (
              <div className="flex justify-between">
                <span className="text-gray-600">Current Output:</span>
                <span className="font-medium text-green-600">{specs.currentOutput}</span>
              </div>
            )}
            {specs.efficiency && (
              <div className="flex justify-between">
                <span className="text-gray-600">Efficiency:</span>
                <span className="font-medium text-gray-900">{specs.efficiency}</span>
              </div>
            )}
          </>
        )}

        {equipmentType === 'battery' && (
          <>
            {specs.currentCharge && (
              <div className="flex justify-between">
                <span className="text-gray-600">Current Charge:</span>
                <span className="font-medium text-blue-600">{specs.currentCharge}</span>
              </div>
            )}
            {specs.cycleCount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cycle Count:</span>
                <span className="font-medium text-gray-900">{specs.cycleCount}</span>
              </div>
            )}
          </>
        )}

        {equipmentType === 'ev_charger' && (
          <>
            {specs.currentSession && (
              <div className="flex justify-between">
                <span className="text-gray-600">Session:</span>
                <span className="font-medium text-blue-600">{specs.currentSession}</span>
              </div>
            )}
            {specs.uptime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span className="font-medium text-green-600">{specs.uptime}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Optimal Conditions */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center space-x-1 mb-2">
          <Thermometer className="h-3 w-3 text-blue-500" />
          <span className="text-xs font-medium text-gray-700">Optimal Conditions</span>
        </div>
        <div className="space-y-1 text-xs">
          {specs.optimalTemp && (
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-medium text-gray-900">{specs.optimalTemp}</span>
            </div>
          )}
          {specs.optimalIrradiance && (
            <div className="flex justify-between">
              <span className="text-gray-600">Irradiance:</span>
              <span className="font-medium text-gray-900">{specs.optimalIrradiance}</span>
            </div>
          )}
        </div>
      </div>

      {/* Maintenance */}
      {(specs.lastMaintenance || specs.nextMaintenance) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-1 mb-2">
            <Wrench className="h-3 w-3 text-purple-500" />
            <span className="text-xs font-medium text-gray-700">Maintenance</span>
          </div>
          <div className="space-y-1 text-xs">
            {specs.lastMaintenance && (
              <div className="flex justify-between">
                <span className="text-gray-600">Last:</span>
                <span className="font-medium text-gray-900">{specs.lastMaintenance}</span>
              </div>
            )}
            {specs.nextMaintenance && (
              <div className="flex justify-between">
                <span className="text-gray-600">Next:</span>
                <span className="font-medium text-gray-900">{specs.nextMaintenance}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTooltip;