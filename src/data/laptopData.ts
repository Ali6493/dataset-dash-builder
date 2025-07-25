export interface LaptopData {
  id: string;
  brand: string;
  model: string;
  cpuModel: string;
  cpuTemp: number;
  batteryHealth: number;
  ramUsage: number;
  totalRam: number;
  ssdHealth: number;
  gpuModel: string;
  fanSpeed: number;
  os: string;
  uptime: number;
  screenBrightness: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export const laptopData: LaptopData[] = [
  {
    id: "1",
    brand: "Dell",
    model: "XPS 13",
    cpuModel: "Intel i7-1165G7",
    cpuTemp: 52,
    batteryHealth: 91,
    ramUsage: 7.2,
    totalRam: 16,
    ssdHealth: 95,
    gpuModel: "Intel Iris Xe",
    fanSpeed: 3200,
    os: "Windows 11",
    uptime: 4.2,
    screenBrightness: 70,
    status: "excellent"
  },
  {
    id: "2",
    brand: "HP",
    model: "Spectre x360",
    cpuModel: "Intel i5-1235U",
    cpuTemp: 61,
    batteryHealth: 87,
    ramUsage: 5.8,
    totalRam: 8,
    ssdHealth: 89,
    gpuModel: "Intel Iris Xe",
    fanSpeed: 2900,
    os: "Windows 11",
    uptime: 3.5,
    screenBrightness: 80,
    status: "good"
  },
  {
    id: "3",
    brand: "Lenovo",
    model: "ThinkPad X1",
    cpuModel: "Intel i7-1260P",
    cpuTemp: 47,
    batteryHealth: 96,
    ramUsage: 10.5,
    totalRam: 16,
    ssdHealth: 98,
    gpuModel: "Intel Iris Xe",
    fanSpeed: 3100,
    os: "Windows 10",
    uptime: 7.8,
    screenBrightness: 60,
    status: "excellent"
  },
  {
    id: "4",
    brand: "ASUS",
    model: "ROG Zephyrus",
    cpuModel: "AMD Ryzen 9 6900HS",
    cpuTemp: 72,
    batteryHealth: 78,
    ramUsage: 15.3,
    totalRam: 32,
    ssdHealth: 93,
    gpuModel: "NVIDIA RTX 3060",
    fanSpeed: 4800,
    os: "Windows 11",
    uptime: 1.2,
    screenBrightness: 100,
    status: "warning"
  },
  {
    id: "5",
    brand: "Apple",
    model: "MacBook Air M2",
    cpuModel: "Apple M2",
    cpuTemp: 44,
    batteryHealth: 99,
    ramUsage: 5.1,
    totalRam: 8,
    ssdHealth: 100,
    gpuModel: "Integrated M2 GPU",
    fanSpeed: 2200,
    os: "macOS 14",
    uptime: 10,
    screenBrightness: 65,
    status: "excellent"
  },
  {
    id: "6",
    brand: "Acer",
    model: "Swift 3",
    cpuModel: "Intel i5-1135G7",
    cpuTemp: 58,
    batteryHealth: 85,
    ramUsage: 6.7,
    totalRam: 8,
    ssdHealth: 91,
    gpuModel: "Intel Iris Xe",
    fanSpeed: 2500,
    os: "Windows 11",
    uptime: 5,
    screenBrightness: 75,
    status: "good"
  },
  {
    id: "7",
    brand: "Razer",
    model: "Blade 15",
    cpuModel: "Intel i7-12700H",
    cpuTemp: 68,
    batteryHealth: 82,
    ramUsage: 19.6,
    totalRam: 32,
    ssdHealth: 89,
    gpuModel: "NVIDIA RTX 3070 Ti",
    fanSpeed: 5200,
    os: "Windows 11",
    uptime: 2.5,
    screenBrightness: 90,
    status: "good"
  },
  {
    id: "8",
    brand: "MSI",
    model: "Creator Z16",
    cpuModel: "Intel i9-12900H",
    cpuTemp: 74,
    batteryHealth: 76,
    ramUsage: 25,
    totalRam: 32,
    ssdHealth: 87,
    gpuModel: "NVIDIA RTX 3060",
    fanSpeed: 5500,
    os: "Windows 11",
    uptime: 1,
    screenBrightness: 85,
    status: "warning"
  },
  {
    id: "9",
    brand: "Microsoft",
    model: "Surface Laptop",
    cpuModel: "Intel i5-1145G7",
    cpuTemp: 51,
    batteryHealth: 93,
    ramUsage: 4.3,
    totalRam: 8,
    ssdHealth: 97,
    gpuModel: "Intel Iris Xe",
    fanSpeed: 2600,
    os: "Windows 11",
    uptime: 6.4,
    screenBrightness: 68,
    status: "excellent"
  },
  {
    id: "10",
    brand: "LG",
    model: "Gram 17",
    cpuModel: "Intel i7-1165G7",
    cpuTemp: 46,
    batteryHealth: 92,
    ramUsage: 6.2,
    totalRam: 16,
    ssdHealth: 94,
    gpuModel: "Intel Iris Xe",
    fanSpeed: 2800,
    os: "Windows 11",
    uptime: 8.6,
    screenBrightness: 72,
    status: "excellent"
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