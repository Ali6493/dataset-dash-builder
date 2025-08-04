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

// Fix column header mapping to your fields
const normalize = (item: any) => ({
  deviceManufacturer: item['Device manufacturer'] ?? '',
  deviceProductVersion: item['Device product version'] ?? '',
  cpuModel: item['CPU model'] ?? '',
  totalRam: Number(item['Total RAM [GB]'] ?? 0),
  graphicalCards: item['Graphical cards'] ?? '',
  numberOfGraphicalCards: Number(item['Number of graphical cards'] ?? 0),
  graphicalCardRam: Number(item['Graphical card RAM [GB]'] ?? 0),
  batteryDesignedCapacity: Number(item['Battery Designed Capacity (mAh  )'] ?? 0),
  batteryFullChargeCapacity: Number(item['Battery Full Charge Capacity (mAh  )'] ?? 0),
  batteryHealth: Number(item['Battery Health (Get Battery Status) [%]'] ?? 0),
  estimatedBatteryLife: Number(item['Estimated Battery Life (Hours)'] ?? 0),
  cpuEnergyConsumption: Number(item['CPU Energy Consumption (Watt Hours)'] ?? 0),
  diskEnergyConsumption: Number(item['Disk Energy Consumption (Watt Hours)'] ?? 0),
  displayEnergyConsumption: Number(item['Display Energy Consumption (Watt Hours)'] ?? 0),
  networkEnergyConsumption: Number(item['Network Energy Consumption (Watt Hours)'] ?? 0),
  totalCO2Emitted: Number(item['Total CO2 Emitted (CO2KG)'] ?? 0),
  totalEnergyConsumption: Number(item['Total Energy Consumption (Watt Hours)'] ?? 0),
  acAdapterWatt: Number(item['AC Adapter Watt'] ?? 0),
});

export const loadDeviceData = async (): Promise<DeviceData[]> => {
  const response = await fetch(rawData);
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

  return jsonData.map((item, index) => {
    const normalized = normalize(item);
    return {
      id: `generated-id-${index}`,
      ...normalized,
      status: getDeviceStatus(normalized as DeviceData),
    };
  });
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

export const getDeviceStatus = (
  device: DeviceData
): 'excellent' | 'good' | 'warning' | 'critical' => {
  let tier: 'high' | 'mid' | 'low';

  if (device.ram >= 64) {
    tier = 'high';
  } else if (device.ram >= 32) {
    tier = 'mid';
  } else {
    tier = 'low';
  }

  switch (tier) {
    case 'high':
      if (device.batteryHealth >= 90 && device.totalEnergyConsumption <= 30) return 'excellent';
      if (device.batteryHealth >= 75 && device.totalEnergyConsumption <= 49.5) return 'good';
      if (device.batteryHealth >= 60 && device.totalEnergyConsumption <= 53) return 'warning';
      return 'critical';

    case 'mid':
      if (device.batteryHealth >= 85 && device.totalEnergyConsumption <= 25) return 'excellent';
      if (device.batteryHealth >= 70 && device.totalEnergyConsumption <= 45) return 'good';
      if (device.batteryHealth >= 55 && device.totalEnergyConsumption <= 49.5) return 'warning';
      return 'critical';

    case 'low':
      if (device.batteryHealth >= 80 && device.totalEnergyConsumption <= 20) return 'excellent';
      if (device.batteryHealth >= 65 && device.totalEnergyConsumption <= 40) return 'good';
      if (device.batteryHealth >= 50 && device.totalEnergyConsumption <= 45.67) return 'warning';
      return 'critical';
  }
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
