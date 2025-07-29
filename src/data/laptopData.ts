import * as XLSX from 'xlsx';
import rawData from '../data/Laptop Consumption.xlsx?url';

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

export const loadDeviceData = async (): Promise<DeviceData[]> => {
  const response = await fetch(rawData);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

  // Convert Excel data to DeviceData objects
  return jsonData.map((item, index) => ({
    id: item.id || `generated-id-${index}`,
    deviceManufacturer: item.deviceManufacturer,
    deviceProductVersion: item.deviceProductVersion,
    cpuModel: item.cpuModel,
    totalRam: Number(item.totalRam),
    graphicalCards: item.graphicalCards,
    numberOfGraphicalCards: Number(item.numberOfGraphicalCards),
    graphicalCardRam: Number(item.graphicalCardRam),
    batteryDesignedCapacity: Number(item.batteryDesignedCapacity),
    batteryFullChargeCapacity: Number(item.batteryFullChargeCapacity),
    batteryHealth: Number(item.batteryHealth),
    estimatedBatteryLife: Number(item.estimatedBatteryLife),
    cpuEnergyConsumption: Number(item.cpuEnergyConsumption),
    diskEnergyConsumption: Number(item.diskEnergyConsumption),
    displayEnergyConsumption: Number(item.displayEnergyConsumption),
    networkEnergyConsumption: Number(item.networkEnergyConsumption),
    totalCO2Emitted: Number(item.totalCO2Emitted),
    totalEnergyConsumption: Number(item.totalEnergyConsumption),
    acAdapterWatt: Number(item.acAdapterWatt),
    status: getDeviceStatus(item as DeviceData),
  }));
};
export const getManufacturerStats = (data: DeviceData[]) => {
  if (!data || data.length === 0) return [];

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
export const getDeviceStatus = (device: DeviceData): 'excellent' | 'good' | 'warning' | 'critical' => {
  if (device.batteryHealth >= 90 && device.totalEnergyConsumption <= 20) return 'excellent';
  if (device.batteryHealth >= 70 && device.totalEnergyConsumption <= 40) return 'good';
  if (device.batteryHealth >= 50 && device.totalEnergyConsumption <= 60) return 'warning';
  return 'critical';
};
export const getPerformanceMetrics = (data: DeviceData[]) => {
  if (!data || data.length === 0) return {
    totalDevices: 0,
    avgBatteryHealth: 0,
    avgCO2Emission: 0,
    avgEnergyConsumption: 0,
    criticalCount: 0,
    excellentCount: 0,
    healthyPercentage: 0
  };

  const totalDevices = data.length;
  const avgBatteryHealth = Math.round(
    data.reduce((sum, device) => sum + (device?.batteryHealth || 0), 0) / totalDevices
  );
  const avgCO2Emission = Number(
    (data.reduce((sum, device) => sum + (device?.totalCO2Emitted || 0), 0) / totalDevices).toFixed(6)
  );
  const avgEnergyConsumption = Number(
    (data.reduce((sum, device) => sum + (device?.totalEnergyConsumption || 0), 0) / totalDevices).toFixed(2)
  );

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

