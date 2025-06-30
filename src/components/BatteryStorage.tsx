import React from 'react';
import { Battery, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BatterySystem } from '../types';

interface BatteryStorageProps {
  batteries: BatterySystem[];
}

const BatteryStorage: React.FC<BatteryStorageProps> = ({ batteries }) => {
  const getStatusIcon = (status: BatterySystem['status'], power: number) => {
    switch (status) {
      case 'charging':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'discharging':
        return <TrendingDown className="h-5 w-5 text-blue-500" />;
      case 'idle':
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (charge: number) => {
    if (charge >= 80) return 'bg-green-500';
    if (charge >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusText = (status: BatterySystem['status']) => {
    switch (status) {
      case 'charging':
        return 'Charging';
      case 'discharging':
        return 'Discharging';
      case 'idle':
        return 'Idle';
    }
  };

  const totalCapacity = batteries.reduce((sum, battery) => sum + battery.capacity, 0);
  const totalCharge = batteries.reduce((sum, battery) => sum + (battery.charge * battery.capacity / 100), 0);
  const totalPower = batteries.reduce((sum, battery) => sum + Math.abs(battery.power), 0);
  const averageCharge = (totalCharge / totalCapacity) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Battery className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Battery Storage</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{averageCharge.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Average Charge</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{totalCharge.toFixed(0)}</p>
          <p className="text-sm text-gray-600">kWh Stored</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{totalPower}</p>
          <p className="text-sm text-gray-600">kW Active</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {batteries.map((battery) => (
          <div key={battery.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(battery.status, battery.power)}
                <span className="font-medium text-gray-900">{battery.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  battery.status === 'charging' ? 'bg-green-100 text-green-800' :
                  battery.status === 'discharging' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(battery.status)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">{battery.charge.toFixed(1)}%</span>
                {battery.power !== 0 && (
                  <p className="text-sm text-gray-600">{Math.abs(battery.power)} kW</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Charge Level</span>
              <span>Capacity: {battery.capacity} kWh</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getStatusColor(battery.charge)}`}
                style={{ width: `${battery.charge}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BatteryStorage;