import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Chart } from "react-google-charts";
import { getManufacturerStats } from '@/data/laptopData';

interface BrandDistributionProps {
  data: DeviceData[];
}

export const BrandDistribution = ({ data }: BrandDistributionProps) => {
  const stats = getManufacturerStats(data);

  const sankeyData = [
    ["From", "To", "Count"],
    ...stats.map((entry) => ["All Devices", entry.manufacturer, entry.count < 10 ? 10 : entry.count
])
  ];

const options = {
  tooltip: {
    isHtml: true,
    trigger: 'focus'
  },
  sankey: {
    node: {
      label: { fontSize: 14, bold: true, color: "#333" },
      width: 20,
      nodePadding: 20
    },
    link: {
      colorMode: "gradient",
      colors: ["#6366f1", "#3b82f6", "#06b6d4"]
    }
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manufacturer Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart
          chartType="Sankey"
          width="100%"
          height="400px"
          data={sankeyData}
          options={options}
        />
      </CardContent>
    </Card>
  );
};
