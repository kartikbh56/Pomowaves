import { useContext } from "react";
import {
  TimerContext,
  TasksContext,
  ReportsContext,
} from "../../contexts/context";
import { updateTimerSettings } from "../../api/db";
export default function CurrentTask() {
  const {
    tasksState: { tasks, currentTask },
  } = useContext(TasksContext);
  const {
    timerState: { completedPomodoros, mode, $id },
    dispatchTimerState
  } = useContext(TimerContext);

  const {
    reportsState: { lastAccessed },
  } = useContext(ReportsContext);

  // reset completedPomodoros every day
  if (new Date(lastAccessed).toDateString() !== new Date().toDateString()) {
    updateTimerSettings($id, {
      completedPomodoros: 0,
    }).then(()=>dispatchTimerState({type:"resetCompletedPomodoros",completedPomodoros:0}))
  }

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
