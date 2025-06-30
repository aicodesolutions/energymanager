import React from 'react';
import { Building as BuildingIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { Building } from '../types';

interface EnergyConsumptionProps {
  buildings: Building[];
}

const EnergyConsumption: React.FC<EnergyConsumptionProps> = ({ buildings }) => {
  const getStatusIcon = (status: Building['status']) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Building['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'high':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BuildingIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Building Energy Consumption</h3>
      </div>
      
      <div className="space-y-4">
        {buildings.map((building) => {
          const usagePercentage = (building.consumption / building.capacity) * 100;
          
          return (
            <div key={building.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(building.status)}
                  <span className="font-medium text-gray-900">{building.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">{building.consumption}</span>
                  <span className="text-sm text-gray-600 ml-1">kW</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Usage: {usagePercentage.toFixed(1)}%</span>
                <span>Capacity: {building.capacity} kW</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(building.status)}`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnergyConsumption;