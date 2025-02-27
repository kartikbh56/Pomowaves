/* eslint-disable react/prop-types */
import TimelineController from "./TimeLineController";
import {formatWeek} from "../../../../utils/formatDate";

export default function WeekPicker({dayOfTheWeek, setDayOfTheWeek}) {
  const handlePrevWeek = () => {
    const newDate = new Date(dayOfTheWeek)
    newDate.setDate(newDate.getDate() - 7)
    setDayOfTheWeek(newDate)
  };

  const handleNextWeek = () => {
    const newDate = new Date(dayOfTheWeek)
    newDate.setDate(newDate.getDate() + 7)
    setDayOfTheWeek(newDate)
  };

  return (
    <TimelineController
      currentTimeLine={dayOfTheWeek}
      prevBtnHandler={handlePrevWeek}
      nextBtnHandler={handleNextWeek}
      formatFunction={formatWeek}
    />
  );
}
