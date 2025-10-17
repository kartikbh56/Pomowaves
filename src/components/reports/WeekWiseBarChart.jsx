/* eslint-disable react/prop-types */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"; // using ChartTooltip but with custom content
import { formatMinutes } from "../../utils/formatDate";

// Utility: Get minutes difference
function getMinutes(startedAt, endedAt) {
  return Math.floor(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / (1000 * 60)
  );
}

// Custom tooltip integrated into the recharts ChartTooltip
const CustomTooltip = ({ active, payload, label }) => {
  const timeline = payload?.[0]?.payload?.timeline;
  if (!active || !payload || payload.length === 0) return null;

  const formattedDate = new Date(label).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-black/80 dark:border-3 rounded-lg px-3 py-2 text-white shadow-md">
      <p className="mb-1 pb-1 text-xs font-bold border-b-1">{formattedDate}</p>

      <ul className="mt-1 space-y-1">
        {timeline?.map((t) => (
          <div
            key={crypto.randomUUID()}
            className="flex basis-full items-center gap-2 text-xs font-medium"
          >
            <div className="min-w-0 flex-1 truncate">{t.task}</div>

            <div className="text-foreground flex items-baseline gap-0.5 font-mono font-medium tabular-nums shrink-0">
              {formatMinutes(t.minutes)}
            </div>
          </div>
        ))}
      </ul>
      {payload.map((entry, index) => (
        <div
          key={index}
          className="text-[#f2938d] mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium"
        >
          Total
          <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
            {formatMinutes(entry.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function WeekWiseBarChart({ data, firstDayOfTheWeek }) {
  // Transform data into weekStats
  const buckets = new Map();

  // Bucket data by date string (one pass)
  for (const entry of data) {
    const dateKey = new Date(entry.startedAt).toDateString();
    if (!buckets.has(dateKey)) buckets.set(dateKey, []);
    buckets.get(dateKey).push(entry);
  }

  const weekStats = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      firstDayOfTheWeek.getFullYear(),
      firstDayOfTheWeek.getMonth(),
      firstDayOfTheWeek.getDate() + i
    );
    const dateKey = date.toDateString();
    const entries = buckets.get(dateKey) || [];

    const timeline = [];
    let totalMinutes = 0;

    for (const cur of entries) {
      const mins = getMinutes(cur.startedAt, cur.endedAt);
      totalMinutes += mins;

      const idx = timeline.findIndex((t) => t.task === cur.task);
      if (idx !== -1) {
        timeline[idx].minutes += mins;
      } else {
        timeline.push({ task: cur.task, minutes: mins });
      }
    }

    weekStats.push({
      day: date,
      minutes: totalMinutes,
      timeline,
    });
  }

  const chartConfig = {
    minutes: {
      label: "Minutes",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Weekly timeline</CardTitle>
        <CardDescription>Track how your focus changes weekly</CardDescription>
      </CardHeader>
      <div className="p-6 pt-0">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={weekStats}>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={true}
              tickMargin={10}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }
            />
            <YAxis
              hide={true}
              domain={[
                0,
                Math.floor(Math.max(...weekStats.map((d) => d.minutes)) * 1.5),
              ]}
            />
            <ChartTooltip content={<CustomTooltip />} cursor={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="minutes"
              fill="var(--color-minutes)"
              fillOpacity={0.8}
              radius={["8", "8", "0", "0"]}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-in-out"
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-muted-foreground"
                fontSize={12}
                formatter={(value) => formatMinutes(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
