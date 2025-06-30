import React from 'react';
import { Sun, Activity, AlertCircle } from 'lucide-react';
import { SolarPanel } from '../types';

interface SolarGenerationProps {
  panels: SolarPanel[];
}

const SolarGeneration: React.FC<SolarGenerationProps> = ({ panels }) => {
  const getStatusIcon = (status: SolarPanel['status']) => {
    switch (status) {
      case 'online':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'maintenance':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: SolarPanel['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-amber-500';
    }
  };

  const totalGeneration = panels.reduce((sum, panel) => sum + panel.generation, 0);
  const totalCapacity = panels.reduce((sum, panel) => sum + panel.capacity, 0);
  const averageEfficiency = panels.filter(p => p.status === 'online').reduce((sum, panel) => sum + panel.efficiency, 0) / panels.filter(p => p.status === 'online').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Sun className="h-6 w-6 text-amber-600" />
        <h3 className="text-lg font-semibold text-gray-900">Solar Generation</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-amber-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{totalGeneration.toFixed(1)}</p>
          <p className="text-sm text-gray-600">kWh Generated</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{((totalGeneration / totalCapacity) * 100).toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Capacity Used</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{averageEfficiency.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Avg Efficiency</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {panels.map((panel) => {
          const efficiencyPercentage = panel.efficiency;
          
          return (
            <div key={panel.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(panel.status)}
                  <span className="font-medium text-gray-900">{panel.location}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">{panel.generation.toFixed(1)}</span>
                  <span className="text-sm text-gray-600 ml-1">kWh</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Efficiency: {efficiencyPercentage.toFixed(1)}%</span>
                <span>Capacity: {panel.capacity} kW</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(panel.status)}`}
                  style={{ width: `${Math.min(efficiencyPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SolarGeneration;