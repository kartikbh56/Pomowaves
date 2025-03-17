/* eslint-disable react/prop-types */

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";

import TotalFocusHours from "../TotalFocusHours";
import { formatMinutes, getMinutes } from "../../../../../utils/formatDate";

export default function TaskWiseStats({ data }) {
  const taskWiseData = data.reduce(function (resultArr, currentData) {
    const existingDataIndex = resultArr.findIndex(
      (data) => data.task === currentData.task
    );
    if (existingDataIndex !== -1) {
      const existingData = resultArr[existingDataIndex];
      resultArr[existingDataIndex] = {
        ...existingData,
        minutes:
          existingData.minutes +
          getMinutes(currentData.startedAt, currentData.endedAt),
      };
    } else {
      const resultData = {
        task: currentData.task,
        minutes: getMinutes(currentData.startedAt, currentData.endedAt),
      };
      resultArr.push(resultData);
    }
    return resultArr;
  }, []);
  taskWiseData.sort((a, b) => a.minutes - b.minutes);

  const totalFocusMinutes = taskWiseData.reduce(
    (acc, cur) => acc + cur.minutes,
    0
  );

  return (
    <>
      <TaskWiseChart taskWiseData={taskWiseData} />
      <TotalFocusHours totalFocusMinutes={totalFocusMinutes} />
    </>
  );
}

function TaskWiseChart({ taskWiseData }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={taskWiseData}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis dataKey="task" fontSize={10} interval={0} />
        <YAxis dataKey="minutes" type="number" fontSize={10} interval={0} />
        <Tooltip
          cursor={{ fill: "rgba(107, 107, 107, 0.1)" }}
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.81)",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "#fff" }}
          formatter={(value) => [formatMinutes(value), "Total"]}
        />
        <Legend iconType="line" verticalAlign="top" />
        <Bar
          dataKey="minutes"
          activeBar={false}
          stroke="#CD5C5C"
          fill="#f2938d"
          fillOpacity={0.6}
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
