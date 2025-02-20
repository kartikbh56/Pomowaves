import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useEffect, useState } from "react";
import DaySelector from "../timelineSelector/DaySelector";
import { fetchTimelineOnDate } from "../../../../api/db";
export default function DayView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const startOfTheDay = new Date(selectedDate);
  startOfTheDay.setHours(0);
  startOfTheDay.setMinutes(0);
  startOfTheDay.setSeconds(0);

  const endOfTheDay = new Date(selectedDate);
  endOfTheDay.setHours(23);
  endOfTheDay.setMinutes(23);
  endOfTheDay.setSeconds(23);
  useEffect(() => {
    fetchTimelineOnDate(
      startOfTheDay.toISOString(),
      endOfTheDay.toISOString()
    ).then((data) => setData(data.documents));
  }, []);

  // const getMinutes = (startedAt, endedAt) =>
  //   (endedAt - startedAt) / (1000 * 60);
  // const mergedData = data.reduce((resultArr, currentData) => {
  //   const existingData = resultArr.find(
  //     (data) => data.task === currentData.task
  //   );
  //   if (existingData) {
  //     // existingData.minutes += currentData.minutes;
  //     existingData.minutes += getMinutes(
  //       currentData.startedAt,
  //       currentData.endedAt
  //     );
  //     existingData.timeline.push({
  //       startedAt: currentData.startedAt,
  //       endedAt: currentData.endedAt,
  //     });
  //   } else {
  //     const resultData = currentData.map((d) => ({
  //       task: d.task,
  //       minutes: getMinutes(d.startedAt, d.endedAt),
  //       timeline: [{ startedAt: d.startedAt, endedAt: d.endedAt }],
  //     }));
  //     resultArr.push(resultData);
  //   }
  //   return resultArr;
  // }, []);

  
  return (
    <>
      <DaySelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis dataKey="minutes" />
          <Tooltip />
          <Bar
            type="monotone"
            dataKey="minutes"
            stroke="#CD5C5C"
            fill="#f2938d"
            fillOpacity={0.7}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

/*
      const tasks = [
      {task: "react.js", mins: 120},
      {task: "react.js", mins: 30},
      {task: "react.js", mins: 20},
      {task: "react.js", mins: 40},
      {task: "next.js", mins: 60},
      {task: "react.js", mins: 40},
      {task: "node.js", mins: 60},
      {task: "react.js", mins: 40},
    ];
    
    const mergedData = tasks.reduce(function(acc,cur){
      const existingData = acc.find(d=>d.task===cur.task)
      if(existingData)
        existingData.mins += cur.mins
      else
        acc.push(cur)
      return acc
    },[])
    
    console.log(mergedData)
      */
