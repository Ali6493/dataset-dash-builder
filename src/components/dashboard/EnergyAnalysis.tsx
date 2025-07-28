import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DeviceData } from '@/data/laptopData';

interface EnergyAnalysisProps {
  data: DeviceData[];
}

export const EnergyAnalysis = ({ data }: EnergyAnalysisProps) => {
  const energyData = data.map((device, index) => ({
    name: `${device.deviceManufacturer} ${device.deviceProductVersion.split(' ')[0]}`,
    cpuEnergy: device.cpuEnergyConsumption,
    diskEnergy: device.diskEnergyConsumption,
    displayEnergy: device.displayEnergyConsumption,
    networkEnergy: device.networkEnergyConsumption,
    totalEnergy: device.totalEnergyConsumption,
    co2Emission: device.totalCO2Emitted * 1000, // Convert to grams for better visualization
    index: index + 1
  })).sort((a, b) => a.totalEnergy - b.totalEnergy);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)} {entry.name.includes('CO2') ? 'g' : 'Wh'}
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
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="displayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0}/>
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
            <YAxis 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
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
              dataKey="displayEnergy"
              stackId="1"
              stroke="hsl(var(--warning))"
              fill="url(#displayGradient)"
              name="Display Energy"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="diskEnergy"
              stackId="1"
              stroke="hsl(var(--success))"
              fill="hsl(var(--success) / 0.3)"
              name="Disk Energy"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="networkEnergy"
              stackId="1"
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted-foreground) / 0.3)"
              name="Network Energy"
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Total Energy</span>
            <span className="font-bold text-danger">
              {energyData.reduce((sum, item) => sum + item.totalEnergy, 0).toFixed(1)} Wh
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Avg CO2 per Device</span>
            <span className="font-bold text-warning">
              {(energyData.reduce((sum, item) => sum + item.co2Emission, 0) / energyData.length).toFixed(1)} g
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};