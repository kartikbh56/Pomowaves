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
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  LabelList,
  CartesianGrid,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { formatMinutes, getMinutes } from "../../utils/formatDate";

const CustomTooltip = ({ active, payload, label }) => {
  const timeline = payload?.[0]?.payload?.timeline;
  if (!active || !payload || payload.length === 0) return null;

  const formattedDate = new Date(label).toLocaleDateString("en-US", {
    weekday: "short",
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
            className="flex basis-full items-center text-xs font-medium"
          >
            {t.task}
            <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
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

export default function MonthWiseBarChart({
  data,
  firstDayOfTheMonth,
  lastDayOfTheMonth,
}) {
  const buckets = new Map();

  for (const entry of data) {
    const dateKey = new Date(entry.startedAt).toDateString();
    if (!buckets.has(dateKey)) {
      buckets.set(dateKey, []);
    }
    buckets.get(dateKey).push(entry);
  }

  const monthStats = [];
  for (let i = 0; i < lastDayOfTheMonth.getDate(); i++) {
    const date = new Date(
      firstDayOfTheMonth.getFullYear(),
      firstDayOfTheMonth.getMonth(),
      firstDayOfTheMonth.getDate() + i,
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

    monthStats.push({
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

  const displayedData =
    monthStats.length > 0
      ? monthStats
      : [{ day: new Date(), minutes: 0, timeline: [] }];

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Monthly timeline</CardTitle>
        <CardDescription>Track how your focus changes monthly</CardDescription>
      </CardHeader>
      <div className="p-6 pt-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={displayedData}
            margin={{ left: 10, right: 10, top: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={true}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => new Date(value).getDate()}
            />
            <YAxis
              hide={true}
              axisLine={false}
              tickLine={false}
              domain={[
                0,
                Math.floor(Math.max(...monthStats.map((d) => d.minutes)) * 1.5),
              ]}
            />
            <RechartsTooltip content={<CustomTooltip />} cursor={false} />
            <Bar
              dataKey="minutes"
              fill="var(--color-minutes)"
              fillOpacity={0.8}

              radius={["4", "4", "0", "0"]}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-in-out"
            >
              <LabelList
                dataKey="minutes"
                position="top"
                style={{ fontSize: 10 }}
                content={(props) => {
                  const { value, x, y, textAnchor } = props;
                  if (!value) return null; // skip 0 or falsy values
                  return (
                    <text
                      x={x}
                      y={y}
                      dy={-5}
                      dx={1}
                      fontSize={10}
                      textAnchor={textAnchor}
                      fill="var(--muted-foreground)"
                    >
                      {value}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
