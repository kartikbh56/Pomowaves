/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  CalendarDays,
  Flame,
  Hourglass,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function StatCards({
  hoursFocused,
  daysAccessed,
  dayStreak,
  avgFocusTime,
  avgFocusTimeDescription,
  timelineTotal,
  timelineDescription,
}) {
  const metrics = [
    {
      title: "Total Hours Focused",
      value: hoursFocused,
      icon: Hourglass,
      footer: "Time you've actively focused using the app.",
    },
    {
      title: "Days Accessed",
      value: daysAccessed,
      icon: CalendarDays,
      footer: "Number of days you've opened and used the app.",
    },
    {
      title: "Days Streak",
      value: dayStreak,
      icon: Flame,
      footer: "Longest number of days used without a break.",
    },
    {
      title: "Avg Daily Focus",
      value: avgFocusTime,
      icon: TrendingUp,
      footer: avgFocusTimeDescription,
    },
    {
      title: "Total focus duration",
      value: timelineTotal,
      icon: Target,
      footer: timelineDescription,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="border-none py-4">
            <CardHeader className="px-5 space-y-1">
              <div className="flex items-center justify-between">
                <CardDescription>{metric.title}</CardDescription>
                <Icon className="text-muted-foreground size-7" />
              </div>
              <CardTitle className="text-3xl text-red-300 dark:text-red-200 font-bold tabular-nums sm:text-4xl">
                {metric.value}
              </CardTitle>
            </CardHeader>

            <CardFooter className="px-5 pb-4 text-sm text-muted-foreground">
              {metric.footer}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
