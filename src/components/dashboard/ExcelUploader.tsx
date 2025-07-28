import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DeviceData } from '@/data/laptopData';
import { useToast } from '@/hooks/use-toast';

interface ExcelUploaderProps {
  onDataLoaded: (data: DeviceData[]) => void;
  isLoading: boolean;
}

export const ExcelUploader = ({ onDataLoaded, isLoading }: ExcelUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to our DeviceData interface
        const deviceData: DeviceData[] = jsonData.map((row: any, index) => ({
          id: String(index + 1),
          deviceManufacturer: row['Device manufacturer'] || '',
          deviceProductVersion: row['Device product version'] || '',
          cpuModel: row['CPU model'] || '',
          totalRam: Number(row['Total RAM [GB]']) || 0,
          graphicalCards: row['Graphical cards'] || '',
          numberOfGraphicalCards: Number(row['Number of graphical cards']) || 0,
          graphicalCardRam: Number(row['Graphical card RAM [GB]']) || 0,
          batteryDesignedCapacity: Number(row['Battery Designed Capacity (mAh  )']) || 0,
          batteryFullChargeCapacity: Number(row['Battery Full Charge Capacity (mAh  )']) || 0,
          batteryHealth: Number(row['Battery Health (Get Battery Status) [%]']) || 0,
          estimatedBatteryLife: Number(row['Estimated Battery Life (Hours)']) || 0,
          cpuEnergyConsumption: Number(row['CPU Energy Consumption (Watt Hours)']) || 0,
          diskEnergyConsumption: Number(row['Disk Energy Consumption (Watt Hours)']) || 0,
          displayEnergyConsumption: Number(row['Display Energy Consumption (Watt Hours)']) || 0,
          networkEnergyConsumption: Number(row['Network Energy Consumption (Watt Hours)']) || 0,
          totalCO2Emitted: Number(row['Total CO2 Emitted (CO2KG)']) || 0,
          totalEnergyConsumption: Number(row['Total Energy Consumption (Watt Hours)']) || 0,
          acAdapterWatt: Number(row['AC Adapter Watt']) || 0,
          status: 'good' // Will be calculated dynamically
        }));

        onDataLoaded(deviceData);
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${deviceData.length} device records`,
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          title: "Error parsing file",
          description: "Please make sure the Excel file has the correct format",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    processExcelFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Upload Excel File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            Drag and drop your Excel file here
          </p>
          <p className="text-muted-foreground mb-4">
            Or click to browse and select your file
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? 'Processing...' : 'Browse Files'}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Expected Excel columns:</p>
          <p className="text-xs mt-1">
            Device manufacturer, Device product version, CPU model, Total RAM [GB], 
            Battery Health [%], Energy Consumption, CO2 Emission, etc.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};