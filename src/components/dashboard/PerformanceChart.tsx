import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DeviceData } from '@/data/laptopData';

interface PerformanceChartProps {
  data: DeviceData[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const chartData = data.map((device, index) => ({
    name: `${device.deviceManufacturer} ${index + 1}`,
    batteryHealth: device.batteryHealth,
    energyConsumption: device.totalEnergyConsumption,
    co2Emission: device.totalCO2Emitted * 1000, // Convert to grams
    batteryLife: device.estimatedBatteryLife
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
              {entry.dataKey === 'batteryHealth' ? '%' : 
               entry.dataKey === 'energyConsumption' ? ' Wh' : 
               entry.dataKey === 'co2Emission' ? ' g' :
               entry.dataKey === 'batteryLife' ? ' hrs' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Line
              type="monotone"
              dataKey="batteryHealth"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              name="Battery Health (%)"
            />
            <Line
              type="monotone"
              dataKey="energyConsumption"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              name="Energy Consumption (Wh)"
            />
            <Line
              type="monotone"
              dataKey="co2Emission"
              stroke="hsl(var(--danger))"
              strokeWidth={2}
              name="CO2 Emission (g)"
            />
            <Line
              type="monotone"
              dataKey="batteryLife"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Battery Life (hrs)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};