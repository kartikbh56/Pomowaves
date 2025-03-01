/* eslint-disable react/prop-types */
import TimelineController from "./TimeLineController";
import { formatWeek } from "../../../../utils/formatDate";

export default function WeekSelector({
  dayOfTheWeek,
  setDayOfTheWeek,
  firstDayOfTheWeek,
  lastDayOfTheWeek,
}) {
  const handlePrevWeek = () => {
    const newDate = new Date(dayOfTheWeek);
    newDate.setDate(newDate.getDate() - 7);
    setDayOfTheWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(dayOfTheWeek);
    newDate.setDate(newDate.getDate() + 7);
    if (newDate < new Date()) setDayOfTheWeek(newDate);
  };

  const formattedDate = formatWeek(firstDayOfTheWeek, lastDayOfTheWeek);
  
  return (
    <TimelineController
      formattedDate={formattedDate}
      prevBtnHandler={handlePrevWeek}
      nextBtnHandler={handleNextWeek}
    />
  );
}
