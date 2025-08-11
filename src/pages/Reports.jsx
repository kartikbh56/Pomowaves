/* eslint-disable react-hooks/exhaustive-deps */

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import StatCards from "../components/reports/StatCards";
import { useReportsStore } from "../store/useReportsStore";
import { fetchTimelineOnDate } from "../backend/db";
import DayWiseAreaChart from "../components/reports/DayWiseAreaChart";
import WeekWiseBarChart from "../components/reports/WeekWiseBarChart";
import MonthWiseBarChart from "../components/reports/MonthWiseBarChart";
import { formatMinutes, getMinutes, getTimeStamps } from "../utils/formatDate";
import TaskWiseChart from "../components/reports/TaskWiseChart";
import TimelineSelector from "../components/reports/TimelineSelector";

export default function Reports() {
  const [view, setView] = useState("day");
  const [date, setDate] = useState(new Date());
  const minutesFocused = useReportsStore((state) => state.minutesFocused);
  const daysAccessed = useReportsStore((state) => state.daysAccessed);
  const dayStreak = useReportsStore((state) => state.dayStreak);
  const hoursFocused = minutesFocused > 0 ? Math.round(minutesFocused / 60) : 0;

  const timeStamps = useMemo(() => getTimeStamps(view, date), [view, date]);

  const { data = [] } = useQuery({
    queryKey: [
      "timeline",
      view,
      timeStamps.start.toISOString(),
      timeStamps.end.toISOString(),
    ],
    queryFn: () => fetchTimelineOnDate(timeStamps.start, timeStamps.end),
    placeholderData: (prev) => prev, // keep cache between view switches
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  let avgFocusTime = { description: "", value: 0 };
  let totalFocusTime = { description: "", value: 0 };

  // --- Group by task ---
  const taskWiseData = data.reduce((resultArr, currentData) => {
    const existingIndex = resultArr.findIndex(
      (d) => d.task === currentData.task
    );
    if (existingIndex !== -1) {
      resultArr[existingIndex].minutes += getMinutes(
        currentData.startedAt,
        currentData.endedAt
      );
    } else {
      resultArr.push({
        task: currentData.task,
        minutes: getMinutes(currentData.startedAt, currentData.endedAt),
      });
    }
    return resultArr;
  }, []);
  taskWiseData.sort((a, b) => b.minutes - a.minutes);

  const totalFocusMinutes = taskWiseData.reduce(
    (acc, cur) => acc + cur.minutes,
    0
  );

  // Compute average focus time
  if (view === "day") {
    avgFocusTime.description =
      "Average daily focus hours across all sessions so far";
    avgFocusTime.value = formatMinutes(
      Math.round(minutesFocused / daysAccessed)
    );
    totalFocusTime.description = "Total hours focused on this day";
    totalFocusTime.value = formatMinutes(totalFocusMinutes);
  } else if (view === "week") {
    const now = new Date();
    const isCurrentWeek = timeStamps.start <= now && timeStamps.end >= now;

    const daysInWeekSoFar =
      Math.floor((now - timeStamps.start) / (1000 * 60 * 60 * 24)) + 1;
    const divisor = isCurrentWeek ? daysInWeekSoFar : 7;

    avgFocusTime.description = "Average daily focus time in this week";
    avgFocusTime.value = formatMinutes(Math.round(totalFocusMinutes / divisor));
    totalFocusTime.description = "Total hours focused in this week";
    totalFocusTime.value = formatMinutes(totalFocusMinutes);
  } else {
    const now = new Date();
    const isCurrentMonth = timeStamps.start <= now && timeStamps.end >= now;

    const daysInMonthSoFar =
      Math.floor((now - timeStamps.start) / (1000 * 60 * 60 * 24)) + 1;
    const totalDaysInMonth =
      Math.floor((timeStamps.end - timeStamps.start) / (1000 * 60 * 60 * 24)) +
      1;

    const divisor = isCurrentMonth ? daysInMonthSoFar : totalDaysInMonth;

    avgFocusTime.description = "Average daily focus time in this month";
    avgFocusTime.value = formatMinutes(Math.round(totalFocusMinutes / divisor));
    totalFocusTime.description = "Total hours focused in this month";
    totalFocusTime.value = formatMinutes(totalFocusMinutes);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Track your productivity and focus patterns over time
        </p>
      </div>

      <TimelineSelector
        view={view}
        setView={setView}
        date={date}
        setDate={setDate}
        timeStamps={timeStamps}
      />

      <StatCards
        hoursFocused={hoursFocused}
        daysAccessed={daysAccessed}
        dayStreak={dayStreak}
        timelineTotal={totalFocusTime.value}
        timelineDescription={totalFocusTime.description}
        avgFocusTimeDescription={avgFocusTime.description}
        avgFocusTime={avgFocusTime.value}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        {view === "day" && <DayWiseAreaChart data={data} />}
        {view === "week" && (
          <WeekWiseBarChart firstDayOfTheWeek={timeStamps.start} data={data} />
        )}
        {view === "month" && (
          <MonthWiseBarChart
            firstDayOfTheMonth={timeStamps.start}
            lastDayOfTheMonth={timeStamps.end}
            data={data}
          />
        )}
        <TaskWiseChart data={taskWiseData} />
      </div>
    </div>
  );
}
