import React from 'react';
import { Car, Zap, Clock, MapPin } from 'lucide-react';
import { EVCharger } from '../types';

interface EVChargingProps {
  chargers: EVCharger[];
}

const EVCharging: React.FC<EVChargingProps> = ({ chargers }) => {
  const getStatusIcon = (status: EVCharger['status']) => {
    switch (status) {
      case 'available':
        return <Zap className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <Car className="h-5 w-5 text-blue-500" />;
      case 'offline':
        return <Zap className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: EVCharger['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const availableChargers = chargers.filter(c => c.status === 'available').length;
  const occupiedChargers = chargers.filter(c => c.status === 'occupied').length;
  const totalPower = chargers.filter(c => c.status === 'occupied').reduce((sum, c) => sum + c.power, 0);
  const offlineChargers = chargers.filter(c => c.status === 'offline').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Car className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">EV Charging Stations</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{availableChargers}</p>
          <p className="text-sm text-gray-600">Available</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{occupiedChargers}</p>
          <p className="text-sm text-gray-600">In Use</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{offlineChargers}</p>
          <p className="text-sm text-gray-600">Offline</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{totalPower}</p>
          <p className="text-sm text-gray-600">kW Active</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chargers.map((charger) => (
          <div key={charger.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(charger.status)}
                <div>
                  <p className="font-medium text-gray-900">{charger.location}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Station {charger.id}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(charger.status)}`}>
                {charger.status.charAt(0).toUpperCase() + charger.status.slice(1)}
              </span>
            </div>
            
            {charger.status === 'occupied' && (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-gray-900">{charger.vehicleConnected}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Power:</span>
                  <span className="font-medium text-gray-900">{charger.power} kW</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-600">Duration:</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatDuration(charger.sessionDuration!)}</span>
                </div>
              </div>
            )}
            
            {charger.status === 'available' && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-green-600 font-medium">Ready for charging</p>
              </div>
            )}
            
            {charger.status === 'offline' && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-sm text-red-600 font-medium">Service required</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EVCharging;