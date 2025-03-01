/* eslint-disable react/prop-types */
import TimelineController from "./TimeLineController";
import { formatDay } from "../../../../utils/formatDate";

export default function DaySelector({ selectedDate, setSelectedDate }) {
  function handlePrevDay() {
    // const newDate = new Date(selectedDate);
    // newDate.setDate(selectedDate.getDate() - 1);

    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() - 1
    );
    setSelectedDate(newDate);
  }

  function handleNextDay() {
    // if (selectedDate < new Date()) {
    // you can only select today's date or the previous ones but not tomorrow's

    // const newDate = new Date(selectedDate);
    // newDate.setDate(selectedDate.getDate() + 1);

    const newDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + 1
    );

    if (newDate < new Date()) 
      setSelectedDate(newDate);
  }

  const formattedDate = formatDay(selectedDate)

  return (
    <TimelineController
      formattedDate={formattedDate}
      prevBtnHandler={handlePrevDay}
      nextBtnHandler={handleNextDay}
    />
  );
}
