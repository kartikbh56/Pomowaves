/* eslint-disable react/prop-types */
import TimelineController from "./TimeLineController";
import formatDate from "../../../../utils/formatDate";

export default function DaySelector({ selectedDate, setSelectedDate }) {

  function handlePrevDay() {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  }
  
  function handleNextDay() {
    if (selectedDate.getDate() !== new Date().getDate()) { // you can only select today's date and the previous ones not tomorrow's
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  }

  return (
    <TimelineController
      currentTimeLine={selectedDate}
      prevBtnHandler={handlePrevDay}
      nextBtnHandler={handleNextDay}
      formatFunction={formatDate}
    />
  );
}
