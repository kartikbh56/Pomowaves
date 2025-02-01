import { useState } from "react";
import TimelineController from "./TimeLineController";
import formatWeek from "../../../../utils/fomatWeek";

export default function WeekPicker() {
  const [dayOfTheWeek, setDayOfTheWeek] = useState(new Date());

  const firstDayOfTheWeek = new Date();
  firstDayOfTheWeek.setDate(
    dayOfTheWeek.getDate() - (dayOfTheWeek.getDay() || 7) + 1
  );

  const lastDayOfTheWeek = new Date();
  lastDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 6);

  // console.log({ dayOfTheWeek, firstDayOfTheWeek, lastDayOfTheWeek });

  const handlePrevWeek = () => {
    const newDate = new Date(dayOfTheWeek)
    newDate.setDate(newDate.getDate() - 7)
    setDayOfTheWeek(newDate)
  };

  const handleNextWeek = () => {
    // setDayOfTheWeek((prevDate) => {
    //   const newDate = new Date(prevDate);
    //   newDate.setDate(prevDate.getDate() + 7);
    //   return newDate;
    // });
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
