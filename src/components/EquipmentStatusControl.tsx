import React, { useState } from 'react';
import { 
  Settings, 
  Power, 
  Pause, 
  Square, 
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Info,
  X,
  ChevronDown,
  History
} from 'lucide-react';
import { EquipmentStatus, StatusAlert } from '../types/equipment';
import { useEquipmentControl } from '../hooks/useEquipmentControl';

interface EquipmentStatusControlProps {
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  onClose: () => void;
}

const EquipmentStatusControl: React.FC<EquipmentStatusControlProps> = ({
  equipmentId,
  equipmentName,
  equipmentType,
  onClose
}) => {
  const {
    equipmentStates,
    statusHistory,
    alerts,
    changeEquipmentStatus,
    acknowledgeAlert,
    getHistoricalData,
    isStatusChangeAllowed
  } = useEquipmentControl();

  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reason, setReason] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const currentState = equipmentStates[equipmentId];
  const equipmentAlerts = alerts.filter(alert => alert.equipmentId === equipmentId && !alert.acknowledged);
  const historicalData = getHistoricalData(equipmentId, 7); // Last 7 days

  if (!currentState) {
    return null;
  }

  const statusOptions: { value: EquipmentStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'ON', label: 'Online', icon: <Power className="h-4 w-4" />, color: 'text-green-600' },
    { value: 'STANDBY', label: 'Standby', icon: <Pause className="h-4 w-4" />, color: 'text-yellow-600' },
    { value: 'OFF', label: 'Offline', icon: <Square className="h-4 w-4" />, color: 'text-red-600' },
    { value: 'MAINTENANCE', label: 'Maintenance', icon: <Wrench className="h-4 w-4" />, color: 'text-purple-600' }
  ];

  const getStatusColor = (status: EquipmentStatus) => {
    switch (status) {
      case 'ON': return 'bg-green-100 text-green-800 border-green-200';
      case 'STANDBY': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OFF': return 'bg-red-100 text-red-800 border-red-200';
      case 'MAINTENANCE': return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getStatusIcon = (status: EquipmentStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.icon || <Power className="h-4 w-4" />;
  };

  const handleStatusChange = (newStatus: EquipmentStatus) => {
    setSelectedStatus(newStatus);
    setShowDropdown(false);
    
    const { allowed, conflicts } = isStatusChangeAllowed(equipmentId, newStatus);
    
    if (!allowed) {
      // Show conflicts as alerts
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStatus) return;
    
    const success = await changeEquipmentStatus(equipmentId, selectedStatus, reason);
    
    if (success) {
      setShowConfirmation(false);
      setSelectedStatus(null);
      setReason('');
    }
  };

  const calculateEnergyImpact = (newStatus: EquipmentStatus) => {
    const currentConsumption = currentState.consumption;
    const currentGeneration = currentState.generation || 0;
    
    // Simplified calculation - in real app, this would be more sophisticated
    let newConsumption = 0;
    let newGeneration = 0;
    
    switch (newStatus) {
      case 'ON':
        newConsumption = currentConsumption;
        newGeneration = currentGeneration;
        break;
      case 'STANDBY':
        newConsumption = currentConsumption * 0.1;
        newGeneration = currentGeneration * 0.1;
        break;
      case 'OFF':
      case 'MAINTENANCE':
        newConsumption = 0;
        newGeneration = 0;
        break;
    }
    
    return {
      consumptionDelta: newConsumption - currentConsumption,
      generationDelta: newGeneration - currentGeneration
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{equipmentName}</h2>
              <p className="text-sm text-gray-600 capitalize">{equipmentType} Equipment Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>
            <div className="flex items-center space-x-2">
              {currentState.isChanging && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(currentState.status)}
                <span className="font-medium text-gray-900">Status</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentState.status)}`}>
                {currentState.status}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="font-medium text-gray-900">Consumption</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{currentState.consumption} kW</span>
            </div>
            
            {currentState.generation !== undefined && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-gray-900">Generation</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{currentState.generation} kW</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Last updated: {currentState.lastUpdate.toLocaleString()}
          </div>
        </div>

        {/* Alerts */}
        {equipmentAlerts.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
            <div className="space-y-3">
              {equipmentAlerts.map(alert => (
                <div key={alert.id} className={`p-3 rounded-lg border ${
                  alert.type === 'ERROR' ? 'bg-red-50 border-red-200' :
                  alert.type === 'WARNING' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {alert.type === 'ERROR' ? (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : alert.type === 'WARNING' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      ) : (
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-600">{alert.timestamp.toLocaleString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Control */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Status</h3>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              disabled={currentState.isChanging}
              className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-gray-700">Select new status...</span>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    disabled={option.value === currentState.status}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
                  >
                    <span className={option.color}>{option.icon}</span>
                    <span className="text-gray-900">{option.label}</span>
                    {option.value === currentState.status && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Historical Data */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Changes</h3>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <History className="h-4 w-4" />
              <span className="text-sm">{showHistory ? 'Hide' : 'Show'} History</span>
            </button>
          </div>
          
          {showHistory && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {historicalData.length > 0 ? (
                historicalData.map(change => (
                  <div key={change.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {change.previousStatus} → {change.newStatus}
                      </span>
                      <span className="text-xs text-gray-600">
                        {change.timestamp.toLocaleString()}
                      </span>
                    </div>
                    {change.reason && (
                      <p className="text-sm text-gray-600 mb-2">Reason: {change.reason}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Energy Impact: {change.energyImpact.newConsumption - change.energyImpact.previousConsumption > 0 ? '+' : ''}
                      {(change.energyImpact.newConsumption - change.energyImpact.previousConsumption).toFixed(1)} kW
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">No recent status changes</p>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && selectedStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Status Change</h3>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Change {equipmentName} from <strong>{currentState.status}</strong> to <strong>{selectedStatus}</strong>?
                  </p>
                  
                  {(() => {
                    const impact = calculateEnergyImpact(selectedStatus);
                    return (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-900 mb-1">Energy Impact:</p>
                        <p className="text-sm text-gray-600">
                          Consumption: {impact.consumptionDelta > 0 ? '+' : ''}{impact.consumptionDelta.toFixed(1)} kW
                        </p>
                        {currentState.generation !== undefined && (
                          <p className="text-sm text-gray-600">
                            Generation: {impact.generationDelta > 0 ? '+' : ''}{impact.generationDelta.toFixed(1)} kW
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter reason for status change..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowConfirmation(false);
                      setSelectedStatus(null);
                      setReason('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusChange}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentStatusControl;