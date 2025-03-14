import { useEffect } from "react";
import { TasksFinishedToast } from "./Toast";
import { sendNotification } from "../utils/notification";
import { useTasksStore } from "../store/useTasksStore";
import { useTimerStore } from "../store/useTimerStore";

/* eslint-disable react/prop-types */
export default function Summary() {
  const tasks = useTasksStore((state) => state.tasks);
  const longBreakInterval = useTimerStore((state) => state.longBreakInterval);
  const pomodoro = useTimerStore((state) => state.pomodoro);
  const shortBreak = useTimerStore((state) => state.shortBreak);
  const longBreak = useTimerStore((state) => state.longBreak);

  const totalPomodoros = tasks.reduce(
    (acc, cur) => ({
      estimated: acc.estimated + cur.estimated,
      completed: acc.completed + cur.completed,
    }),
    { estimated: 0, completed: 0 }
  );

  const remainingTasks = totalPomodoros.estimated - totalPomodoros.completed;

  useEffect(() => {
    if (
      tasks.length > 0 &&
      totalPomodoros.completed >= totalPomodoros.estimated
    ) {
      TasksFinishedToast();
      sendNotification("You've finished all your tasks 🎉");
    }
  }, [totalPomodoros.estimated, totalPomodoros.completed, tasks.length]);

  if (remainingTasks === 0 || tasks.length <= 0) {
    return <></>;
  }

  const longBreaksCount = Math.floor((remainingTasks - 1) / longBreakInterval);

  const shortBreaksCount = Math.floor(remainingTasks - 1 - longBreaksCount);
  const timeRequired =
    (remainingTasks * pomodoro +
      longBreaksCount * longBreak +
      shortBreaksCount * shortBreak) *
    60; // seconds
  const hours = Math.floor(timeRequired / (60 * 60));
  const minutes = Math.floor(timeRequired / 60) - hours * 60;

  const finishAt = new Date(Date.now() + timeRequired * 1000);
  const finishAtHrs24h = finishAt.getHours();
  const finishAtHrs12h = finishAtHrs24h % 12 || 12;
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
