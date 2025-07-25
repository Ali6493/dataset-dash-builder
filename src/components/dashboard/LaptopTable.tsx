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
import { laptopData, getStatusColor, LaptopData } from '@/data/laptopData';
import { cn } from '@/lib/utils';

type SortField = keyof LaptopData;
type SortDirection = 'asc' | 'desc';

export const LaptopTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('brand');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const filteredData = laptopData.filter(laptop => 
    laptop.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laptop.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    laptop.status.toLowerCase().includes(searchTerm.toLowerCase())
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
          <CardTitle>Laptop Inventory</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search laptops..."
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
                <SortableHeader field="brand">Brand</SortableHeader>
                <SortableHeader field="model">Model</SortableHeader>
                <SortableHeader field="batteryHealth">Battery</SortableHeader>
                <SortableHeader field="cpuTemp">CPU Temp</SortableHeader>
                <SortableHeader field="ramUsage">RAM Usage</SortableHeader>
                <SortableHeader field="status">Status</SortableHeader>
                <SortableHeader field="price">Price</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((laptop) => (
                <TableRow key={laptop.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{laptop.brand}</TableCell>
                  <TableCell>{laptop.model}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'font-medium',
                        laptop.batteryHealth >= 80 ? 'text-success' :
                        laptop.batteryHealth >= 60 ? 'text-warning' : 'text-danger'
                      )}>
                        {laptop.batteryHealth}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'font-medium',
                      laptop.cpuTemp <= 60 ? 'text-success' :
                      laptop.cpuTemp <= 75 ? 'text-warning' : 'text-danger'
                    )}>
                      {laptop.cpuTemp}°C
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {laptop.ramUsage}GB / {laptop.totalRam}GB
                    </span>
                    <div className="text-xs text-muted-foreground">
                      ({Math.round((laptop.ramUsage / laptop.totalRam) * 100)}%)
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(laptop.status)}>
                      {laptop.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${laptop.price.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>
            Showing {sortedData.length} of {laptopData.length} laptops
          </span>
          <span>
            {filteredData.filter(l => l.status === 'critical').length} critical alerts
          </span>
        </div>
      </CardContent>
    </Card>
  );
};