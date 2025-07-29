import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

  const metrics = [
    { key: 'batteryHealth', label: 'Battery Health (%)', color: 'hsl(var(--success))' },
    { key: 'cpuEnergy', label: 'CPU Energy (Wh)', color: 'hsl(var(--primary))' },
    { key: 'diskEnergy', label: 'Disk Energy (Wh)', color: 'hsl(var(--warning))' },
    { key: 'displayEnergy', label: 'Display Energy (Wh)', color: 'hsl(var(--accent))' },
    { key: 'networkEnergy', label: 'Network Energy (Wh)', color: '#8884d8' },
    { key: 'totalEnergy', label: 'Total Energy (Wh)', color: 'hsl(var(--foreground))' },
    { key: 'co2', label: 'CO2 Emissions (kg)', color: 'hsl(var(--danger))' },
  ];

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

  const chartData = selectedMetric === 'all'
    ? metrics.flatMap(metric => {
        const dataPoints = [];
        if (company1) {
          const val = aggregateCompanyData(company1)[metric.key as keyof ReturnType<typeof aggregateCompanyData>];
          dataPoints.push({ category: metric.label, company: company1, value: val, color: metric.color });
        }
        if (company2) {
          const val = aggregateCompanyData(company2)[metric.key as keyof ReturnType<typeof aggregateCompanyData>];
          dataPoints.push({ category: metric.label, company: company2, value: val, color: metric.color });
        }
        return dataPoints;
      })
    : [company1, company2].filter(Boolean).map(company => {
        const agg = aggregateCompanyData(company);
        const metricObj = metrics.find(m => m.key === selectedMetric)!;
        return {
          category: metricObj.label,
          company,
          value: agg[selectedMetric as keyof typeof agg],
          color: metricObj.color,
        };
      });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Company Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select onValueChange={setCompany1} value={company1}>
            <SelectTrigger>{company1 || 'Select Company 1'}</SelectTrigger>
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
            <SelectTrigger>
              {selectedMetric === 'all' ? 'All Metrics' : metrics.find(m => m.key === selectedMetric)?.label}
            </SelectTrigger>
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
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 30 }}
            barCategoryGap={selectedMetric === 'all' ? 10 : 30}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" />
            {/* No Tooltip */}
            <Legend />
            {[company1, company2].filter(Boolean).map(company => (
              <Bar
                key={company}
                dataKey="value"
                data={chartData.filter(d => d.company === company)}
                name={company}
                fill={chartData.find(d => d.company === company)?.color || 'gray'}
                barSize={20}
              >
                <LabelList dataKey="value" position="right" formatter={(v: number) => v.toFixed(1)} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
