import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DeviceData } from '@/data/laptopData';

interface EnergyAnalysisProps {
  data: DeviceData[];
}

export const EnergyAnalysis = ({ data }: EnergyAnalysisProps) => {
  const manufacturers = Array.from(new Set(data.map(d => d.deviceManufacturer)));
  const [selectedBrand, setSelectedBrand] = useState<string>(manufacturers[0]);

  const filtered = data.filter(d => d.deviceManufacturer === selectedBrand);

  const chartData = filtered.map((device, index) => ({
    name: typeof device.deviceProductVersion === 'string'
      ? device.deviceProductVersion.split(' ')[0]
      : String(device.deviceProductVersion ?? `Device ${index + 1}`),
    cpuEnergy: device.cpuEnergyConsumption,
    diskEnergy: device.diskEnergyConsumption,
    displayEnergy: device.displayEnergyConsumption,
    networkEnergy: device.networkEnergyConsumption,
    totalEnergy: device.totalEnergyConsumption
  }));

  const totalEnergy = chartData.reduce((sum, d) => sum + d.totalEnergy, 0).toFixed(1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)} Wh
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Consumption Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 w-60">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((brand, idx) => (
                <SelectItem key={idx} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="diskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="displayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="networkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="cpuEnergy"
              stackId="1"
              stroke="hsl(var(--primary))"
              fill="url(#cpuGradient)"
              name="CPU Energy"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="diskEnergy"
              stackId="1"
              stroke="hsl(var(--success))"
              fill="url(#diskGradient)"
              name="Disk Energy"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="displayEnergy"
              stackId="1"
              stroke="hsl(var(--warning))"
              fill="url(#displayGradient)"
              name="Display Energy"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="networkEnergy"
              stackId="1"
              stroke="hsl(var(--muted-foreground))"
              fill="url(#networkGradient)"
              name="Network Energy"
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 text-right text-sm">
          <span className="text-muted-foreground mr-2">Total Energy:</span>
          <span className="font-bold text-danger">{totalEnergy} Wh</span>
        </div>
      </CardContent>
    </Card>
  );
};
