export interface LaptopData {
  id: string;
  brand: string;
  model: string;
  batteryHealth: number;
  cpuTemp: number;
  ramUsage: number;
  totalRam: number;
  storageUsed: number;
  totalStorage: number;
  cpuUsage: number;
  gpuTemp?: number;
  fanSpeed: number;
  price: number;
  purchaseDate: string;
  warrantyExpiry: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  lastMaintenance: string;
}

export const laptopData: LaptopData[] = [
  {
    id: "1",
    brand: "Dell",
    model: "XPS 13",
    batteryHealth: 92,
    cpuTemp: 68,
    ramUsage: 12,
    totalRam: 16,
    storageUsed: 256,
    totalStorage: 512,
    cpuUsage: 45,
    gpuTemp: 55,
    fanSpeed: 2800,
    price: 1299,
    purchaseDate: "2023-06-15",
    warrantyExpiry: "2026-06-15",
    status: "excellent",
    lastMaintenance: "2024-01-10"
  },
  {
    id: "2",
    brand: "Apple",
    model: "MacBook Pro M3",
    batteryHealth: 98,
    cpuTemp: 52,
    ramUsage: 18,
    totalRam: 32,
    storageUsed: 512,
    totalStorage: 1024,
    cpuUsage: 35,
    fanSpeed: 1200,
    price: 2499,
    purchaseDate: "2024-01-20",
    warrantyExpiry: "2027-01-20",
    status: "excellent",
    lastMaintenance: "2024-07-15"
  },
  {
    id: "3",
    brand: "Lenovo",
    model: "ThinkPad X1",
    batteryHealth: 76,
    cpuTemp: 72,
    ramUsage: 14,
    totalRam: 16,
    storageUsed: 180,
    totalStorage: 256,
    cpuUsage: 62,
    gpuTemp: 68,
    fanSpeed: 3200,
    price: 1599,
    purchaseDate: "2022-03-10",
    warrantyExpiry: "2025-03-10",
    status: "warning",
    lastMaintenance: "2023-11-22"
  },
  {
    id: "4",
    brand: "HP",
    model: "Spectre x360",
    batteryHealth: 84,
    cpuTemp: 61,
    ramUsage: 10,
    totalRam: 16,
    storageUsed: 320,
    totalStorage: 512,
    cpuUsage: 38,
    gpuTemp: 58,
    fanSpeed: 2400,
    price: 1399,
    purchaseDate: "2023-09-05",
    warrantyExpiry: "2026-09-05",
    status: "good",
    lastMaintenance: "2024-06-08"
  },
  {
    id: "5",
    brand: "ASUS",
    model: "ROG Zephyrus",
    batteryHealth: 88,
    cpuTemp: 78,
    ramUsage: 24,
    totalRam: 32,
    storageUsed: 800,
    totalStorage: 1024,
    cpuUsage: 55,
    gpuTemp: 82,
    fanSpeed: 4100,
    price: 2199,
    purchaseDate: "2023-11-12",
    warrantyExpiry: "2026-11-12",
    status: "good",
    lastMaintenance: "2024-05-20"
  },
  {
    id: "6",
    brand: "Microsoft",
    model: "Surface Laptop 5",
    batteryHealth: 67,
    cpuTemp: 75,
    ramUsage: 8,
    totalRam: 16,
    storageUsed: 200,
    totalStorage: 256,
    cpuUsage: 42,
    fanSpeed: 2900,
    price: 1199,
    purchaseDate: "2022-08-18",
    warrantyExpiry: "2025-08-18",
    status: "warning",
    lastMaintenance: "2023-12-05"
  },
  {
    id: "7",
    brand: "Acer",
    model: "Predator Helios",
    batteryHealth: 45,
    cpuTemp: 85,
    ramUsage: 28,
    totalRam: 32,
    storageUsed: 900,
    totalStorage: 1024,
    cpuUsage: 75,
    gpuTemp: 89,
    fanSpeed: 4800,
    price: 1899,
    purchaseDate: "2021-12-03",
    warrantyExpiry: "2024-12-03",
    status: "critical",
    lastMaintenance: "2023-08-14"
  },
  {
    id: "8",
    brand: "Samsung",
    model: "Galaxy Book3 Pro",
    batteryHealth: 91,
    cpuTemp: 58,
    ramUsage: 16,
    totalRam: 32,
    storageUsed: 400,
    totalStorage: 512,
    cpuUsage: 40,
    fanSpeed: 1800,
    price: 1799,
    purchaseDate: "2023-04-25",
    warrantyExpiry: "2026-04-25",
    status: "excellent",
    lastMaintenance: "2024-02-18"
  }
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-success';
    case 'good': return 'text-primary';
    case 'warning': return 'text-warning';
    case 'critical': return 'text-danger';
    default: return 'text-muted-foreground';
  }
};

export const getBrandStats = () => {
  const brandCount = laptopData.reduce((acc, laptop) => {
    acc[laptop.brand] = (acc[laptop.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(brandCount).map(([brand, count]) => ({
    brand,
    count,
    percentage: Math.round((count / laptopData.length) * 100)
  }));
};

export const getPerformanceMetrics = () => {
  const totalLaptops = laptopData.length;
  const avgBatteryHealth = Math.round(
    laptopData.reduce((sum, laptop) => sum + laptop.batteryHealth, 0) / totalLaptops
  );
  const avgCpuTemp = Math.round(
    laptopData.reduce((sum, laptop) => sum + laptop.cpuTemp, 0) / totalLaptops
  );
  const criticalCount = laptopData.filter(laptop => laptop.status === 'critical').length;
  const excellentCount = laptopData.filter(laptop => laptop.status === 'excellent').length;

  return {
    totalLaptops,
    avgBatteryHealth,
    avgCpuTemp,
    criticalCount,
    excellentCount,
    healthyPercentage: Math.round(((excellentCount + laptopData.filter(l => l.status === 'good').length) / totalLaptops) * 100)
  };
};