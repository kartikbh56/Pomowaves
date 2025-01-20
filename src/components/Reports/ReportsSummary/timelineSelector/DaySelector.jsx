/* eslint-disable react/prop-types */
import TimelineController from "./TimeLineController";
import formatDate from "../../../../utils/formatDate";

export default function DaySelector({ selectedDate, setSelectedDate }) {

  const handlePrevDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <TimelineController
      currentTimeLine={selectedDate}
      prevBtnHandler={handlePrevDay}
      nextBtnHandler={handleNextDay}
      formatFunction={formatDate}
    />
  );
}
