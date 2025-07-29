import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { DeviceData } from '@/data/laptopData';

interface ComparisonChartProps {
  data: DeviceData[];
}

export const CompanyComparisonChart = ({ data }: ComparisonChartProps) => {
  const [company1, setCompany1] = useState('');
  const [company2, setCompany2] = useState('');

  const uniqueManufacturers = [...new Set(data.map(d => d.deviceManufacturer))];

  const aggregateCompanyData = (company: string) => {
    const devices = data.filter(d => d.deviceManufacturer === company);
    const total = (key: keyof DeviceData) =>
      devices.reduce((sum, device) => sum + (device[key] as number || 0), 0);

    const avg = (key: keyof DeviceData) => devices.length ? total(key) / devices.length : 0;

    return {
      name: company,
      batteryHealth: avg('batteryHealth'),
      cpuEnergy: avg('cpuEnergyConsumption'),
      diskEnergy: avg('diskEnergyConsumption'),
      displayEnergy: avg('displayEnergyConsumption'),
      networkEnergy: avg('networkEnergyConsumption'),
      totalEnergy: avg('totalEnergyConsumption'),
      co2: avg('totalCO2Emitted'),
    };
  };

  const chartData = [company1, company2]
    .filter(Boolean)
    .map(company => aggregateCompanyData(company));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Company Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select onValueChange={setCompany1} value={company1}>
            <SelectTrigger>Company 1</SelectTrigger>
            <SelectContent>
              {uniqueManufacturers.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setCompany2} value={company2}>
            <SelectTrigger>Company 2</SelectTrigger>
            <SelectContent>
              {uniqueManufacturers.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
            barCategoryGap={30}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="batteryHealth" fill="hsl(var(--success))" name="Battery Health (%)">
              <LabelList dataKey="batteryHealth" position="top" formatter={(v: number) => v.toFixed(1)} />
            </Bar>
            <Bar dataKey="cpuEnergy" fill="hsl(var(--primary))" name="CPU Energy (Wh)" />
            <Bar dataKey="diskEnergy" fill="hsl(var(--warning))" name="Disk Energy (Wh)" />
            <Bar dataKey="displayEnergy" fill="hsl(var(--accent))" name="Display Energy (Wh)" />
            <Bar dataKey="networkEnergy" fill="hsl(var(--muted))" name="Network Energy (Wh)" />
            <Bar dataKey="totalEnergy" fill="hsl(var(--foreground))" name="Total Energy (Wh)" />
            <Bar dataKey="co2" fill="hsl(var(--danger))" name="CO2 Emissions (kg)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
