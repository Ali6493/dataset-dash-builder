import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { laptopData } from '@/data/laptopData';

export const TemperatureGauge = () => {
  const tempData = laptopData.map((laptop, index) => ({
    name: laptop.brand,
    cpuTemp: laptop.cpuTemp,
    gpuTemp: laptop.gpuTemp || 0,
    index: index + 1
  })).sort((a, b) => a.cpuTemp - b.cpuTemp);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-card-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}°C
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
        <CardTitle>Temperature Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={tempData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
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
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="cpuTemp"
              stroke="hsl(var(--warning))"
              fillOpacity={1}
              fill="url(#cpuGradient)"
              name="CPU Temperature"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="gpuTemp"
              stroke="hsl(var(--danger))"
              fillOpacity={1}
              fill="url(#gpuGradient)"
              name="GPU Temperature"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Avg CPU Temp</span>
            <span className="font-bold text-warning">
              {Math.round(tempData.reduce((sum, item) => sum + item.cpuTemp, 0) / tempData.length)}°C
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Max CPU Temp</span>
            <span className="font-bold text-danger">
              {Math.max(...tempData.map(item => item.cpuTemp))}°C
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};