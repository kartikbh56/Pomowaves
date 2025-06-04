import { useState, useEffect, useMemo } from "react";
import MonthSelector from "../timelineSelector/MonthSelector";
import TaskWiseStats from "./charts/TaskWiseStats";
import MonthWiseStats from "./charts/MonthWise";
import { fetchTimelineOnDate } from "../../../../backend/db";
export default function MonthView() {
  const [dayOfTheMonth, setDayOfTheMonth] = useState(new Date());

  const firstDayOfTheMonth = useMemo(
    () =>
      new Date(
        dayOfTheMonth.getFullYear(),
        dayOfTheMonth.getMonth(),
        1,
        0,
        0,
        0
      ),
    [dayOfTheMonth]
  );

  const lastDayOfTheMonth = useMemo(
    () =>
      new Date(
        dayOfTheMonth.getFullYear(),
        dayOfTheMonth.getMonth() + 1,
        0, // Passing 0 as the day gives the last day of the previous month, which in this case is the last day of the current month.
        23,
        59,
        59
      ),
    [dayOfTheMonth]
  );

  const [data, setData] = useState([]);
  useEffect(() => {
    const id = setTimeout(() => {
      fetchTimelineOnDate(firstDayOfTheMonth, lastDayOfTheMonth).then(
        (data) => {
          setData(data.documents);
        }
      );
    }, 500);
    return () => clearTimeout(id);
  }, [firstDayOfTheMonth, lastDayOfTheMonth]);

  return (
    <>
      <MonthSelector
        dayOfTheMonth={dayOfTheMonth}
        setDayOfTheMonth={setDayOfTheMonth}
      />
      <MonthWiseStats
        data={data}
        firstDayOfTheMonth={firstDayOfTheMonth}
        lastDayOfTheMonth={lastDayOfTheMonth}
      />
      <TaskWiseStats data={data} />
    </>
  );
}
