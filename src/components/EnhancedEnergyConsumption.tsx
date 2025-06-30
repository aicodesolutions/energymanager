import React, { useState, useEffect } from 'react';
import { 
  Building as BuildingIcon, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  BarChart3,
  Zap,
  Thermometer,
  Clock,
  Eye,
  EyeOff,
  ChevronDown,
  Info
} from 'lucide-react';
import { Building } from '../types';

interface EnhancedEnergyConsumptionProps {
  buildings: Building[];
}

interface EnergyTrend {
  period: string;
  consumption: number;
  comparison: number;
  change: number;
}

interface EnergyBreakdown {
  electricity: number;
  heating: number;
  cooling: number;
  lighting: number;
  equipment: number;
}

const EnhancedEnergyConsumption: React.FC<EnhancedEnergyConsumptionProps> = ({ buildings }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'high' | 'critical'>('all');
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  // Mock trend data
  const [trendData, setTrendData] = useState<EnergyTrend[]>([
    { period: '00:00', consumption: 3200, comparison: 3100, change: 3.2 },
    { period: '04:00', consumption: 2800, comparison: 2900, change: -3.4 },
    { period: '08:00', consumption: 4200, comparison: 4000, change: 5.0 },
    { period: '12:00', consumption: 4800, comparison: 4600, change: 4.3 },
    { period: '16:00', consumption: 5200, comparison: 5000, change: 4.0 },
    { period: '20:00', consumption: 4600, comparison: 4800, change: -4.2 }
  ]);

  // Mock energy breakdown
  const energyBreakdown: EnergyBreakdown = {
    electricity: 45,
    heating: 25,
    cooling: 15,
    lighting: 10,
    equipment: 5
  };

  // Calculate metrics
  const totalConsumption = buildings.reduce((sum, building) => sum + building.consumption, 0);
  const totalCapacity = buildings.reduce((sum, building) => sum + building.capacity, 0);
  const averageUsage = (totalConsumption / totalCapacity) * 100;
  const peakBuilding = buildings.reduce((prev, current) => 
    (current.consumption / current.capacity) > (prev.consumption / prev.capacity) ? current : prev
  );

  // Filter buildings
  const filteredBuildings = buildings.filter(building => 
    filterStatus === 'all' || building.status === filterStatus
  );

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

  const getStatusBadgeColor = (status: Building['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getBreakdownColor = (type: keyof EnergyBreakdown) => {
    const colors = {
      electricity: 'bg-blue-500',
      heating: 'bg-red-500',
      cooling: 'bg-cyan-500',
      lighting: 'bg-yellow-500',
      equipment: 'bg-purple-500'
    };
    return colors[type];
  };

  const formatPeriodLabel = (period: string) => {
    switch (selectedPeriod) {
      case 'today':
        return period;
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][parseInt(period)];
      case 'month':
        return `Week ${period}`;
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(period)];
      default:
        return period;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BuildingIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Building Energy Consumption</h3>
              <p className="text-sm text-gray-600">Real-time monitoring and analytics</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Buildings</option>
                <option value="normal">Normal</option>
                <option value="high">High Usage</option>
                <option value="critical">Critical</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Breakdown Toggle */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                showBreakdown 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {showBreakdown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>Breakdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-900">{totalConsumption.toFixed(0)}</p>
              <p className="text-sm text-blue-700">kWh Total Consumption</p>
              <p className="text-xs text-green-600 font-medium">+2.5% from yesterday</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="text-right">
                <span className="text-xs text-gray-600">Efficiency</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-900">{averageUsage.toFixed(1)}%</p>
              <p className="text-sm text-green-700">Average Usage</p>
              <p className="text-xs text-green-600 font-medium">Within optimal range</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
              <div className="text-right">
                <span className="text-xs text-gray-600">Peak Building</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-amber-900">{peakBuilding.name}</p>
              <p className="text-sm text-amber-700">{((peakBuilding.consumption / peakBuilding.capacity) * 100).toFixed(1)}% usage</p>
              <p className="text-xs text-amber-600 font-medium">{(peakBuilding.consumption).toFixed(1)} kWh</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="text-right">
                <span className="text-xs text-gray-600">Status</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-900">{buildings.filter(b => b.status === 'normal').length}</p>
              <p className="text-sm text-purple-700">Buildings Normal</p>
              <p className="text-xs text-purple-600 font-medium">{buildings.filter(b => b.status !== 'normal').length} need attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Consumption Trends</h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Current Period</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600">Previous Period</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          <div className="flex items-end justify-between h-full space-x-2">
            {trendData.map((data, index) => {
              const maxValue = Math.max(...trendData.map(d => Math.max(d.consumption, d.comparison)));
              const currentHeight = (data.consumption / maxValue) * 100;
              const comparisonHeight = (data.comparison / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                  <div className="w-full flex items-end justify-center space-x-1 h-40">
                    <div 
                      className="bg-gray-300 rounded-t-sm transition-all duration-300 hover:bg-gray-400 w-1/2"
                      style={{ height: `${comparisonHeight}%` }}
                      title={`Previous: ${data.comparison} kW`}
                    ></div>
                    <div 
                      className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 w-1/2"
                      style={{ height: `${currentHeight}%` }}
                      title={`Current: ${data.consumption} kW`}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900">{formatPeriodLabel(data.period)}</p>
                    <p className={`text-xs font-medium ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Energy Breakdown */}
      {showBreakdown && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Energy Usage Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart Representation */}
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    {/* Electricity */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${energyBreakdown.electricity} ${100 - energyBreakdown.electricity}`}
                      strokeDashoffset="0"
                    />
                    {/* Heating */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray={`${energyBreakdown.heating} ${100 - energyBreakdown.heating}`}
                      strokeDashoffset={`-${energyBreakdown.electricity}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{totalConsumption.toFixed(0)}</p>
                      <p className="text-xs text-gray-600">kW Total</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              {Object.entries(energyBreakdown).map(([type, percentage]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getBreakdownColor(type as keyof EnergyBreakdown)}`}></div>
                    <span className="font-medium text-gray-900 capitalize">{type}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{percentage}%</p>
                    <p className="text-sm text-gray-600">{((totalConsumption * percentage) / 100).toFixed(0)} kW</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Buildings List */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Buildings ({filteredBuildings.length})
          </h4>
          <div className="text-sm text-gray-600">
            Showing {filterStatus === 'all' ? 'all' : filterStatus} buildings
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBuildings.map((building) => {
            const usagePercentage = (building.consumption / building.capacity) * 100;
            const isHovered = hoveredBuilding === building.id;
            
            return (
              <div 
                key={building.id} 
                className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                  isHovered 
                    ? 'border-blue-300 shadow-lg bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onMouseEnter={() => setHoveredBuilding(building.id)}
                onMouseLeave={() => setHoveredBuilding(null)}
                onClick={() => setSelectedBuilding(selectedBuilding === building.id ? null : building.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(building.status)}
                    <div>
                      <h5 className="font-semibold text-gray-900">{building.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(building.status)}`}>
                        {building.status.charAt(0).toUpperCase() + building.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{building.consumption.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">kWh</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Usage: {usagePercentage.toFixed(1)}%</span>
                    <span>Capacity: {building.capacity} kW</span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getStatusColor(building.status)}`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                    {usagePercentage > 80 && (
                      <div className="absolute right-0 top-0 transform translate-x-full -translate-y-1/2">
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                          High Usage
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedBuilding === building.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600">Temperature: 22°C</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">Peak: 8AM-6PM</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h6 className="font-medium text-gray-900 mb-2">Recent Activity</h6>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>• HVAC system optimized at 2:30 PM</p>
                        <p>• Lighting schedule updated at 1:15 PM</p>
                        <p>• Energy efficiency: 92.3%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span>Auto-refresh: 30s</span>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Real-time monitoring active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEnergyConsumption;