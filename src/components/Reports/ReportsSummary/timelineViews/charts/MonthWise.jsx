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
import { formatMinutes, getMinutes } from "../../../../../utils/formatDate";

export default function MonthWiseStats({
  data,
  firstDayOfTheMonth,
  lastDayOfTheMonth,
}) {
  const monthStats = Array.from(
    { length: lastDayOfTheMonth.getDate() },
    (_, i) => {
      const date = new Date(
        firstDayOfTheMonth.getFullYear(),
        firstDayOfTheMonth.getMonth(),
        firstDayOfTheMonth.getDate() + i
      );

      const statsOnCurrentDate = data.filter(
        (d) => new Date(d.startedAt).toDateString() === date.toDateString()
      );
      const totalMinutesOnCurrentDate = statsOnCurrentDate.reduce(
        (acc, cur) => acc + getMinutes(cur.startedAt, cur.endedAt),
        0
      );

      // console.log({statsOnCurrentDate,totalMinutesOnCurrentDate})
      return {
        day: date,
        minutes: totalMinutesOnCurrentDate,
      };
    }
  );
  //   console.log(monthStats);

  return (
    <>
      <MonthWiseCharts data={monthStats} />
    </>
  );
}

function MonthWiseCharts({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          dataKey="day"
          tickFormatter={(data) =>
            data.toLocaleDateString("en-US", { day: "numeric" })
          }
          fontSize={10}
          interval={0}
        />
        <YAxis dataKey="minutes" type="number" interval={0} fontSize={10} />
        <Tooltip
          cursor={{ fill: "rgba(107, 107, 107, 0.1)" }}
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "#fff" }}
          formatter={(value) => [formatMinutes(value), "Duration"]}
          labelFormatter={(value) =>
            value.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }
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
