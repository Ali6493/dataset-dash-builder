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

