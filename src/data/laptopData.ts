export interface DeviceData {
  id: string;
  deviceManufacturer: string;
  deviceProductVersion: string;
  cpuModel: string;
  totalRam: number;
  graphicalCards: string;
  numberOfGraphicalCards: number;
  graphicalCardRam: number;
  batteryDesignedCapacity: number;
  batteryFullChargeCapacity: number;
  batteryHealth: number;
  estimatedBatteryLife: number;
  cpuEnergyConsumption: number;
  diskEnergyConsumption: number;
  displayEnergyConsumption: number;
  networkEnergyConsumption: number;
  totalCO2Emitted: number;
  totalEnergyConsumption: number;
  acAdapterWatt: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

// Sample data based on your provided dataset
export const sampleDeviceData: DeviceData[] = [
  {
    id: "1",
    deviceManufacturer: "Lenovo",
    deviceProductVersion: "ThinkPad E15",
    cpuModel: "Intel Core i7-10510U CPU @ 1.80GHz",
    totalRam: 8,
    graphicalCards: "AMD Radeon RX 640 (2GB), Intel UHD Graphics (1GB)",
    numberOfGraphicalCards: 2,
    graphicalCardRam: 2,
    batteryDesignedCapacity: 45730,
    batteryFullChargeCapacity: 39220,
    batteryHealth: 85.764,
    estimatedBatteryLife: 5.084444444,
    cpuEnergyConsumption: 18.0714,
    diskEnergyConsumption: 3.41363,
    displayEnergyConsumption: 6.70163,
    networkEnergyConsumption: 1.02949,
    totalCO2Emitted: 0.0120892,
    totalEnergyConsumption: 36.6339,
    acAdapterWatt: 0,
    status: "good"
  },
  {
    id: "2",
    deviceManufacturer: "Lenovo",
    deviceProductVersion: "ThinkPad T14s Gen 2i",
    cpuModel: "11th Gen Intel Core i7-1165G7 @ 2.80GHz",
    totalRam: 16,
    graphicalCards: "Intel Xe Graphics (128MB)",
    numberOfGraphicalCards: 1,
    graphicalCardRam: 0.125,
    batteryDesignedCapacity: 57000,
    batteryFullChargeCapacity: 56970,
    batteryHealth: 99.947,
    estimatedBatteryLife: 6.983055556,
    cpuEnergyConsumption: 0.355766,
    diskEnergyConsumption: 0.0934945,
    displayEnergyConsumption: 2.33075,
    networkEnergyConsumption: 0,
    totalCO2Emitted: 0.00234404,
    totalEnergyConsumption: 7.10314,
    acAdapterWatt: 0,
    status: "excellent"
  },
  {
    id: "3",
    deviceManufacturer: "Lenovo",
    deviceProductVersion: "ThinkPad X1 Carbon 3rd",
    cpuModel: "Intel Core i7-5500U CPU @ 2.40GHz",
    totalRam: 8,
    graphicalCards: "Intel HD Graphics 5500 (1GB)",
    numberOfGraphicalCards: 1,
    graphicalCardRam: 1,
    batteryDesignedCapacity: 50080,
    batteryFullChargeCapacity: 35680,
    batteryHealth: 71.246,
    estimatedBatteryLife: 5.574444444,
    cpuEnergyConsumption: 12.9833,
    diskEnergyConsumption: 0.56493,
    displayEnergyConsumption: 6.35517,
    networkEnergyConsumption: 0.166254,
    totalCO2Emitted: 0.0066389,
    totalEnergyConsumption: 20.1179,
    acAdapterWatt: 0,
    status: "warning"
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

export const getDeviceStatus = (device: DeviceData): 'excellent' | 'good' | 'warning' | 'critical' => {
  if (device.batteryHealth >= 90 && device.totalEnergyConsumption <= 20) return 'excellent';
  if (device.batteryHealth >= 70 && device.totalEnergyConsumption <= 40) return 'good';
  if (device.batteryHealth >= 50 && device.totalEnergyConsumption <= 60) return 'warning';
  return 'critical';
};

export const getManufacturerStats = (data: DeviceData[]) => {
  const manufacturerCount = data.reduce((acc, device) => {
    acc[device.deviceManufacturer] = (acc[device.deviceManufacturer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(manufacturerCount).map(([manufacturer, count]) => ({
    manufacturer,
    count,
    percentage: Math.round((count / data.length) * 100)
  }));
};

export const getPerformanceMetrics = (data: DeviceData[]) => {
  const totalDevices = data.length;
  if (totalDevices === 0) return {
    totalDevices: 0,
    avgBatteryHealth: 0,
    avgCO2Emission: 0,
    avgEnergyConsumption: 0,
    criticalCount: 0,
    excellentCount: 0,
    healthyPercentage: 0
  };

  const avgBatteryHealth = Math.round(
    data.reduce((sum, device) => sum + device.batteryHealth, 0) / totalDevices
  );
  const avgCO2Emission = Number(
    (data.reduce((sum, device) => sum + device.totalCO2Emitted, 0) / totalDevices).toFixed(6)
  );
  const avgEnergyConsumption = Number(
    (data.reduce((sum, device) => sum + device.totalEnergyConsumption, 0) / totalDevices).toFixed(2)
  );
  
  // Calculate status for each device
  const devicesWithStatus = data.map(device => ({
    ...device,
    status: getDeviceStatus(device)
  }));
  
  const criticalCount = devicesWithStatus.filter(device => device.status === 'critical').length;
  const excellentCount = devicesWithStatus.filter(device => device.status === 'excellent').length;
  const goodCount = devicesWithStatus.filter(device => device.status === 'good').length;

  return {
    totalDevices,
    avgBatteryHealth,
    avgCO2Emission,
    avgEnergyConsumption,
    criticalCount,
    excellentCount,
    healthyPercentage: Math.round(((excellentCount + goodCount) / totalDevices) * 100)
  };
};