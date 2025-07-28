import { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { getDeviceStatus, DeviceData } from '@/data/laptopData';

interface DeviceTableProps {
  data: DeviceData[];
}

export const DeviceTable = ({ data }: DeviceTableProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const [manufacturer, setManufacturer] = useState('all');
  const [cpuModel, setCpuModel] = useState('all');
  const [ram, setRam] = useState('');
  const [gpu, setGpu] = useState('');
  const [batteryHealthMin, setBatteryHealthMin] = useState('');
  const [batteryHealthMax, setBatteryHealthMax] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const unique = (key: keyof DeviceData) =>
    [...new Set(data.map((d) => d[key] ?? ''))].filter((v) => v);

  const filtered = useMemo(() => {
    return data.filter((device) => {
      const status = getDeviceStatus(device);
      return (
        (manufacturer !== 'all' ? device.deviceManufacturer === manufacturer : true) &&
        (cpuModel !== 'all' ? device.cpuModel === cpuModel : true) &&
        (ram ? device.totalRam === Number(ram) : true) &&
        (gpu ? device.graphicalCards?.toLowerCase().includes(gpu.toLowerCase()) : true) &&
        (batteryHealthMin ? device.batteryHealth >= Number(batteryHealthMin) : true) &&
        (batteryHealthMax ? device.batteryHealth <= Number(batteryHealthMax) : true) &&
        (statusFilter !== 'all' ? getDeviceStatus(device) === statusFilter : true)
      );
    });
  }, [data, manufacturer, cpuModel, ram, gpu, batteryHealthMin, batteryHealthMax, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'default';
      case 'good':
        return 'secondary';
      case 'warning':
        return 'outline';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Device Inventory</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <Select value={manufacturer} onValueChange={setManufacturer}>
              <SelectTrigger>Manufacturer</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {unique('deviceManufacturer').map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cpuModel} onValueChange={setCpuModel}>
              <SelectTrigger>CPU Model</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {unique('cpuModel').map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="RAM (GB)"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
            />
            <Input
              placeholder="GPU"
              value={gpu}
              onChange={(e) => setGpu(e.target.value)}
            />
            <Input
              placeholder="Battery Health Min (%)"
              value={batteryHealthMin}
              onChange={(e) => setBatteryHealthMin(e.target.value)}
            />
            <Input
              placeholder="Battery Health Max (%)"
              value={batteryHealthMax}
              onChange={(e) => setBatteryHealthMax(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>Status</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>GPU</TableHead>
                <TableHead>Battery Health</TableHead>
                <TableHead>Battery Life</TableHead>
                <TableHead>Total Energy</TableHead>
                <TableHead>CO2</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.deviceManufacturer}</TableCell>
                  <TableCell>{device.deviceProductVersion}</TableCell>
                  <TableCell>{device.cpuModel}</TableCell>
                  <TableCell>{device.totalRam}</TableCell>
                  <TableCell>{device.graphicalCards}</TableCell>
                  <TableCell>
                    {typeof device.batteryHealth === 'number'
                      ? `${device.batteryHealth.toFixed(1)}%`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{device.estimatedBatteryLife}</TableCell>
                  <TableCell>{device.totalEnergyConsumption}</TableCell>
                  <TableCell>{device.totalCO2Emitted.toFixed(6)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(getDeviceStatus(device))}>
                      {getDeviceStatus(device)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filtered.length} of {data.length} devices
        </div>
      </CardContent>
    </Card>
  );
};
