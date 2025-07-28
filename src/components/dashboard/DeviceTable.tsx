import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { DeviceData, getDeviceStatus } from '@/data/laptopData';
import { cn } from '@/lib/utils';

type SortField = keyof DeviceData;
type SortDirection = 'asc' | 'desc';

interface DeviceTableProps {
  data: DeviceData[];
}

export const DeviceTable = ({ data }: DeviceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('deviceManufacturer');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [collapsed, setCollapsed] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const [manufacturerFilter, setManufacturerFilter] = useState('all');
  const [cpuFilter, setCpuFilter] = useState('all');
  const [ramFilter, setRamFilter] = useState('');
  const [gpuFilter, setGpuFilter] = useState('');
  const [batteryHealthMin, setBatteryHealthMin] = useState('');
  const [batteryHealthMax, setBatteryHealthMax] = useState('');

  const filteredData = data.filter(device => {
    const status = getDeviceStatus(device);
    return (
      `${device.deviceManufacturer} ${device.deviceProductVersion} ${device.cpuModel}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (manufacturerFilter === 'all' || device.deviceManufacturer === manufacturerFilter) &&
      (cpuFilter === 'all' || device.cpuModel === cpuFilter) &&
      (ramFilter === '' || device.totalRam === Number(ramFilter)) &&
      (gpuFilter === '' || device.graphicalCards?.toLowerCase().includes(gpuFilter.toLowerCase())) &&
      (batteryHealthMin === '' || device.batteryHealth >= Number(batteryHealthMin)) &&
      (batteryHealthMax === '' || device.batteryHealth <= Number(batteryHealthMax))
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'warning': return 'outline';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  const unique = (key: keyof DeviceData) => [...new Set(data.map((d) => d[key] ?? ''))];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Device Inventory</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {filterOpen && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            <Select onValueChange={setManufacturerFilter} value={manufacturerFilter}>
              <SelectTrigger>Manufacturer</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {unique('deviceManufacturer').map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCpuFilter} value={cpuFilter}>
              <SelectTrigger>CPU</SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {unique('cpuModel').map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="RAM (GB)" value={ramFilter} onChange={(e) => setRamFilter(e.target.value)} />
            <Input placeholder="GPU" value={gpuFilter} onChange={(e) => setGpuFilter(e.target.value)} />
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
                  <SortableHeader field="deviceManufacturer">Manufacturer</SortableHeader>
                  <SortableHeader field="deviceProductVersion">Model</SortableHeader>
                  <SortableHeader field="cpuModel">CPU Model</SortableHeader>
                  <SortableHeader field="totalRam">RAM (GB)</SortableHeader>
                  <TableHead>GPU</TableHead>
                  <TableHead># GPUs</TableHead>
                  <TableHead>GPU RAM</TableHead>
                  <TableHead>Battery Designed</TableHead>
                  <TableHead>Battery Full</TableHead>
                  <SortableHeader field="batteryHealth">Battery Health</SortableHeader>
                  <TableHead>Battery Life</TableHead>
                  <TableHead>CPU Energy</TableHead>
                  <TableHead>Disk Energy</TableHead>
                  <TableHead>Display Energy</TableHead>
                  <TableHead>Network Energy</TableHead>
                  <SortableHeader field="totalEnergyConsumption">Total Energy</SortableHeader>
                  <SortableHeader field="totalCO2Emitted">CO2</SortableHeader>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((device) => {
                  const status = getDeviceStatus(device);
                  return (
                    <TableRow key={device.id} className="hover:bg-muted/50">
                      <TableCell>{device.deviceManufacturer}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{device.deviceProductVersion}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{device.cpuModel}</TableCell>
                      <TableCell>{device.totalRam}</TableCell>
                      <TableCell>{device.graphicalCards}</TableCell>
                      <TableCell>{device.numberOfGraphicalCards}</TableCell>
                      <TableCell>{device.graphicalCardRam}</TableCell>
                      <TableCell>{device.batteryDesignedCapacity}</TableCell>
                      <TableCell>{device.batteryFullChargeCapacity}</TableCell>
                      <TableCell>
                        {typeof device.batteryHealth === 'number'
                          ? device.batteryHealth.toFixed(1) + '%'
                          : typeof device.batteryHealth === 'string' && device.batteryHealth.trim().endsWith('%')
                            ? device.batteryHealth
                            : 'N/A'}
                      </TableCell>
                      <TableCell>{device.estimatedBatteryLife}</TableCell>
                      <TableCell>{device.cpuEnergyConsumption}</TableCell>
                      <TableCell>{device.diskEnergyConsumption}</TableCell>
                      <TableCell>{device.displayEnergyConsumption}</TableCell>
                      <TableCell>{device.networkEnergyConsumption}</TableCell>
                      <TableCell>{device.totalEnergyConsumption}</TableCell>
                      <TableCell>{device.totalCO2Emitted.toFixed(6)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Showing {sortedData.length} of {data.length} devices</span>
            <span>{sortedData.filter(d => getDeviceStatus(d) === 'critical').length} critical alerts</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
