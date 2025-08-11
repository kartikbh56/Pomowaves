/* eslint-disable react/prop-types */
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatMinutes } from "../../utils/formatDate";

const chartConfig = {
  minutes: {
    label: "Minutes focused",
    color: "var(--chart-1)",
  },
};

export default function DayWiseAreaChart({ data }) {
  const chartData = prepareProductivityData(data);
  console.log(chartData)
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Daily Timeline</CardTitle>
        <CardDescription>
          Track how your focus changes hour by hour
        </CardDescription>
      </CardHeader>
      <div className="p-6 pt-0">
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="hour"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              hide={true}
              axisLine={false}
              tickMargin={5}
              domain={[
                0,
                Math.floor(Math.max(...chartData.map((d) => d.minutes)) * 2),
              ]}
            />

            <ChartTooltip
              cursor={false}
              content={<ProductivityTooltip data={data} />}
            />

            <defs>
              <linearGradient id="fillMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-minutes)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-minutes)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <Area
              dataKey="minutes"
              type="bump"
              fill="url(#fillMinutes)"
              stroke="var(--color-minutes)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </Card>
  );
}

// Helper: format time to hh:mm AM/PM
function formatTime(dateStr) {
  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Aggregate minutes per hour + keep hour index
function prepareProductivityData(rawData) {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    hourIndex: i,
    hour: `${i % 12 || 12} ${i < 12 ? "AM" : "PM"}`,
    minutes: 0,
    date: rawData.length ? rawData[0].startedAt : null,
  }));

  rawData.forEach(({ startedAt, endedAt }) => {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    let current = new Date(start);

    while (current < end) {
      const hourIndex = current.getHours();
      const nextHour = new Date(current);
      nextHour.setHours(hourIndex + 1, 0, 0, 0);

      const segmentEnd = end < nextHour ? end : nextHour;
      const diffMinutes = (segmentEnd - current) / (1000 * 60);

      hours[hourIndex].minutes += diffMinutes;
      current = segmentEnd;
    }
  });

  const firstActive = hours.findIndex((h) => h.minutes > 0);
  const lastActive = hours.map((h) => h.minutes > 0).lastIndexOf(true);

  // ✅ If no activity, return placeholder range (e.g., 8 AM – 6 PM)
  if (firstActive === -1) {
    return hours.slice(8, 18); // placeholder hours
  }

  return hours.slice(firstActive, lastActive + 1);
}

// Custom tooltip
function ProductivityTooltip({ data, active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  const hourIndex = payload[0].payload.hourIndex;
  const sessionsInHour = data.filter((s) => {
    const startHour = new Date(s.startedAt).getHours();
    const endHour = new Date(s.endedAt).getHours();
    return hourIndex >= startHour && hourIndex <= endHour;
  });

  return (
    <div className="bg-black/80 dark:border-3 rounded-lg px-3 py-2 text-white shadow-md">
      <p className="text-sm">{label}</p>
      {sessionsInHour.length > 0 ? (
        <ul className="mt-1 space-y-1">
          {sessionsInHour.map((s, i) => {
            const totalMinutes =
              (new Date(s.endedAt) - new Date(s.startedAt)) / (1000 * 60);
            return (
              <li key={i} className="text-xs text-gray-300 list-none">
                <div className="flex items-center">
                  <span className="text-white font-medium">{s.task}</span>
                  <span className="ml-1 text-[#f2938d]">
                    {formatMinutes(totalMinutes)}
                  </span>
                </div>
                <div className="text-[11px] opacity-80">
                  {formatTime(s.startedAt)} - {formatTime(s.endedAt)}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-gray-300 opacity-70 mt-1">No tasks</p>
      )}
    </div>
  );
}
