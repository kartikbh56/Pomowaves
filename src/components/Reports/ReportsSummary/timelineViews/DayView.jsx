import { useState, useEffect, useMemo } from "react";
import DaySelector from "../timelineSelector/DaySelector";
import TaskWiseStats from "./charts/TaskWiseStats";
import { fetchTimelineOnDate } from "../../../../appwrite backend/db";

export default function DayView() {
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  
  // refer : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours#syntax
  
  const startOfTheDay = useMemo(
    () => new Date(new Date(selectedDate).setHours(0, 0, 0)),
    [selectedDate]
  );
  // endOfTheDay.setHours(0);
  // endOfTheDay.setMinutes(0);
  // endOfTheDay.setSeconds(0);
  
  const endOfTheDay = useMemo(
    () => new Date(new Date(selectedDate).setHours(23, 59, 59)),
    [selectedDate]
  );
  // endOfTheDay.setHours(23);
  // endOfTheDay.setMinutes(59);
  // endOfTheDay.setSeconds(59);
  
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([]);
    const id = setTimeout(() => {
      fetchTimelineOnDate(startOfTheDay, endOfTheDay).then((data) => {
        setData(data.documents);
      });
    }, 800);
    return () => clearTimeout(id);
  }, [startOfTheDay, endOfTheDay]);

  return (
    <>
      <DaySelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <TaskWiseStats data={data} />
    </>
  );
}
