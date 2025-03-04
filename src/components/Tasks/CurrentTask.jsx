import { useContext, useEffect } from "react";
import { TimerContext, TasksContext } from "../../contexts/context";
import { CurrentTaskToast } from "../Toast";
export default function CurrentTask() {
  const {
    tasksState: { tasks, currentTask },
  } = useContext(TasksContext);
  const {
    timerState: { completedPomodoros, mode },
  } = useContext(TimerContext);

  const currentTaskName = tasks.find((e) => e.id === currentTask)?.task;

  useEffect(
    () => currentTaskName && CurrentTaskToast(currentTaskName),
    [currentTaskName]
  );
  return (
    <div className="current-task">
      <div style={{ opacity: 0.6 }}>
        #{mode === "pomodoro" ? completedPomodoros + 1 : completedPomodoros}
      </div>
      <div>{currentTaskName ? currentTaskName : "Time to Focus"}</div>
    </div>
  );
}
