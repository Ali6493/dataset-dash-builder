import { 
  Laptop, 
  Battery, 
  Thermometer, 
  HardDrive, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Cpu
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { PerformanceChart } from './PerformanceChart';
import { BrandDistribution } from './BrandDistribution';
import { LaptopTable } from './LaptopTable';
import { TemperatureGauge } from './TemperatureGauge';
import { getPerformanceMetrics } from '@/data/laptopData';

export const Dashboard = () => {
  const metrics = getPerformanceMetrics();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Laptop Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage your laptop fleet performance
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Laptops"
            value={metrics.totalLaptops}
            icon={<Laptop className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
            variant="gradient"
          />
          <MetricCard
            title="Avg Battery Health"
            value={`${metrics.avgBatteryHealth}%`}
            icon={<Battery className="h-6 w-6" />}
            trend={{ value: 3, isPositive: true }}
            variant="primary"
          />
          <MetricCard
            title="Avg CPU Temperature"
            value={`${metrics.avgCpuTemp}°C`}
            icon={<Thermometer className="h-6 w-6" />}
            trend={{ value: 2, isPositive: false }}
            variant="accent"
          />
          <MetricCard
            title="Critical Alerts"
            value={metrics.criticalCount}
            icon={<AlertTriangle className="h-6 w-6" />}
            className={metrics.criticalCount > 0 ? "border-danger" : ""}
          />
        </div>

        {/* Performance Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Healthy Systems"
            value={`${metrics.healthyPercentage}%`}
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Excellent Condition"
            value={metrics.excellentCount}
            icon={<Cpu className="h-6 w-6" />}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Total Value"
            value={`$${(metrics.totalLaptops * 1599).toLocaleString()}`}
            icon={<HardDrive className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PerformanceChart />
          <BrandDistribution />
        </div>

        {/* Temperature Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemperatureGauge />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Battery className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Battery</p>
                    <p className="font-bold text-success">MacBook Pro - 98%</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-danger/10 to-danger/5 border border-danger/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-danger/10 rounded-lg">
                    <Thermometer className="h-5 w-5 text-danger" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hottest CPU</p>
                    <p className="font-bold text-danger">Acer Predator - 85°C</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-lg">
              <h3 className="font-semibold mb-3 text-warning">Maintenance Alerts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Acer Predator Helios</span>
                  <span className="text-danger font-medium">Critical - Service Required</span>
                </div>
                <div className="flex justify-between">
                  <span>Microsoft Surface Laptop</span>
                  <span className="text-warning font-medium">Low Battery Health</span>
                </div>
                <div className="flex justify-between">
                  <span>Lenovo ThinkPad X1</span>
                  <span className="text-warning font-medium">High Temperature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <LaptopTable />
      </div>
    </div>
  );
};