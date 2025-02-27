import WeekSelector from "../timelineSelector/WeekSelector";
import { useState, useEffect, useMemo } from "react";
import TaskWiseStats from "./charts/TaskWiseStats";
import WeekWiseStats from "./charts/WeekWiseStats";
import { fetchTimelineOnDate } from "../../../../api/db";
export default function WeekView() {
  const [dayOfTheWeek, setDayOfTheWeek] = useState(new Date());

  const firstDayOfTheWeek = useMemo(
    () =>
      new Date(
        dayOfTheWeek.getFullYear(),
        dayOfTheWeek.getMonth(),
        dayOfTheWeek.getDate() - (dayOfTheWeek.getDay() || 7) + 1,
        0,
        0,
        0
      ),
    [dayOfTheWeek]
  );

  const lastDayOfTheWeek = useMemo(
    () =>
      new Date(
        dayOfTheWeek.getFullYear(),
        dayOfTheWeek.getMonth(),
        firstDayOfTheWeek.getDate() + 6,
        23,
        59,
        59
      ),
    [dayOfTheWeek, firstDayOfTheWeek]
  );

  console.log({ firstDayOfTheWeek, lastDayOfTheWeek });

  const [data, setData] = useState([]);
  useEffect(() => {
    // setData([])
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
      />
      <WeekWiseStats data={data} firstDayOfTheWeek={firstDayOfTheWeek} />
      <TaskWiseStats data={data} />
    </>
  );
}
