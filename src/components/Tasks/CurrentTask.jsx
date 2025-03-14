import { useEffect } from "react";
import { CurrentTaskToast } from "../Toast";
import { useTasksStore } from "../../store/useTasksStore";
import { useTimerStore } from "../../store/useTimerStore";
export default function CurrentTask() {
  const mode = useTimerStore((state) => state.mode);
  const completedPomodoros = useTimerStore((state) => state.completedPomodoros);
  const tasks = useTasksStore((state) => state.tasks);
  const currentTask = useTasksStore((state) => state.currentTask);
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
