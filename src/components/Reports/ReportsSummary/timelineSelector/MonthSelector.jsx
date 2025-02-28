/* eslint-disable react/prop-types */
import TimelineController from "./TimeLineController";
import { formatMonth } from "../../../../utils/formatDate";

export default function MonthSelector({ dayOfTheMonth, setDayOfTheMonth }) {
  function handleNextMonth() {
    // const nextMonth = new Date(dayOftheMonth)
    // nextMonth.setMonth(nextMonth.getMonth() + 1);
    // nextMonth.setDate(1);
    const nextMonth = new Date(
      dayOfTheMonth.getFullYear(),
      dayOfTheMonth.getMonth() + 1
    );
    if (nextMonth < new Date()) setDayOfTheMonth(nextMonth);
  }
  function handlePrevMonth() {
    // const nextMonth = new Date(dayOfTheMonth);
    // nextMonth.setMonth(nextMonth.getMonth() - 1);
    // nextMonth.setDate(1);
    const prevMonth = new Date(
      dayOfTheMonth.getFullYear(),
      dayOfTheMonth.getMonth() - 1
    );
    setDayOfTheMonth(prevMonth);
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
