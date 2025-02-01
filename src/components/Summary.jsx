import { useContext } from "react";
import { TasksContext,TimerContext } from "../contexts/context";

/* eslint-disable react/prop-types */
export default function Summary() {

  const {tasksState} = useContext(TasksContext)
  const {tasks} = tasksState
  const {timerState} = useContext(TimerContext)
  const {timers} = timerState

  const totalPomodoros = tasks.reduce(
    (acc, cur) => ({
      estimated: acc.estimated + cur.estimated,
      completed: acc.completed + cur.completed,
    }),
    { estimated: 0, completed: 0 }
  );

  const remainingTasks = totalPomodoros.estimated - totalPomodoros.completed;
  const longBreaksCount = Math.floor(
    (remainingTasks - 1) / timers.longBreakInterval
  );
  const shortBreaksCount = Math.floor(remainingTasks - 1 - longBreaksCount);
  const timeRequired =
    (remainingTasks * timers.pomodoro +
      longBreaksCount * timers.longBreak +
      shortBreaksCount * timers.shortBreak) *
    60; // seconds
  const hours = Math.floor(timeRequired / (60 * 60));
  const minutes = Math.floor(timeRequired / 60) - hours * 60;

  const finishAt = new Date(Date.now() + timeRequired * 1000);
  const finishAtHrs24h = finishAt.getHours();
  const finishAtHrs12h = finishAtHrs24h%12 || 12
  const finishAtMins = finishAt.getMinutes();
  const meridiem = finishAtHrs24h >= 12 ? " PM " : " AM ";

  return (
    <div className="summary">
      <div>
        Pomos :{" "}
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
          {totalPomodoros.completed}
        </span>
        {" / "}
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
          {totalPomodoros.estimated}
        </span>
      </div>
      <div>
        Finish at :{" "}
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>
          {String(finishAtHrs12h).padStart(2, "0") +
            ":" +
            String(finishAtMins).padStart(2, "0") +
            meridiem}
          ({hours + "h " + minutes + "m"})
        </span>
      </div>
    </div>
  );
}
