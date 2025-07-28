import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DeviceData } from '@/data/laptopData';

interface EnergyBarChartProps {
  data: DeviceData[];
}

export const EnergyBarChart = ({ data }: EnergyBarChartProps) => {
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');

  // Get unique manufacturers
  const manufacturers = Array.from(new Set(data.map(d => d.deviceManufacturer).filter(Boolean))).sort();

  // Filter data
  const filtered = selectedManufacturer === 'All' 
    ? data 
    : data.filter(d => d.deviceManufacturer === selectedManufacturer);

  // Calculate averages
  const avg = {
    cpu: filtered.reduce((sum, d) => sum + (d.cpuEnergyConsumption || 0), 0) / filtered.length,
    disk: filtered.reduce((sum, d) => sum + (d.diskEnergyConsumption || 0), 0) / filtered.length,
    display: filtered.reduce((sum, d) => sum + (d.displayEnergyConsumption || 0), 0) / filtered.length,
    network: filtered.reduce((sum, d) => sum + (d.networkEnergyConsumption || 0), 0) / filtered.length,
  };

  const chartData = [
    { name: 'CPU', energy: avg.cpu },
    { name: 'Disk', energy: avg.disk },
    { name: 'Display', energy: avg.display },
    { name: 'Network', energy: avg.network },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Avg Energy Consumption per Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select manufacturer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {manufacturers.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} unit=" Wh" />
            <Tooltip />
            <Legend />
            <Bar dataKey="energy" fill="hsl(var(--primary))" name="Avg Energy (Wh)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
