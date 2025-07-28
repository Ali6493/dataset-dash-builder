import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { DeviceData } from '@/data/laptopData';

interface EnergyBarChartProps {
  data: DeviceData[];
}

export const EnergyBarChart = ({ data }: EnergyBarChartProps) => {
  const validData = data.filter(d =>
    typeof d.cpuEnergyConsumption === 'number' &&
    typeof d.diskEnergyConsumption === 'number' &&
    typeof d.displayEnergyConsumption === 'number' &&
    typeof d.networkEnergyConsumption === 'number' &&
    typeof d.totalEnergyConsumption === 'number'
  );

  const average = (key: keyof DeviceData) =>
    (validData.reduce((sum, item) => sum + (item[key] as number), 0) / validData.length).toFixed(1);

  const chartData = [
    {
      name: 'CPU',
      energy: parseFloat(average('cpuEnergyConsumption'))
    },
    {
      name: 'Disk',
      energy: parseFloat(average('diskEnergyConsumption'))
    },
    {
      name: 'Display',
      energy: parseFloat(average('displayEnergyConsumption'))
    },
    {
      name: 'Network',
      energy: parseFloat(average('networkEnergyConsumption'))
    },
    {
      name: 'Total',
      energy: parseFloat(average('totalEnergyConsumption'))
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Energy Consumption (Wh)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="energy" fill="hsl(var(--primary))" name="Avg Energy (Wh)" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
