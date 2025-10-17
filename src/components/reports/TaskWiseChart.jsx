/* eslint-disable react/prop-types */
import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Label,
} from "recharts";
import { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { ChartContainer } from "@/components/ui/chart";
import { formatMinutes } from "../../utils/formatDate";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TaskTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  // For PieChart, label is not the task name, so extract from payload
  const pieLabel = payload[0]?.payload?.task;
  return (
    <div className="bg-black/80 dark:border-3 rounded-lg px-3 py-2 text-white shadow-md">
      <p className="font-semibold">{pieLabel || label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="mt-1 mb-1 text-[#f2938d] text-xs">
          {formatMinutes(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function TaskWiseChart({ data }) {
  const [chartType, setChartType] = useState("pie");
  const totalMinutes = data
    .map((data) => data.minutes)
    .reduce((acc, cur) => acc + cur, 0);
  console.log(data.map((data) => data.minutes));

  const chartConfig = {
    minutes: {
      label: "Minutes",
      color: "var(--chart-1)",
    },
  };

  const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const hasData = data && data.length > 0;

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Tasks distribution</CardDescription>
        </div>
        <Tabs value={chartType} onValueChange={setChartType}>
          <TabsList>
            <TabsTrigger value="pie">Pie</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <div className="p-6 pt-0 space-y-4">
        <ChartContainer config={chartConfig}>
          {hasData ? (
            chartType === "bar" ? (
              <BarChart accessibilityLayer data={data} barGap={0}>
                <XAxis dataKey="task" tickLine={false} tickMargin={10} />
                <YAxis
                  hide={true}
                  domain={[
                    0,
                    Math.floor(Math.max(...data.map((d) => d.minutes)) * 1.5),
                  ]}
                />
                <RechartsTooltip content={<TaskTooltip />} cursor={false} />
                <Bar
                  dataKey="minutes"
                  maxBarSize={150}
                  fill="var(--chart-1)"
                  fillOpacity={0.8}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={500}
                  animationEasing="ease-in-out"
                >
                  <LabelList
                    dataKey="minutes"
                    position="top"
                    offset={12}
                    className="fill-muted-foreground"
                    fontSize={12}
                    formatter={(value) => formatMinutes(value)}
                  />
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <RechartsTooltip content={<TaskTooltip />} cursor={false} />
                <Pie
                  data={data}
                  fillOpacity={0.8}
                  dataKey="minutes"
                  nameKey="task"
                  innerRadius={110}
                  strokeWidth={5}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {formatMinutes(totalMinutes)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total focus time
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            )
          ) : (
            <div className="flex h-80 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <p className="text-sm font-medium">No data available</p>
            </div>
          )}
        </ChartContainer>
      </div>
    </Card>
  );
}
