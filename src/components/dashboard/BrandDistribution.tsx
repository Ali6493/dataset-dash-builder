import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from 'react-google-charts';
import { getManufacturerStats, DeviceData } from '@/data/laptopData';

interface BrandDistributionProps {
  data: DeviceData[];
}

export const BrandDistribution = ({ data }: BrandDistributionProps) => {
  const manufacturerStats = getManufacturerStats(data);

  const sankeyData = [
    ['Source', 'Target', 'Value'],
    ...manufacturerStats.map(stat => ['All Devices', stat.manufacturer, stat.count]),
  ];

  const options = {
    sankey: {
      node: {
        label: {
          fontSize: 14,
          color: '#ffffff'
        },
        nodePadding: 40
      },
      link: {
        colorMode: 'gradient',
        colors: ['#3b82f6', '#10b981', '#facc15', '#f87171', '#a78bfa'],
      }
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manufacturer Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '300px' }}>
          <Chart
            chartType="Sankey"
            width="100%"
            height="100%"
            data={sankeyData}
            options={options}
            loader={<div>Loading Chart...</div>}
          />
        </div>
      </CardContent>
    </Card>
  );
};
