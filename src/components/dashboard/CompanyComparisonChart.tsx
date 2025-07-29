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
  const [selectedMetric, setSelectedMetric] = useState('all');

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

    const metrics = [
    { key: 'batteryHealth', label: 'Battery Health (%)', color: 'hsl(var(--success))' },
    { key: 'cpuEnergy', label: 'CPU Energy (Wh)', color: 'hsl(var(--primary))' },
    { key: 'diskEnergy', label: 'Disk Energy (Wh)', color: 'hsl(var(--warning))' },
    { key: 'displayEnergy', label: 'Display Energy (Wh)', color: 'hsl(var(--accent))' },
    { key: 'networkEnergy', label: 'Network Energy (Wh)', color: 'hsl(var(--muted))' },
    { key: 'totalEnergy', label: 'Total Energy (Wh)', color: 'hsl(var(--foreground))' },
    { key: 'co2', label: 'CO2 Emissions (kg)', color: 'hsl(var(--danger))' },
  ];

  const selectedMetrics = selectedMetric === 'all' 
    ? metrics 
    : metrics.filter(m => m.key === selectedMetric);
  
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
            <SelectTrigger>{company2 || 'Select Company 2'}</SelectTrigger>
            <SelectContent>
              {uniqueManufacturers.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedMetric} value={selectedMetric}>
            <SelectTrigger>{selectedMetric === 'all' ? 'All Metrics' : metrics.find(m => m.key === selectedMetric)?.label}</SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              {metrics.map(m => (
                <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
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
            {selectedMetrics.map(metric => (
              <Bar 
                key={metric.key} 
                dataKey={metric.key} 
                fill={metric.color} 
                name={metric.label}
              >
                <LabelList dataKey={metric.key} position="top" formatter={(v: number) => v.toFixed(1)} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
