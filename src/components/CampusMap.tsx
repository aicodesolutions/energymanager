import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Zap, 
  Battery, 
  Car, 
  Beaker, 
  Sun, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Wind,
  Thermometer,
  Eye,
  BarChart3,
  Gauge,
  Building,
  Settings
} from 'lucide-react';
import EquipmentStatusControl from './EquipmentStatusControl';
import EquipmentTooltip from './EquipmentTooltip';
import { useEquipmentControl } from '../hooks/useEquipmentControl';

interface MapEquipment {
  id: string;
  name: string;
  type: 'solar' | 'battery' | 'ev_charger' | 'laboratory' | 'building';
  position: { x: number; y: number };
  status: 'online' | 'offline' | 'maintenance' | 'critical';
  capacity?: string;
  current?: string;
  efficiency?: string;
  powerFlow?: number;
  temperature?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  alerts?: string[];
}

interface CampusBuilding {
  id: string;
  name: string;
  type: 'academic' | 'residential' | 'administrative' | 'recreational' | 'laboratory';
  outline: { x: number; y: number }[];
  entrances: { x: number; y: number; label: string }[];
  floors: number;
  yearBuilt: number;
  area: number; // sq ft
}

interface Road {
  id: string;
  name: string;
  type: 'main' | 'secondary' | 'pedestrian' | 'service';
  path: { x: number; y: number }[];
  width: number;
}

interface ParkingArea {
  id: string;
  name: string;
  outline: { x: number; y: number }[];
  capacity: number;
  type: 'student' | 'faculty' | 'visitor' | 'ev';
}

const CampusMap: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<MapEquipment | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [showStatusControl, setShowStatusControl] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<{ equipmentId: string; position: { x: number; y: number } } | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'energy_flow' | 'status' | 'efficiency'>('overview');
  const [showLabels, setShowLabels] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    totalGeneration: 1205,
    totalConsumption: 1650,
    batteryLevel: 78,
    gridImport: 445,
    efficiency: 92.3,
    carbonOffset: 542.25,
    temperature: 22.5,
    weatherCondition: 'sunny'
  });

  const { equipmentStates, alerts } = useEquipmentControl();

  // Campus Buildings with realistic outlines and precise positioning
  const campusBuildings: CampusBuilding[] = [
    {
      id: 'engineering',
      name: 'Engineering Building',
      type: 'academic',
      outline: [
        { x: 20, y: 30 }, { x: 35, y: 30 }, { x: 35, y: 45 }, { x: 20, y: 45 }
      ],
      entrances: [
        { x: 27.5, y: 30, label: 'Main Entrance' },
        { x: 35, y: 37.5, label: 'East Entrance' }
      ],
      floors: 6,
      yearBuilt: 1985,
      area: 250000
    },
    {
      id: 'library',
      name: 'Central Library',
      type: 'academic',
      outline: [
        { x: 50, y: 15 }, { x: 65, y: 15 }, { x: 65, y: 30 }, { x: 50, y: 30 }
      ],
      entrances: [
        { x: 57.5, y: 15, label: 'Main Entrance' },
        { x: 50, y: 22.5, label: 'West Entrance' }
      ],
      floors: 4,
      yearBuilt: 1970,
      area: 180000
    },
    {
      id: 'student-center',
      name: 'Student Union Center',
      type: 'recreational',
      outline: [
        { x: 40, y: 60 }, { x: 55, y: 60 }, { x: 55, y: 75 }, { x: 40, y: 75 }
      ],
      entrances: [
        { x: 47.5, y: 60, label: 'North Entrance' },
        { x: 47.5, y: 75, label: 'South Entrance' },
        { x: 40, y: 67.5, label: 'West Entrance' }
      ],
      floors: 3,
      yearBuilt: 1995,
      area: 120000
    },
    {
      id: 'life-science-lab',
      name: 'Life Science Laboratory',
      type: 'laboratory',
      outline: [
        { x: 70, y: 50 }, { x: 85, y: 50 }, { x: 85, y: 65 }, { x: 70, y: 65 }
      ],
      entrances: [
        { x: 77.5, y: 50, label: 'Main Entrance' },
        { x: 85, y: 57.5, label: 'Service Entrance' }
      ],
      floors: 5,
      yearBuilt: 2024,
      area: 320000
    },
    {
      id: 'dormitory-north',
      name: 'North Residence Hall',
      type: 'residential',
      outline: [
        { x: 10, y: 70 }, { x: 25, y: 70 }, { x: 25, y: 85 }, { x: 10, y: 85 }
      ],
      entrances: [
        { x: 17.5, y: 70, label: 'Main Lobby' },
        { x: 10, y: 77.5, label: 'Side Entrance' }
      ],
      floors: 8,
      yearBuilt: 2005,
      area: 150000
    },
    {
      id: 'dormitory-south',
      name: 'South Residence Hall',
      type: 'residential',
      outline: [
        { x: 10, y: 50 }, { x: 25, y: 50 }, { x: 25, y: 65 }, { x: 10, y: 65 }
      ],
      entrances: [
        { x: 17.5, y: 50, label: 'Main Lobby' },
        { x: 25, y: 57.5, label: 'East Entrance' }
      ],
      floors: 8,
      yearBuilt: 2008,
      area: 150000
    },
    {
      id: 'administration',
      name: 'Administration Building',
      type: 'administrative',
      outline: [
        { x: 75, y: 15 }, { x: 90, y: 15 }, { x: 90, y: 30 }, { x: 75, y: 30 }
      ],
      entrances: [
        { x: 82.5, y: 15, label: 'Main Entrance' }
      ],
      floors: 3,
      yearBuilt: 1960,
      area: 80000
    },
    {
      id: 'sports-complex',
      name: 'Athletic Center',
      type: 'recreational',
      outline: [
        { x: 60, y: 75 }, { x: 80, y: 75 }, { x: 80, y: 90 }, { x: 60, y: 90 }
      ],
      entrances: [
        { x: 70, y: 75, label: 'Main Entrance' },
        { x: 60, y: 82.5, label: 'Pool Entrance' }
      ],
      floors: 2,
      yearBuilt: 2015,
      area: 100000
    }
  ];

  // Campus Roads and Pathways
  const campusRoads: Road[] = [
    {
      id: 'main-drive',
      name: 'University Drive',
      type: 'main',
      path: [
        { x: 5, y: 50 }, { x: 95, y: 50 }
      ],
      width: 8
    },
    {
      id: 'north-road',
      name: 'Academic Way',
      type: 'secondary',
      path: [
        { x: 15, y: 20 }, { x: 85, y: 20 }
      ],
      width: 6
    },
    {
      id: 'south-road',
      name: 'Campus Boulevard',
      type: 'secondary',
      path: [
        { x: 10, y: 80 }, { x: 90, y: 80 }
      ],
      width: 6
    },
    {
      id: 'central-path',
      name: 'Central Walkway',
      type: 'pedestrian',
      path: [
        { x: 50, y: 10 }, { x: 50, y: 95 }
      ],
      width: 4
    },
    {
      id: 'east-connector',
      name: 'East Connector',
      type: 'secondary',
      path: [
        { x: 70, y: 35 }, { x: 70, y: 70 }
      ],
      width: 5
    },
    {
      id: 'service-road',
      name: 'Service Road',
      type: 'service',
      path: [
        { x: 85, y: 35 }, { x: 85, y: 75 }
      ],
      width: 3
    }
  ];

  // Parking Areas
  const parkingAreas: ParkingArea[] = [
    {
      id: 'main-parking',
      name: 'Main Student Parking',
      outline: [
        { x: 5, y: 85 }, { x: 15, y: 85 }, { x: 15, y: 95 }, { x: 5, y: 95 }
      ],
      capacity: 200,
      type: 'student'
    },
    {
      id: 'faculty-parking',
      name: 'Faculty Parking',
      outline: [
        { x: 45, y: 85 }, { x: 55, y: 85 }, { x: 55, y: 95 }, { x: 45, y: 95 }
      ],
      capacity: 80,
      type: 'faculty'
    },
    {
      id: 'visitor-parking',
      name: 'Visitor Parking',
      outline: [
        { x: 85, y: 85 }, { x: 95, y: 85 }, { x: 95, y: 95 }, { x: 85, y: 95 }
      ],
      capacity: 50,
      type: 'visitor'
    },
    {
      id: 'ev-parking',
      name: 'EV Charging Station',
      outline: [
        { x: 85, y: 70 }, { x: 95, y: 70 }, { x: 95, y: 80 }, { x: 85, y: 80 }
      ],
      capacity: 20,
      type: 'ev'
    }
  ];

  // Energy Equipment positioned precisely on buildings and strategic locations
  const energyEquipment: MapEquipment[] = [
    // Solar Panels - Precisely positioned on building rooftops (center of each building)
    {
      id: 'solar_001',
      name: 'Engineering Solar Array',
      type: 'solar',
      position: { x: 27.5, y: 37.5 }, // Center of Engineering Building
      status: 'online',
      capacity: '200kW',
      current: '145kW',
      efficiency: '72.5%',
      powerFlow: 145,
      temperature: 45.2
    },
    {
      id: 'solar_002',
      name: 'Library Solar Panels',
      type: 'solar',
      position: { x: 57.5, y: 22.5 }, // Center of Library
      status: 'online',
      capacity: '120kW',
      current: '89kW',
      efficiency: '74.2%',
      powerFlow: 89,
      temperature: 43.8
    },
    {
      id: 'solar_003',
      name: 'Lab Solar Installation',
      type: 'solar',
      position: { x: 77.5, y: 57.5 }, // Center of Life Science Lab
      status: 'online',
      capacity: '220kW',
      current: '185kW',
      efficiency: '84.1%',
      powerFlow: 185,
      temperature: 44.5
    },
    {
      id: 'solar_004',
      name: 'Student Center Solar',
      type: 'solar',
      position: { x: 47.5, y: 67.5 }, // Center of Student Center
      status: 'online',
      capacity: '180kW',
      current: '156kW',
      efficiency: '86.7%',
      powerFlow: 156,
      temperature: 42.1
    },
    {
      id: 'solar_005',
      name: 'Athletic Center Solar',
      type: 'solar',
      position: { x: 70, y: 82.5 }, // Center of Athletic Center
      status: 'maintenance',
      capacity: '150kW',
      current: '0kW',
      efficiency: '0%',
      powerFlow: 0,
      temperature: 25.0
    },

    // Battery Storage Systems - Positioned in dedicated utility areas
    {
      id: 'battery_001',
      name: 'Main Battery Storage',
      type: 'battery',
      position: { x: 37, y: 45 }, // Between Engineering and Student Center
      status: 'online',
      capacity: '1000kWh',
      current: '750kWh',
      efficiency: '95%',
      powerFlow: -85,
      temperature: 28.5
    },
    {
      id: 'battery_002',
      name: 'Lab Battery System',
      type: 'battery',
      position: { x: 82, y: 62 }, // Adjacent to Life Science Lab
      status: 'online',
      capacity: '750kWh',
      current: '615kWh',
      efficiency: '94%',
      powerFlow: 120,
      temperature: 29.2
    },
    {
      id: 'battery_003',
      name: 'Backup Battery',
      type: 'battery',
      position: { x: 62, y: 25 }, // Between Library and Administration
      status: 'online',
      capacity: '500kWh',
      current: '460kWh',
      efficiency: '92%',
      powerFlow: 45,
      temperature: 27.8
    },

    // EV Charging Stations - Precisely positioned in parking areas
    {
      id: 'ev_001',
      name: 'Main EV Station',
      type: 'ev_charger',
      position: { x: 10, y: 90 }, // Center of Main Student Parking
      status: 'online',
      capacity: '150kW',
      current: '120kW',
      efficiency: '96%',
      powerFlow: 120,
      temperature: 35.5
    },
    {
      id: 'ev_002',
      name: 'Faculty EV Chargers',
      type: 'ev_charger',
      position: { x: 50, y: 90 }, // Center of Faculty Parking
      status: 'online',
      capacity: '100kW',
      current: '75kW',
      efficiency: '94%',
      powerFlow: 75,
      temperature: 33.2
    },
    {
      id: 'ev_003',
      name: 'Lab EV Fast Charger',
      type: 'ev_charger',
      position: { x: 90, y: 75 }, // Center of EV Charging Station
      status: 'online',
      capacity: '62.5kW',
      current: '62.5kW',
      efficiency: '98%',
      powerFlow: 62.5,
      temperature: 38.8
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalGeneration: prev.totalGeneration + (Math.random() - 0.5) * 20,
        totalConsumption: prev.totalConsumption + (Math.random() - 0.5) * 30,
        batteryLevel: Math.max(20, Math.min(95, prev.batteryLevel + (Math.random() - 0.5) * 2)),
        efficiency: Math.max(85, Math.min(98, prev.efficiency + (Math.random() - 0.5) * 1)),
        temperature: prev.temperature + (Math.random() - 0.5) * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getBuildingColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'fill-blue-200 stroke-blue-400';
      case 'residential':
        return 'fill-green-200 stroke-green-400';
      case 'administrative':
        return 'fill-purple-200 stroke-purple-400';
      case 'recreational':
        return 'fill-orange-200 stroke-orange-400';
      case 'laboratory':
        return 'fill-red-200 stroke-red-400';
      default:
        return 'fill-gray-200 stroke-gray-400';
    }
  };

  const getRoadColor = (type: string) => {
    switch (type) {
      case 'main':
        return 'stroke-gray-600';
      case 'secondary':
        return 'stroke-gray-500';
      case 'pedestrian':
        return 'stroke-gray-400';
      case 'service':
        return 'stroke-gray-400 stroke-dasharray-5-5';
      default:
        return 'stroke-gray-500';
    }
  };

  const getParkingColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'fill-blue-100 stroke-blue-300';
      case 'faculty':
        return 'fill-green-100 stroke-green-300';
      case 'visitor':
        return 'fill-purple-100 stroke-purple-300';
      case 'ev':
        return 'fill-yellow-100 stroke-yellow-300';
      default:
        return 'fill-gray-100 stroke-gray-300';
    }
  };

  const getEquipmentIcon = (type: string, status: string) => {
    const baseClasses = "transition-all duration-300";
    const statusClasses = getStatusColor(status);
    const iconProps = { size: 24, className: `${baseClasses} ${statusClasses}` }; // Increased icon size
    
    switch (type) {
      case 'solar':
        return <Sun {...iconProps} />;
      case 'battery':
        return <Battery {...iconProps} />;
      case 'ev_charger':
        return <Car {...iconProps} />;
      case 'laboratory':
        return <Beaker {...iconProps} />;
      case 'building':
        return <Building {...iconProps} />;
      default:
        return <Zap {...iconProps} />;
    }
  };

  const getStatusColor = (status: string) => {
    // Check if equipment has manual status override
    const manualStatus = equipmentStates[status];
    if (manualStatus) {
      switch (manualStatus.status) {
        case 'ON':
          return 'text-green-500';
        case 'STANDBY':
          return 'text-yellow-500';
        case 'OFF':
          return 'text-red-500';
        case 'MAINTENANCE':
          return 'text-purple-500';
      }
    }

    // Default status colors
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-yellow-500';
      case 'critical':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };

  const pathToString = (path: { x: number; y: number }[]) => {
    return path.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
  };

  const handleEquipmentClick = (equipment: MapEquipment, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedEquipment(equipment);
    setShowTooltip(null);
  };

  const handleEquipmentHover = (equipment: MapEquipment, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setShowTooltip({
      equipmentId: equipment.id,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top
      }
    });
  };

  const handleEquipmentLeave = () => {
    setShowTooltip(null);
  };

  const openStatusControl = (equipmentId: string) => {
    setShowStatusControl(equipmentId);
    setSelectedEquipment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Campus Energy Map</h1>
                <p className="text-gray-600">Interactive campus layout with real-time energy monitoring and control</p>
              </div>
            </div>
            
            {/* Weather and Environmental Info */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span className="font-medium text-blue-900">Sunny</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <Thermometer className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-900">{realTimeData.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-lg">
                <Wind className="h-4 w-4 text-purple-500" />
                <span className="font-medium text-purple-900">12 km/h</span>
              </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Generation</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{realTimeData.totalGeneration.toFixed(0)} kWh</p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Consumption</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{realTimeData.totalConsumption.toFixed(0)} kWh</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-1">
                <Battery className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Battery</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{realTimeData.batteryLevel.toFixed(1)}%</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Grid Import</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{realTimeData.gridImport.toFixed(0)} kWh</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 mb-1">
                <Gauge className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Efficiency</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{realTimeData.efficiency.toFixed(1)}%</p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">CO₂ Saved</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{realTimeData.carbonOffset.toFixed(0)} kg</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* View Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'energy_flow', label: 'Energy Flow', icon: Activity },
              { id: 'status', label: 'System Status', icon: CheckCircle },
              { id: 'efficiency', label: 'Efficiency', icon: BarChart3 }
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    viewMode === mode.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg font-medium transition-colors duration-200"
          >
            <Eye className="h-4 w-4" />
            <span>{showLabels ? 'Hide Labels' : 'Show Labels'}</span>
          </button>
        </div>

        {/* Active Alerts */}
        {alerts.filter(alert => !alert.acknowledged).length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Active System Alerts</h3>
            </div>
            <div className="space-y-2">
              {alerts.filter(alert => !alert.acknowledged).slice(0, 3).map(alert => (
                <p key={alert.id} className="text-sm text-yellow-700">
                  {alert.message} - {alert.timestamp.toLocaleTimeString()}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Main Campus Map */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="relative bg-gradient-to-br from-green-100 via-blue-50 to-emerald-100 h-[700px] overflow-hidden">
            
            {/* SVG Campus Layout */}
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Campus Grounds Background */}
              <rect x="0" y="0" width="100" height="100" fill="#f0f9ff" />
              
              {/* Green Spaces and Landscaping */}
              <circle cx="30" cy="25" r="8" fill="#dcfce7" stroke="#86efac" strokeWidth="0.5" />
              <circle cx="65" cy="40" r="6" fill="#dcfce7" stroke="#86efac" strokeWidth="0.5" />
              <circle cx="45" cy="85" r="5" fill="#dcfce7" stroke="#86efac" strokeWidth="0.5" />
              <ellipse cx="80" cy="60" rx="4" ry="6" fill="#dcfce7" stroke="#86efac" strokeWidth="0.5" />

              {/* Campus Roads */}
              {campusRoads.map((road) => (
                <g key={road.id}>
                  <path
                    d={pathToString(road.path)}
                    stroke={getRoadColor(road.type).split(' ')[0].replace('stroke-', '')}
                    strokeWidth={road.width / 10}
                    fill="none"
                    className={getRoadColor(road.type)}
                  />
                  {showLabels && road.type === 'main' && (
                    <text
                      x={road.path[0].x + 2}
                      y={road.path[0].y - 1}
                      fontSize="2.2"
                      fontWeight="bold"
                      fill="#374151"
                      fontFamily="Arial, sans-serif"
                      stroke="white"
                      strokeWidth="0.3"
                      paintOrder="stroke"
                    >
                      {road.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Parking Areas */}
              {parkingAreas.map((parking) => (
                <g key={parking.id}>
                  <polygon
                    points={parking.outline.map(p => `${p.x},${p.y}`).join(' ')}
                    className={getParkingColor(parking.type)}
                    strokeWidth="0.3"
                  />
                  {/* Parking Space Lines */}
                  {Array.from({ length: Math.floor(parking.capacity / 10) }).map((_, i) => (
                    <line
                      key={i}
                      x1={parking.outline[0].x + (i + 1) * 1}
                      y1={parking.outline[0].y}
                      x2={parking.outline[0].x + (i + 1) * 1}
                      y2={parking.outline[2].y}
                      stroke="#9ca3af"
                      strokeWidth="0.1"
                    />
                  ))}
                  {showLabels && (
                    <text
                      x={parking.outline[0].x + 2.5}
                      y={parking.outline[0].y + 2.5}
                      fontSize="1.8"
                      fontWeight="bold"
                      fill="#374151"
                      fontFamily="Arial, sans-serif"
                      stroke="white"
                      strokeWidth="0.2"
                      paintOrder="stroke"
                    >
                      {parking.name}
                    </text>
                  )}
                </g>
              ))}

              {/* Campus Buildings */}
              {campusBuildings.map((building) => (
                <g key={building.id}>
                  {/* Building Outline */}
                  <polygon
                    points={building.outline.map(p => `${p.x},${p.y}`).join(' ')}
                    className={`${getBuildingColor(building.type)} cursor-pointer hover:opacity-80 transition-opacity duration-200`}
                    strokeWidth="0.4"
                    onClick={() => setSelectedBuilding(building)}
                  />
                  
                  {/* Building Shadow */}
                  <polygon
                    points={building.outline.map(p => `${p.x + 0.5},${p.y + 0.5}`).join(' ')}
                    fill="#00000020"
                    className="pointer-events-none"
                  />

                  {/* Building Entrances */}
                  {building.entrances.map((entrance, index) => (
                    <g key={index}>
                      <circle
                        cx={entrance.x}
                        cy={entrance.y}
                        r="0.8"
                        fill="#fbbf24"
                        stroke="#f59e0b"
                        strokeWidth="0.2"
                      />
                      {showLabels && (
                        <text
                          x={entrance.x + 1}
                          y={entrance.y + 0.3}
                          fontSize="1.2"
                          fontWeight="bold"
                          fill="#374151"
                          fontFamily="Arial, sans-serif"
                          stroke="white"
                          strokeWidth="0.1"
                          paintOrder="stroke"
                        >
                          {entrance.label}
                        </text>
                      )}
                    </g>
                  ))}

                  {/* Building Labels - 150% larger and more prominent */}
                  {showLabels && (
                    <text
                      x={building.outline[0].x + (building.outline[2].x - building.outline[0].x) / 2}
                      y={building.outline[0].y + (building.outline[2].y - building.outline[0].y) / 2}
                      fontSize="2.4"
                      fontWeight="bold"
                      fill="#1f2937"
                      textAnchor="middle"
                      fontFamily="Arial, sans-serif"
                      stroke="white"
                      strokeWidth="0.3"
                      paintOrder="stroke"
                      className="pointer-events-none"
                    >
                      {building.name}
                    </text>
                  )}

                  {/* Floor Count Indicator */}
                  <text
                    x={building.outline[2].x - 1}
                    y={building.outline[0].y + 1.5}
                    fontSize="1.5"
                    fontWeight="bold"
                    fill="#6b7280"
                    fontFamily="Arial, sans-serif"
                    stroke="white"
                    strokeWidth="0.1"
                    paintOrder="stroke"
                    className="pointer-events-none"
                  >
                    {building.floors}F
                  </text>
                </g>
              ))}

              {/* Energy Flow Lines (when in energy flow mode) */}
              {viewMode === 'energy_flow' && energyEquipment.map((equipment, index) => {
                if (equipment.type === 'solar' && equipment.powerFlow && equipment.powerFlow > 0) {
                  // Find nearest battery or building
                  const nearestBattery = energyEquipment.find(e => e.type === 'battery');
                  if (nearestBattery) {
                    return (
                      <line
                        key={`flow-${index}`}
                        x1={equipment.position.x}
                        y1={equipment.position.y}
                        x2={nearestBattery.position.x}
                        y2={nearestBattery.position.y}
                        stroke="#10b981"
                        strokeWidth="0.3"
                        strokeDasharray="1,1"
                        className="animate-pulse"
                      />
                    );
                  }
                }
                return null;
              })}
            </svg>

            {/* Energy Equipment Overlays - Precisely positioned */}
            {energyEquipment.map((equipment) => (
              <div
                key={equipment.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: `${equipment.position.x}%`, top: `${equipment.position.y}%` }}
                onClick={(e) => handleEquipmentClick(equipment, e)}
                onMouseEnter={(e) => handleEquipmentHover(equipment, e)}
                onMouseLeave={handleEquipmentLeave}
              >
                <div className={`p-3 bg-white rounded-full shadow-lg border-2 transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                  selectedEquipment?.id === equipment.id ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200 hover:border-blue-400'
                }`}>
                  {getEquipmentIcon(equipment.type, equipment.status)}
                </div>

                {/* Status Indicator */}
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  equipmentStates[equipment.id]?.status === 'ON' ? 'bg-green-500' :
                  equipmentStates[equipment.id]?.status === 'STANDBY' ? 'bg-yellow-500' :
                  equipmentStates[equipment.id]?.status === 'OFF' ? 'bg-red-500' :
                  equipmentStates[equipment.id]?.status === 'MAINTENANCE' ? 'bg-purple-500' :
                  equipment.status === 'online' ? 'bg-green-500' :
                  equipment.status === 'maintenance' ? 'bg-yellow-500' :
                  equipment.status === 'critical' ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>

                {/* Equipment Label */}
                {showLabels && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-700">{equipment.name}</span>
                    {equipment.current && (
                      <div className="text-xs text-gray-600 font-medium">{equipment.current}</div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Campus Legend */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Campus Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-blue-200 border border-blue-400 rounded"></div>
                  <span>Academic Buildings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-green-200 border border-green-400 rounded"></div>
                  <span>Residential Halls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-red-200 border border-red-400 rounded"></div>
                  <span>Laboratory Facilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-3 bg-orange-200 border border-orange-400 rounded"></div>
                  <span>Recreation Centers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-gray-600 rounded"></div>
                  <span>Main Roads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-gray-400 rounded"></div>
                  <span>Pedestrian Paths</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>EV Charging</span>
                </div>
              </div>
            </div>

            {/* Scale Reference */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-8 h-0.5 bg-gray-800"></div>
                <span>100m</span>
              </div>
            </div>

            {/* North Arrow */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
              <div className="flex flex-col items-center text-xs text-gray-600">
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-gray-800 mb-1"></div>
                <span className="font-medium">N</span>
              </div>
            </div>
          </div>

          {/* Equipment/Building Details Panel */}
          {(selectedEquipment || selectedBuilding) && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              {selectedEquipment && (
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      {getEquipmentIcon(selectedEquipment.type, selectedEquipment.status)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedEquipment.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          equipmentStates[selectedEquipment.id]?.status === 'ON' ? 'bg-green-100 text-green-800 border-green-200' :
                          equipmentStates[selectedEquipment.id]?.status === 'STANDBY' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          equipmentStates[selectedEquipment.id]?.status === 'OFF' ? 'bg-red-100 text-red-800 border-red-200' :
                          equipmentStates[selectedEquipment.id]?.status === 'MAINTENANCE' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          selectedEquipment.status === 'online' ? 'bg-green-100 text-green-800 border-green-200' :
                          selectedEquipment.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          selectedEquipment.status === 'critical' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {equipmentStates[selectedEquipment.id]?.status || selectedEquipment.status.charAt(0).toUpperCase() + selectedEquipment.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600 capitalize">{selectedEquipment.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openStatusControl(selectedEquipment.id)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Control</span>
                    </button>
                    <button
                      onClick={() => setSelectedEquipment(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {selectedBuilding && (
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedBuilding.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBuildingColor(selectedBuilding.type).replace('fill-', 'bg-').replace('stroke-', 'border-')}`}>
                          {selectedBuilding.type.charAt(0).toUpperCase() + selectedBuilding.type.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">{selectedBuilding.floors} floors • Built {selectedBuilding.yearBuilt}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBuilding(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {selectedEquipment?.capacity && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <div className="font-bold text-gray-900">{selectedEquipment.capacity}</div>
                  </div>
                )}
                
                {selectedEquipment?.current && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Current</span>
                    <div className="font-bold text-gray-900">
                      {equipmentStates[selectedEquipment.id]?.consumption !== undefined 
                        ? `${equipmentStates[selectedEquipment.id].consumption} kW`
                        : selectedEquipment.current
                      }
                    </div>
                  </div>
                )}
                
                {selectedEquipment?.efficiency && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <div className="font-bold text-green-600">{selectedEquipment.efficiency}</div>
                  </div>
                )}

                {selectedBuilding?.area && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Floor Area</span>
                    <div className="font-bold text-gray-900">{selectedBuilding.area.toLocaleString()} sq ft</div>
                  </div>
                )}

                {selectedBuilding?.entrances && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <span className="text-sm text-gray-600">Entrances</span>
                    <div className="font-bold text-gray-900">{selectedBuilding.entrances.length}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Status Control Modal */}
      {showStatusControl && (
        <EquipmentStatusControl
          equipmentId={showStatusControl}
          equipmentName={energyEquipment.find(eq => eq.id === showStatusControl)?.name || 'Unknown Equipment'}
          equipmentType={energyEquipment.find(eq => eq.id === showStatusControl)?.type || 'unknown'}
          onClose={() => setShowStatusControl(null)}
        />
      )}

      {/* Equipment Tooltip */}
      {showTooltip && (
        <EquipmentTooltip
          equipmentId={showTooltip.equipmentId}
          equipmentName={energyEquipment.find(eq => eq.id === showTooltip.equipmentId)?.name || 'Unknown Equipment'}
          equipmentType={energyEquipment.find(eq => eq.id === showTooltip.equipmentId)?.type || 'unknown'}
          position={showTooltip.position}
          onClose={() => setShowTooltip(null)}
        />
      )}
    </div>
  );
};

export default CampusMap;