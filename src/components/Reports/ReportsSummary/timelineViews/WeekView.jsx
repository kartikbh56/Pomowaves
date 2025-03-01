import WeekSelector from "../timelineSelector/WeekSelector";
import { useState, useEffect, useMemo } from "react";
import TaskWiseStats from "./charts/TaskWiseStats";
import WeekWiseStats from "./charts/WeekWiseStats";
import { fetchTimelineOnDate } from "../../../../api/db";
export default function WeekView() {
  const [dayOfTheWeek, setDayOfTheWeek] = useState(new Date());

  // Calculate the first day of the week (Monday)
  const firstDayOfTheWeek = useMemo(
    () =>
      new Date(
        dayOfTheWeek.getFullYear(),
        dayOfTheWeek.getMonth(),
        dayOfTheWeek.getDate() - dayOfTheWeek.getDay() + 1,
        0,
        0,
        0
      ),
    [dayOfTheWeek]
  );

  // Calculate the last day of the week (Sunday)
  const lastDayOfTheWeek = useMemo(
    () =>
      new Date(
        firstDayOfTheWeek.getFullYear(),
        firstDayOfTheWeek.getMonth(),
        firstDayOfTheWeek.getDate() + 6,
        23,
        59,
        59
      ),
    [firstDayOfTheWeek]
  );

  // console.log({ firstDayOfTheWeek, lastDayOfTheWeek });

  const [data, setData] = useState([]);
  useEffect(() => {
    const id = setTimeout(() => {
      fetchTimelineOnDate(firstDayOfTheWeek, lastDayOfTheWeek).then((data) => {
        setData(data.documents);
      });
    }, 500);
    return () => clearTimeout(id);
  }, [firstDayOfTheWeek, lastDayOfTheWeek]);

  return (
    <>
      <WeekSelector
        dayOfTheWeek={dayOfTheWeek}
        setDayOfTheWeek={setDayOfTheWeek}
        firstDayOfTheWeek={firstDayOfTheWeek}
        lastDayOfTheWeek={lastDayOfTheWeek}
      />
      <WeekWiseStats data={data} firstDayOfTheWeek={firstDayOfTheWeek} />
      <TaskWiseStats data={data} />
    </>
  );
}
