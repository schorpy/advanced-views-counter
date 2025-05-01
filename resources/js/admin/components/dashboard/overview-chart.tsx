"use client"

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line,
  LineChart
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import FetchWrapper from '@/hooks/FetchWrapper';


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-md px-3 py-2 text-sm text-gray-800">
        <p className="font-semibold">{label}</p>
        <p>Total: {payload[0].value} Leads</p>
      </div>
    );
  }

  return null;
};
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function OverviewChart({ dateFrom = '', dateTo = '' }) {
 
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const api = new FetchWrapper(advico_plugin.pluginApiUrl, advico_plugin.nonce);
      api.get(`/overview/chart`) 
          .then(data => {
            setChartData(data.data);
            setIsLoading(false);
        })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
    
      }, []);

  return (
    <>
 
    <ResponsiveContainer width="100%" height={350}>
    <ChartContainer config={chartConfig}>
    <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="views"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
          </ChartContainer>
    </ResponsiveContainer>
    </>
  )
}