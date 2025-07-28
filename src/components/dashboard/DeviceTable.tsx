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
  TableRow 
} from '@/components/ui/table';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { DeviceData, getStatusColor, getDeviceStatus } from '@/data/laptopData';
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

  const filteredData = data.filter(device => 
    device.deviceManufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.deviceProductVersion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.cpuModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Device Inventory</CardTitle>
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="deviceManufacturer">Manufacturer</SortableHeader>
                <SortableHeader field="deviceProductVersion">Model</SortableHeader>
                <SortableHeader field="totalRam">RAM (GB)</SortableHeader>
                <SortableHeader field="batteryHealth">Battery Health</SortableHeader>
                <SortableHeader field="totalEnergyConsumption">Energy (Wh)</SortableHeader>
                <SortableHeader field="totalCO2Emitted">CO2 (kg)</SortableHeader>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((device) => {
                const status = getDeviceStatus(device);
                return (
                  <TableRow key={device.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{device.deviceManufacturer}</TableCell>
                    <TableCell>{device.deviceProductVersion}</TableCell>
                    <TableCell>{device.totalRam}</TableCell>
                    <TableCell>
                      <span className={cn(
                        'font-medium',
                        device.batteryHealth >= 80 ? 'text-success' :
                        device.batteryHealth >= 60 ? 'text-warning' : 'text-danger'
                      )}>
                        {device.batteryHealth.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'font-medium',
                        device.totalEnergyConsumption <= 20 ? 'text-success' :
                        device.totalEnergyConsumption <= 40 ? 'text-warning' : 'text-danger'
                      )}>
                            {typeof device.batteryHealth === 'number' 
                              ? device.batteryHealth.toFixed(2) + '%' 
                              : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'font-medium',
                        device.totalCO2Emitted <= 0.005 ? 'text-success' :
                        device.totalCO2Emitted <= 0.015 ? 'text-warning' : 'text-danger'
                      )}>
                        {device.totalCO2Emitted.toFixed(6)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(status)}>
                        {status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing {sortedData.length} of {data.length} devices
          </span>
          <span>
            {sortedData.filter(d => getDeviceStatus(d) === 'critical').length} critical alerts
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
