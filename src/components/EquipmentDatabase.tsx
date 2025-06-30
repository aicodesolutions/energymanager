import React, { useState, useEffect } from 'react';
import { 
  Database, 
  MapPin, 
  Calendar, 
  Zap, 
  Battery, 
  Car, 
  Building,
  Download,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  locations, 
  solarPanelEquipment, 
  batteryEquipment, 
  evChargerEquipment, 
  buildingEquipment 
} from '../data/equipmentDatabase';
import { generateEnergyData, generateCSVData } from '../utils/dataGenerator';
import { EnergyDataPoint } from '../types/equipment';

const EquipmentDatabase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'solar' | 'battery' | 'ev' | 'building' | 'data'>('overview');
  const [energyData, setEnergyData] = useState<EnergyDataPoint[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateData = async () => {
    setIsGenerating(true);
    try {
      // Simulate data generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newData = generateEnergyData(new Date());
      setEnergyData(newData);
      setLastGenerated(new Date());
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = () => {
    if (energyData.length === 0) return;
    
    const csvContent = generateCSVData(energyData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `energy_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLocationName = (locationId: string) => {
    return locations.find(loc => loc.id === locationId)?.name || 'Unknown Location';
  };

  const getLocationCoordinates = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? `${location.latitude}, ${location.longitude}` : 'N/A';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'solar', label: 'Solar Panels', icon: Zap },
    { id: 'battery', label: 'Batteries', icon: Battery },
    { id: 'ev', label: 'EV Chargers', icon: Car },
    { id: 'building', label: 'Buildings', icon: Building },
    { id: 'data', label: 'Data Generation', icon: RefreshCw }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Energy Equipment Database</h1>
          </div>
          <p className="text-gray-600">Comprehensive monitoring system for university campus energy infrastructure</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="h-8 w-8 text-amber-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Solar Panels</h3>
                  <p className="text-3xl font-bold text-amber-600">{solarPanelEquipment.length}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Total Capacity: {solarPanelEquipment.reduce((sum, panel) => sum + panel.capacity, 0)} kW
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Battery className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Battery Systems</h3>
                  <p className="text-3xl font-bold text-green-600">{batteryEquipment.length}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Total Capacity: {batteryEquipment.reduce((sum, battery) => sum + battery.capacity, 0)} kWh
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Car className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">EV Chargers</h3>
                  <p className="text-3xl font-bold text-blue-600">{evChargerEquipment.length}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Total Power: {evChargerEquipment.reduce((sum, charger) => sum + charger.maxPower, 0)} kW
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Buildings</h3>
                  <p className="text-3xl font-bold text-purple-600">{buildingEquipment.length}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Total Capacity: {buildingEquipment.reduce((sum, building) => sum + building.maxCapacity, 0)} kW
              </p>
            </div>
          </div>
        )}

        {activeTab === 'solar' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Solar Panel Equipment</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Panels</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {solarPanelEquipment.map((panel) => (
                    <tr key={panel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{panel.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLocationName(panel.locationId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{panel.modelNumber}</p>
                          <p className="text-gray-500">{panel.manufacturer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{panel.capacity} kW</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{panel.panelCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{panel.installationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getLocationCoordinates(panel.locationId)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'battery' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Battery Storage Systems</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Power</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chemistry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batteryEquipment.map((battery) => (
                    <tr key={battery.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{battery.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLocationName(battery.locationId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{battery.modelNumber}</p>
                          <p className="text-gray-500">{battery.manufacturer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{battery.capacity} kWh</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p>Charge: {battery.maxChargeRate} kW</p>
                          <p>Discharge: {battery.maxDischargeRate} kW</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{battery.chemistry}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{battery.installationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ev' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">EV Charging Equipment</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Power</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connector</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evChargerEquipment.map((charger) => (
                    <tr key={charger.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{charger.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLocationName(charger.locationId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{charger.modelNumber}</p>
                          <p className="text-gray-500">{charger.manufacturer}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{charger.maxPower} kW</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          charger.level === 'DC Fast' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {charger.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{charger.connectorType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{charger.networkProvider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'building' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Building Infrastructure</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor Area</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HVAC System</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {buildingEquipment.map((building) => (
                    <tr key={building.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{building.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{building.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          building.type === 'academic' ? 'bg-blue-100 text-blue-800' :
                          building.type === 'residential' ? 'bg-green-100 text-green-800' :
                          building.type === 'recreational' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {building.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{building.maxCapacity} kW</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{building.floorArea.toLocaleString()} sq ft</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{building.occupancy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{building.hvacSystem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Data Generation Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">24-Hour Energy Data Generation</h3>
                  <p className="text-gray-600">Generate realistic energy monitoring data for all equipment</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={generateData}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Generating...' : 'Generate Data'}</span>
                  </button>
                  <button
                    onClick={downloadCSV}
                    disabled={energyData.length === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Generation Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Data Points</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{energyData.length.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Total measurements</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-900">Frequency</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">15 min</p>
                  <p className="text-sm text-green-700">Measurement interval</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="h-5 w-5 text-purple-600" />
                    <h4 className="font-medium text-purple-900">Last Generated</h4>
                  </div>
                  <p className="text-lg font-bold text-purple-600">
                    {lastGenerated ? lastGenerated.toLocaleTimeString() : 'Never'}
                  </p>
                  <p className="text-sm text-purple-700">
                    {lastGenerated ? lastGenerated.toLocaleDateString() : 'Generate data first'}
                  </p>
                </div>
              </div>

              {/* Data Specifications */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Data Collection Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Solar Panels</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Power generation (kW)</li>
                      <li>• Voltage and current measurements</li>
                      <li>• Weather-dependent generation (0 kW at night)</li>
                      <li>• Seasonal variations included</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Buildings</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Peak hours: 08:00-17:00 (academic)</li>
                      <li>• Peak hours: 18:00-23:00, 06:00-08:00 (residential)</li>
                      <li>• Weekend variations</li>
                      <li>• Building-specific consumption patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Batteries</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Charge level percentage</li>
                      <li>• Charging/discharging rates</li>
                      <li>• Smart grid integration logic</li>
                      <li>• Peak shaving operations</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">EV Chargers</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Power consumption when occupied</li>
                      <li>• Charging status (available/occupied/offline)</li>
                      <li>• Time-based occupancy patterns</li>
                      <li>• Random service interruptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Data Preview */}
            {energyData.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Sample Data Preview (First 10 Records)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generation (kW)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumption (kW)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {energyData.slice(0, 10).map((point, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{point.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{point.equipmentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              point.equipmentType === 'solar' ? 'bg-amber-100 text-amber-800' :
                              point.equipmentType === 'battery' ? 'bg-green-100 text-green-800' :
                              point.equipmentType === 'ev_charger' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {point.equipmentType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {point.powerGeneration || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {point.powerConsumption || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {point.chargeLevel || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {point.chargingStatus || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDatabase;