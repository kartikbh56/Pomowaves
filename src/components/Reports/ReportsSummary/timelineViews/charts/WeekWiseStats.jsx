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

export default function WeekWiseStats({ data, firstDayOfTheWeek }) {
  const weekStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(
      firstDayOfTheWeek.getFullYear(),
      firstDayOfTheWeek.getMonth(),
      firstDayOfTheWeek.getDate() + i
    );

    const statsOnCurrentDate = data.filter(
      (d) => new Date(d.startedAt).toDateString() === date.toDateString()
    );
    const totalMinutesOnCurrentDate = statsOnCurrentDate.reduce(
      (acc, cur) => acc + getMinutes(cur.startedAt, cur.endedAt),
      0
    );
    const timeLineOnCurrentDate = statsOnCurrentDate.reduce(
      (resultArr, cur) => {
        const existingTimelineIndex = resultArr.findIndex(
          (t) => t.task === cur.task
        );
        if (existingTimelineIndex !== -1) {
          const existingData = resultArr[existingTimelineIndex];
          resultArr[existingTimelineIndex] = {
            ...existingData,
            minutes:
              existingData.minutes + getMinutes(cur.startedAt, cur.endedAt),
          };
        } else {
          resultArr.push({
            task: cur.task,
            minutes: getMinutes(cur.startedAt, cur.endedAt),
          });
        }
        return resultArr;
      },
      []
    );

    return {
      day: date,
      minutes: totalMinutesOnCurrentDate,
      timeline: timeLineOnCurrentDate,
    };
  });

  return (
    <>
      <WeekWiseCharts data={weekStats} />
    </>
  );
}

function WeekWiseCharts({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="1 1" />
        <XAxis
          dataKey="day"
          tickFormatter={(data) =>
            data.toLocaleDateString("en-US", { weekday: "short" })
          }
          fontSize={10}
        />
        <YAxis dataKey="minutes" type="number" interval={0} fontSize={10} />
        <Tooltip
          cursor={{ fill: "rgba(107, 107, 107, 0.1)" }}
          content={<CustomTooltip />}
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

const CustomTooltip = ({ active, payload, label }) => {
  const timeline = payload[0]?.payload?.timeline;
  if (!active || !payload || payload.length === 0) return null;

  const formattedDate = new Date(label).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.81)",
        borderRadius: "8px",
        border: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        padding: "8px 12px",
        color: "#fff",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px" }}>{formattedDate}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: "4px 0", color: "#f2938d" }}>
          Total: {formatMinutes(entry.value)}
        </p>
      ))}

      {timeline?.map((t) => (
        <li
          key={crypto.randomUUID()}
          style={{ margin: "4px 0", fontSize: "13px", color: "#ddd" }}
        >
          {t.task}: {t.minutes}min
        </li>
      ))}
    </div>
  );
};
