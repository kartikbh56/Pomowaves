/* eslint-disable react/prop-types */

import { getColor } from "../../utils/getColor";
import { useEffect } from "react";
import { useTimerStore } from "../../store/useTimerStore";
import { useTasksStore } from "../../store/useTasksStore";
import { useReportsStore } from "../../store/useReportsStore";

export default function TimerNavigation({ firstClick }) {
  const mode = useTimerStore((state) => state.mode);
  const changeMode = useTimerStore((state) => state.changeMode);
  const currentTaskId = useTasksStore((state) => state.currentTask);
  const tasks = useTasksStore((state) => state.tasks);
  const status = useTimerStore((state) => state.status);
  const startedAt = useTimerStore((state) => state.startedAt);
  const addTimeLine = useReportsStore((state) => state.addTimeLine);

  const selected = {
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  };
  function handleClick(btn) {
    changeMode(btn);

    const currentTask = tasks?.find((t) => t.id === currentTaskId);
    const currentTaskName = currentTask?.task;

    if (
      mode === "pomodoro" &&
      status === "started" &&
      Math.floor((Date.now() - startedAt) / (1000 * 60)) > 0
    ) {
      addTimeLine(currentTaskName, startedAt, new Date());
    }
    firstClick.current = false;
  }

  const buttons = ["pomodoro", "shortBreak", "longBreak"].map((btn) => (
    <button
      style={mode === btn ? selected : {}}
      key={btn}
      onClick={() => handleClick(btn)}
    >
      {btn === "pomodoro" && "Pomodoro"}
      {btn === "shortBreak" && "Short Break"}
      {btn === "longBreak" && "Long Break"}
    </button>
  ));
  useEffect(() => {
    document.body.style.backgroundColor = getColor(mode);
  }, [mode]);
  return <div className="timernav">{buttons}</div>;
}
