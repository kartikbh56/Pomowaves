import { useState } from "react";
import TimelineController from "./TimeLineController";

export default function MonthSelector() {
  const [dayOfTheMonth, setDayOfTheMonth] = useState(new Date());
  function formatMonth(dayOfTheMonth) {
    return dayOfTheMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
  function handleNextMonth() {
    const nextMonth = new Date(dayOfTheMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);
    setDayOfTheMonth(nextMonth);
  }
  function handlePrevMonth() {
    const nextMonth = new Date(dayOfTheMonth);
    nextMonth.setMonth(nextMonth.getMonth() - 1);
    nextMonth.setDate(1);
    setDayOfTheMonth(nextMonth);
  }
  return (
    <TimelineController
      currentTimeLine={dayOfTheMonth}
      prevBtnHandler={handlePrevMonth}
      nextBtnHandler={handleNextMonth}
      formatFunction={formatMonth}
    />
  );
}
