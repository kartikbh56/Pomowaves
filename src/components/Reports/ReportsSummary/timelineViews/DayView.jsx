import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";
import DaySelector from "../timelineSelector/DaySelector";
export default function DayView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const data = [
    {
      name: "Task 1",
      minutes: 60,
    },
    {
      name: "Task 2",
      minutes: 75,
    },
    {
      name: "Task 3",
      minutes: 45,
    },
    {
      name: "Task 4",
      minutes: 85,
    },
  ];
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
