/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from "react";
import Progress from "../Progress";
import {
  CountdownContext,
  ReportsContext,
  TasksContext,
  TimerContext,
} from "../contexts/context";
import TimerNavigation from "./TimerNavigation";
import Time from "./Time";
import StartButton from "./StartButton";

export default function Timer() {
  const { timerState, dispatchTimerState } = useContext(TimerContext);
  const { countdownState, dispatchCountdown } = useContext(CountdownContext);
  const { tasksState, dispatchTasks } = useContext(TasksContext);
  const { dispatchReports } = useContext(ReportsContext);

  const { status, mode, completedPomodoros, timers } = timerState;

  const { secondsRemaining } = countdownState;

  const timerIdRef = useRef(null);

  function startTimer(seconds) {
    timerIdRef.current = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = Math.floor(
        (currentTime - timerState.startedAt) / 1000
      );
      const secondsRemaining = seconds - timeElapsed;
      dispatchCountdown({
        type: "setCountdown",
        secondsRemaining: secondsRemaining,
      });
    }, 1000);
  }

  useEffect(() => {
    if (status === "started") {
      startTimer(secondsRemaining);
    }
    
    else if (status === "paused") {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    return () => {
      console.log("clean up");
      clearInterval(timerIdRef.current);
    };

  }, [status, timerState.timers[mode]]);
  useEffect(() => {
    if (secondsRemaining <= 0) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
      if (mode === "pomodoro") {
        const completedPomodoros = timerState.completedPomodoros + 1;
        const nextMode =
          completedPomodoros % timerState.timers.longBreakInterval === 0
            ? "longBreak"
            : "shortBreak";
        const secondsRemaining = timerState.timers[nextMode] * 60;

        const timeFocused = {
          hours: timerState.timeFocused.hours + timerState.timers.pomodoro / 60,
          minutes:
            timerState.timeFocused.minutes + (timerState.timers.pomodoro % 60),
        };

        const newTasks = tasksState.tasks.map((task) =>
          task.id === tasksState.currentTask
            ? { ...task, completed: task.completed + 1 }
            : task
        );

        const currentTaskName = tasksState.tasks.find(
          (t) => t.id === tasksState.currentTask
        ).task;
        const startedAt = timerState.startedAt;
        const endsAt = timerState.endsAt;
        const diff = endsAt - startedAt;
        const currentTaskTimeFocused = {
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
        };

        dispatchReports({
          type: "pomodoroFinished",
          task: currentTaskName,
          timeFocused: currentTaskTimeFocused,
          startedAt: timerState.startedAt,
          endsAt: timerState.endsAt,
        });

        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });

        dispatchTimerState({
          type: "finishedPomodoro",
          completedPomodoros: completedPomodoros,
          mode: nextMode,
          timeFocused: timeFocused,
          status: "initial",
        });

        dispatchTasks({
          type: "setTasks",
          tasks: newTasks,
        });
      } else {
        const secondsRemaining = timerState.timers.pomodoro * 60;
        const nextMode = "pomodoro";
        const currentTask =
          tasksState.currentTask &&
          tasksState.tasks.find((t) => t.id === tasksState.currentTask);
        const nextTask = currentTask
          ? currentTask.completed + 1 >= currentTask.estimated
            ? tasksState.tasks.find(
                (t) =>
                  t.id !== tasksState.currentTask && t.completed < t.estimated
              )?.id
            : tasksState.currentTask
          : tasksState.currentTask;
        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });
        dispatchTimerState({
          type: "finishedBreak",
          mode: nextMode,
          status: "initial",
        });
        dispatchTasks({
          type: "setTasks",
          currentTask: nextTask,
        });
      }
      let bellRings =
        (completedPomodoros + 1) % timers.longBreakInterval === 0
          ? timers.longBreakInterval
          : (completedPomodoros + 1) % timers.longBreakInterval;
      let id = setInterval(() => {
        new Audio("sounds/button.mp3").play();
      }, 200);
      setTimeout(() => {
        clearInterval(id);
      }, 200 * bellRings);
    }
  }, [secondsRemaining, completedPomodoros]);
  const progressPercent =
    100 - (secondsRemaining * 100) / (timerState.timers[mode] * 60);
  const firstClick = useRef(false);
  return (
    <>
      <Progress percentage={progressPercent} />
      <div className="timer">
        <TimerNavigation firstClick={firstClick} />
        <Time secondsRemaining={secondsRemaining} />
        <StartButton firstClick={firstClick} />
      </div>
    </>
  );
}
