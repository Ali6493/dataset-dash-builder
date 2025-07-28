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
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getDeviceStatus, DeviceData } from '@/data/laptopData';

interface DeviceTableProps {
  data: DeviceData[];
}

export const DeviceTable = ({ data }: DeviceTableProps) => {
  const [manufacturer, setManufacturer] = useState('all');
  const [cpuModel, setCpuModel] = useState('all');
  const [ram, setRam] = useState('');
  const [gpu, setGpu] = useState('');
  const [batteryHealthMin, setBatteryHealthMin] = useState('');
  const [batteryHealthMax, setBatteryHealthMax] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const unique = (key: keyof DeviceData) => [...new Set(data.map((d) => d[key] ?? ''))];

  const filtered = useMemo(() => {
    return data.filter((device) => {
      const status = getDeviceStatus(device);
      return (
        (manufacturer !== 'all' ? device.deviceManufacturer === manufacturer : true) &&
        (cpuModel !== 'all' ? device.cpuModel === cpuModel : true) &&
        (ram ? device.totalRam === Number(ram) : true) &&
        (gpu ? device.graphicalCards === gpu : true) &&
        (batteryHealthMin ? device.batteryHealth >= Number(batteryHealthMin) : true) &&
        (batteryHealthMax ? device.batteryHealth <= Number(batteryHealthMax) : true) &&
        (statusFilter.length ? statusFilter.includes(status) : true)
      );
    });
  }, [data, manufacturer, cpuModel, ram, gpu, batteryHealthMin, batteryHealthMax, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'warning': return 'outline';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Device Inventory</CardTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <Select value={manufacturer} onValueChange={setManufacturer}>
            <SelectTrigger>
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {unique('deviceManufacturer').filter(Boolean).map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={cpuModel} onValueChange={setCpuModel}>
            <SelectTrigger>
              <SelectValue placeholder="CPU Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {unique('cpuModel').filter(Boolean).map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input placeholder="RAM (GB)" value={ram} onChange={(e) => setRam(e.target.value)} />
          <Input placeholder="GPU Model" value={gpu} onChange={(e) => setGpu(e.target.value)} />
          <Input placeholder="Battery Health Min %" value={batteryHealthMin} onChange={(e) => setBatteryHealthMin(e.target.value)} />
          <Input placeholder="Battery Health Max %" value={batteryHealthMax} onChange={(e) => setBatteryHealthMax(e.target.value)} />
        </div>
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
                <TableHead>Battery</TableHead>
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
                  <TableCell>{device.batteryHealth}%</TableCell>
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
