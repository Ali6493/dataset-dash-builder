import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { laptopData } from '@/data/laptopData';

export const PerformanceChart = () => {
  const chartData = laptopData.map(laptop => ({
    name: `${laptop.brand} ${laptop.model.split(' ')[0]}`,
    batteryHealth: laptop.batteryHealth,
    cpuTemp: laptop.cpuTemp,
    ramUsage: Math.round((laptop.ramUsage / laptop.totalRam) * 100)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'cpuTemp' ? '°C' : 
               entry.dataKey === 'ramUsage' ? '%' : 
               entry.dataKey === 'batteryHealth' ? '%' : ''}
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
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Bar 
              dataKey="batteryHealth" 
              name="Battery Health" 
              fill="hsl(var(--success))" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="cpuTemp" 
              name="CPU Temp" 
              fill="hsl(var(--warning))" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="ramUsage" 
              name="RAM Usage" 
              fill="hsl(var(--primary))" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};