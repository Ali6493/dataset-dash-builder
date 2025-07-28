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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter as FilterIcon } from 'lucide-react';
import { getDeviceStatus, DeviceData } from '@/data/laptopData';

interface DeviceTableProps {
  data: DeviceData[];
}

export const DeviceTable = ({ data }: DeviceTableProps) => {
  const [manufacturer, setManufacturer] = useState('');
  const [cpuModel, setCpuModel] = useState('');
  const [ram, setRam] = useState('');
  const [gpu, setGpu] = useState('');
  const [batteryHealthMin, setBatteryHealthMin] = useState('');
  const [batteryHealthMax, setBatteryHealthMax] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const unique = (key: keyof DeviceData) => [...new Set(data.map((d) => d[key] ?? ''))];

  const filtered = useMemo(() => {
    return data.filter((device) => {
      const batteryHealth = typeof device.batteryHealth === 'number' ? device.batteryHealth : parseFloat(device.batteryHealth);
      return (
        (manufacturer ? device.deviceManufacturer === manufacturer : true) &&
        (cpuModel ? device.cpuModel === cpuModel : true) &&
        (ram ? device.totalRam === Number(ram) : true) &&
        (gpu ? device.graphicalCards === gpu : true) &&
        (batteryHealthMin ? batteryHealth >= Number(batteryHealthMin) : true) &&
        (batteryHealthMax ? batteryHealth <= Number(batteryHealthMax) : true)
      );
    });
  }, [data, manufacturer, cpuModel, ram, gpu, batteryHealthMin, batteryHealthMax]);

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
        <div className="flex items-center justify-between">
          <CardTitle>Device Inventory</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FilterIcon className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {filterOpen && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <Select onValueChange={setManufacturer} value={manufacturer}>
              <SelectTrigger>Manufacturer</SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {unique('deviceManufacturer').filter(Boolean).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCpuModel} value={cpuModel}>
              <SelectTrigger>CPU Model</SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
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
        )}
      </CardHeader>

      {!collapsed && (
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
                  <TableHead># GPUs</TableHead>
                  <TableHead>GPU RAM</TableHead>
                  <TableHead>Battery Designed</TableHead>
                  <TableHead>Battery Full</TableHead>
                  <TableHead>Battery Health</TableHead>
                  <TableHead>Battery Life</TableHead>
                  <TableHead>CPU Energy</TableHead>
                  <TableHead>Disk Energy</TableHead>
                  <TableHead>Display Energy</TableHead>
                  <TableHead>Network Energy</TableHead>
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
                    <TableCell>{device.numberOfGraphicalCards}</TableCell>
                    <TableCell>{device.graphicalCardRam}</TableCell>
                    <TableCell>{device.batteryDesignedCapacity}</TableCell>
                    <TableCell>{device.batteryFullChargeCapacity}</TableCell>
                    <TableCell>{
                      typeof device.batteryHealth === 'number'
                        ? device.batteryHealth.toFixed(1) + '%'
                        : typeof device.batteryHealth === 'string' && device.batteryHealth.trim().endsWith('%')
                          ? device.batteryHealth
                          : 'N/A'
                    }</TableCell>
                    <TableCell>{device.estimatedBatteryLife}</TableCell>
                    <TableCell>{device.cpuEnergyConsumption}</TableCell>
                    <TableCell>{device.diskEnergyConsumption}</TableCell>
                    <TableCell>{device.displayEnergyConsumption}</TableCell>
                    <TableCell>{device.networkEnergyConsumption}</TableCell>
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
      )}
    </Card>
  );
};
