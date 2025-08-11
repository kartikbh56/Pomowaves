/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { CircleCheck, Clock } from "lucide-react";
import { useTasksStore } from "../../store/useTasksStore";
import { useTimerStore } from "../../store/useTimerStore";
import { sendNotification } from "../../utils/notification";
import { TasksFinishedToast } from "../Toast";
import { getFinishTime } from "../../utils/formatDate";

export default function Stats() {
  const tasks = useTasksStore((state) => state.tasks);
  const longBreakInterval = useTimerStore((state) => state.longBreakInterval);
  const pomodoro = useTimerStore((state) => state.pomodoro);
  const shortBreak = useTimerStore((state) => state.shortBreak);
  const longBreak = useTimerStore((state) => state.longBreak);
  const currentTimer = useTimerStore((state) => state[state.mode]); // current mode timer (pomodoro, shortBreak, longBreak)

  const totalPomodoros = tasks.reduce(
    (acc, cur) => ({
      estimated: acc.estimated + cur.estimated,
      completed: acc.completed + cur.completed,
    }),
    { estimated: 0, completed: 0 },
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

  const longBreaksCount = Math.floor((remainingTasks - 1) / longBreakInterval);

  const shortBreaksCount = Math.floor(remainingTasks - 1 - longBreaksCount);

  const timeRequired =
    remainingTasks > 0
      ? (remainingTasks * pomodoro +
          longBreaksCount * longBreak +
          shortBreaksCount * shortBreak) *
        60
      : currentTimer * 60; // seconds

  const { hh, mm, ampm } = getFinishTime(timeRequired);
  return (
    <div className="flex-shrink-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatsCard
          title="Completed Pomodoros"
          value={`${totalPomodoros.completed} / ${totalPomodoros.estimated}`}
          icon={CircleCheck}
        />
        <StatsCard
          title="Estimated Finish"
          value={`${hh}:${mm} ${ampm}`}
          icon={Clock}
        />
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className={`bg-card rounded-lg p-4 border shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-lg sm:text-2xl font-bold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
          <Icon className="h-6 w-6 text-foreground" />
        </div>
      </div>
    </div>
  );
}
