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

  const metrics = [
    { key: 'batteryHealth', label: 'Battery Health (%)' },
    { key: 'cpuEnergy', label: 'CPU Energy (Wh)' },
    { key: 'diskEnergy', label: 'Disk Energy (Wh)' },
    { key: 'displayEnergy', label: 'Display Energy (Wh)' },
    { key: 'networkEnergy', label: 'Network Energy (Wh)' },
    { key: 'totalEnergy', label: 'Total Energy (Wh)' },
    { key: 'co2', label: 'CO2 Emissions (kg)' },
  ];

  const selectedMetrics = selectedMetric === 'all'
    ? metrics
    : metrics.filter(m => m.key === selectedMetric);

  const chartData =
    selectedMetric === 'all'
      ? metrics.map(metric => ({
          metric: metric.label,
          [company1]: company1 ? aggregateCompanyData(company1)[metric.key as keyof ReturnType<typeof aggregateCompanyData>] : 0,
          [company2]: company2 ? aggregateCompanyData(company2)[metric.key as keyof ReturnType<typeof aggregateCompanyData>] : 0,
        }))
      : [company1, company2].filter(Boolean).map(company => ({
          name: company,
          value: company ? aggregateCompanyData(company)[selectedMetrics[0].key as keyof ReturnType<typeof aggregateCompanyData>] : 0,
        }));

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
              {selectedMetric === 'all'
                ? 'All Metrics'
                : selectedMetrics[0].label}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              {metrics.map(m => (
                <SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          {selectedMetric === 'all' ? (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              barCategoryGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="metric" type="category" />
              <Legend />
              {company1 && (
                <Bar dataKey={company1} fill="hsl(var(--success))">
                  <LabelList dataKey={company1} position="right" formatter={(v: number) => v.toFixed(1)} />
                </Bar>
              )}
              {company2 && (
                <Bar dataKey={company2} fill="hsl(var(--primary))">
                  <LabelList dataKey={company2} position="right" formatter={(v: number) => v.toFixed(1)} />
                </Bar>
              )}
            </BarChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              barCategoryGap={30}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar
                dataKey="value"
                fill="hsl(var(--success))"
                name={selectedMetrics[0].label}
              >
                <LabelList dataKey="value" position="top" formatter={(v: number) => v.toFixed(1)} />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
