"use client"

import { useEffect, useState } from "react";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis,ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import FetchWrapper from '@/hooks/FetchWrapper';

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export function OverviewPost({ dateFrom = '', dateTo = '' }) {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const api = new FetchWrapper(advico_plugin.pluginApiUrl, advico_plugin.nonce);
  api.get(`/overview/posts`) 
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
    <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="views" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="views"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="title"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="views"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
          </ChartContainer>
    </ResponsiveContainer>
    </>
  )
}