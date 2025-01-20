import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import WeekSelector from "../timelineSelector/WeekSelector";
export default function WeekView() {
  const data = [];
  return (
    <>
      <WeekSelector />
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
