import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import EnhancedEnergyConsumption from '../components/EnhancedEnergyConsumption';
import SolarGeneration from '../components/SolarGeneration';
import BatteryStorage from '../components/BatteryStorage';
import EVCharging from '../components/EVCharging';
import { buildings, solarPanels, batteries, evChargers, getEnergyMetrics } from '../utils/mockData';
import { 
  Activity, 
  Sun, 
  Battery, 
  Car, 
  Leaf, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [metrics, setMetrics] = useState(getEnergyMetrics());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small fluctuations in data
      buildings.forEach(building => {
        const variation = (Math.random() - 0.5) * 50;
        building.consumption = Math.max(0, Math.min(building.capacity, 
          building.consumption + variation));
      });

      solarPanels.forEach(panel => {
        if (panel.status === 'online') {
          const variation = (Math.random() - 0.5) * 20;
          panel.generation = Math.max(0, Math.min(panel.capacity, 
            panel.generation + variation));
          panel.efficiency = (panel.generation / panel.capacity) * 100;
        }
      });

      batteries.forEach(battery => {
        if (battery.status === 'charging') {
          battery.charge = Math.min(100, battery.charge + Math.random() * 2);
        } else if (battery.status === 'discharging') {
          battery.charge = Math.max(0, battery.charge - Math.random() * 1.5);
        }
      });

      setMetrics(getEnergyMetrics());
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const netPower = metrics.totalGeneration - metrics.totalConsumption;
  const isExporting = netPower > 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Energy Dashboard</h1>
          <p className="text-gray-600">The university campus - Real-time monitoring of energy systems</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Consumption"
            value={metrics.totalConsumption.toFixed(0)}
            unit="kWh"
            icon={Activity}
            trend="up"
            trendValue="2.5% from yesterday"
            color="blue"
          />
          <MetricCard
            title="Solar Generation"
            value={metrics.totalGeneration.toFixed(0)}
            unit="kWh"
            icon={Sun}
            trend="up"
            trendValue="8.2% from yesterday"
            color="amber"
          />
          <MetricCard
            title="Battery Level"
            value={metrics.batteryLevel.toFixed(1)}
            unit="%"
            icon={Battery}
            trend="stable"
            trendValue="Optimal range"
            color="green"
          />
          <MetricCard
            title="Active EVs"
            value={metrics.activeEVs}
            unit="vehicles"
            icon={Car}
            trend="up"
            trendValue="3 more than usual"
            color="blue"
          />
          <MetricCard
            title="Carbon Offset"
            value={metrics.carbonOffset.toFixed(1)}
            unit="kg CO₂"
            icon={Leaf}
            trend="up"
            trendValue="Daily savings"
            color="green"
          />
          <MetricCard
            title="Cost Savings"
            value={`$${metrics.costSavings.toFixed(0)}`}
            icon={DollarSign}
            trend="up"
            trendValue="Today's savings"
            color="purple"
          />
        </div>

        {/* Net Power Status */}
        <div className="mb-8">
          <div className={`rounded-xl p-6 border-2 ${
            isExporting 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isExporting ? (
                  <TrendingUp className="h-8 w-8 text-green-600" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-amber-600" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${
                    isExporting ? 'text-green-900' : 'text-amber-900'
                  }`}>
                    {isExporting ? 'Exporting Energy' : 'Importing Energy'}
                  </h3>
                  <p className={`text-sm ${
                    isExporting ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {isExporting 
                      ? 'Campus is generating surplus renewable energy'
                      : 'Campus is drawing from grid to meet demand'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${
                  isExporting ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {Math.abs(netPower).toFixed(1)} kWh
                </p>
                <p className={`text-sm ${
                  isExporting ? 'text-green-600' : 'text-amber-600'
                }`}>
                  Net {isExporting ? 'export' : 'import'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Energy Consumption Section */}
        <div className="mb-8">
          <EnhancedEnergyConsumption buildings={buildings} />
        </div>

        {/* Other Dashboard Components */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-8">
            <BatteryStorage batteries={batteries} />
          </div>
          <div className="space-y-8">
            <SolarGeneration panels={solarPanels} />
            <EVCharging chargers={evChargers} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>Last updated: {lastUpdate.toLocaleTimeString()}</p>
            <p>Smart Energy Management System v2.1</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;