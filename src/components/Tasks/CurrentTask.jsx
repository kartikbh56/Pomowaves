import { useContext } from "react";
import { TimerContext, TasksContext } from "../Contexts/Context";
export default function CurrentTask() {
  const {
    tasksState: { tasks, currentTask }
  } = useContext(TasksContext);
  const {
    timerState: { completedPomodoros, mode }
  } = useContext(TimerContext);

  const currentTaskName = tasks.find((e) => e.id === currentTask)?.task;

  return (
    <div className="current-task">
      <div style={{ opacity: 0.6 }}>
        #{mode === "pomodoro" ? completedPomodoros + 1 : completedPomodoros}
      </div>
      <div>{currentTaskName ? currentTaskName : "Time to Focus"}</div>
    </div>
  );
}
