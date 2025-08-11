/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from "react";
import TimerMode from "./TimerMode";
import Clock from "./Clock";
import CurrentTask from "./CurrentTask";

export default function Timer() {
  const firstClick = useRef(false);

  return (
    <div className="flex flex-col justify-center space-y-6 xl:space-y-5">
      <TimerMode firstClick={firstClick} />
      <Clock firstClick={firstClick} />
      <CurrentTask />
    </div>
  );
}
