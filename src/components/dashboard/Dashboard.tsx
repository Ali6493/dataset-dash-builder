import { useState } from 'react';
import { 
  Monitor, 
  Battery, 
  Leaf, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  Server,
  Factory
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PerformanceChart } from './PerformanceChart';
import { BrandDistribution } from './BrandDistribution';
import { DeviceTable } from './DeviceTable';
import { EnergyBarChart } from '@/components/dashboard/EnergyAnalysis';
import { CompanyComparisonChart } from '@/components/dashboard/CompanyComparisonChart';
import { getPerformanceMetrics } from '@/data/laptopData';
import { DeviceData, loadDeviceData } from '@/data/laptopData';
import { useEffect } from 'react';

export const Dashboard = () => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  
  useEffect(() => {
    loadDeviceData().then(setDeviceData);
  }, []);
    
  const metrics = getPerformanceMetrics(deviceData);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Device Energy & Performance Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor device energy consumption, CO2 emissions, and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Devices"
            value={metrics.totalDevices.toString()}
            icon={<Monitor className="h-6 w-6" />}
            description="Connected devices"
          />
          <MetricCard
            title="Avg Battery Health"
            value={`${metrics.avgBatteryHealth}%`}
            icon={<Battery className="h-6 w-6" />}
            description="Fleet average"
          />
          <MetricCard
            title="Avg CO2 Emission"
            value={`${metrics.avgCO2Emission} kg`}
            icon={<Leaf className="h-6 w-6" />}
            description="Carbon footprint"
            variant="warning"
          />
          <MetricCard
            title="Avg Energy Usage"
            value={`${metrics.avgEnergyConsumption} Wh`}
            icon={<Zap className="h-6 w-6" />}
            description="Power consumption"
          />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Performance Trends
            </h2>
            <PerformanceChart data={deviceData} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Factory className="h-6 w-6" />
              Manufacturer Distribution
            </h2>
            <BrandDistribution data={deviceData} />
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Energy Consumption Analysis
            </h2>
            <EnergyBarChart data={deviceData} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Factory className="h-6 w-6" />
              Company Comparison
            </h2>
            <CompanyComparisonChart data={deviceData} />
          </div>
        </div>

        {/* Fleet Health */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Server className="h-6 w-6" />
              Fleet Health Overview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Healthy Systems"
                value={`${metrics.healthyPercentage}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                description="Good or excellent"
              />
              <MetricCard
                title="Critical Alerts"
                value={metrics.criticalCount.toString()}
                icon={<AlertTriangle className="h-5 w-5" />}
                description="Require attention"
                variant="destructive"
              />
              <MetricCard
                title="Excellent Devices"
                value={metrics.excellentCount.toString()}
                icon={<Battery className="h-5 w-5" />}
                description="Top performers"
              />
              <MetricCard
                title="Total Energy"
                value={`${deviceData.reduce((sum, d) => sum + d.totalEnergyConsumption, 0).toFixed(1)} Wh`}
                icon={<Zap className="h-5 w-5" />}
                description="Fleet consumption"
              />
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Device Inventory</h2>
          <DeviceTable data={deviceData} />
        </div>
      </div>
    </div>
  );
};
