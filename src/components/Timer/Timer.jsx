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
} from "../../contexts/context";
import TimerNavigation from "./TimerNavigation";
import Time from "./Time";
import StartButton from "./StartButton";
import {
  addTimeLine,
  updateCurrentTask,
  updateTask,
  updateTimerSettings,
  updateReport
} from "../../api/db";

export default function Timer() {
  const { timerState, dispatchTimerState } = useContext(TimerContext);
  const { countdownState, dispatchCountdown } = useContext(CountdownContext);
  const { tasksState, dispatchTasks } = useContext(TasksContext);
  const {
    reportsState: { $id, minutesFocused },
    dispatchReports,
  } = useContext(ReportsContext);

  const {
    status,
    mode,
    completedPomodoros,
    $id: timerSettingsDocumentId,
  } = timerState;

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
    } else if (status === "paused") {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    return () => {
      console.log("clean up");
      clearInterval(timerIdRef.current);
    };
  }, [status, timerState[mode]]);
  useEffect(() => {
    if (secondsRemaining <= 0) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;

      dispatchTimerState({ type: "clearPause", secsCompletedAtPause: 0 });

      if (mode === "pomodoro") {
        const completedPomodoros = timerState.completedPomodoros + 1;
        const nextMode =
          completedPomodoros % timerState.longBreakInterval === 0
            ? "longBreak"
            : "shortBreak";
        const secondsRemaining = timerState[nextMode] * 60;

        const newTasks = tasksState.tasks.map((task) =>
          task.id === tasksState.currentTask
            ? { ...task, completed: task.completed + 1 }
            : task
        );

        const currentTask = tasksState.tasks?.find(
          (t) => t.id === tasksState.currentTask
        );

        const currentTaskName = currentTask?.task;

        const report = {
          id: crypto.randomUUID(),
          task: currentTaskName || "No task",
          startedAt: timerState.startedAt, 
          endedAt: timerState.startedAt + timerState.pomodoro * 60 * 1000,
        };
        const minutes = Math.round(
          (report.endedAt - report.startedAt) / (1000 * 60)
        ) + minutesFocused
        console.log("%c","background-color:white;",minutes)
        // reports
        dispatchReports({
          type: "addReport",
          ...report,
          // the endedAt should be calculated according to the timerState. because in some cases, you start the timer and close the app, and then re-open it after the pomodoro is finished
          // (for example: pomodoro time is 25 mins, you start the timer and close it, and then you re-open it at 30 mins).
          // in that case, the timer automatically switches to break, because of efficient time elapsed calculation using startedAt state and currentTime (Date.now())
          // (startedAt + timerState[mode]*60*1000 - Date.now() < 0) which triggers "finishPomodoro" / "finishBreak"
          // that works fine, but updating endedAt:Date.now() adds into reports that the pomodoro is finished beyond the timerState timers. so,
          // timerState.startedAt + timerState.pomodoro * 60 * 1000 works perfectly.
          minutesFocused:minutes
        });
        updateReport($id, { minutesFocused: minutes });

        addTimeLine({
          ...report,
          startedAt: new Date(report.startedAt),
          endedAt: new Date(report.endedAt),
        });

        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });

        dispatchTimerState({
          type: "finishedPomodoro",
          completedPomodoros: completedPomodoros,
          mode: nextMode,
          status: "initial",
          startedAt: null,
        });
        //db
        updateTimerSettings(timerSettingsDocumentId, {
          completedPomodoros: completedPomodoros,
          mode: nextMode,
          status: "initial",
          secsCompletedAtPause: 0,
        });

        dispatchTasks({
          type: "setTasks",
          tasks: newTasks,
        });

        tasksState.currentTask &&
          updateTask(tasksState.currentTask, {
            completed: currentTask?.completed + 1,
          });
      } else {
        const nextMode = "pomodoro";
        const secondsRemaining = timerState[nextMode] * 60;
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
          startedAt: null,
        });
        //db
        updateTimerSettings(timerSettingsDocumentId, {
          mode: nextMode,
          status: "initial",
          secsCompletedAtPause: 0,
        });

        dispatchTasks({
          type: "setTasks",
          currentTask: nextTask,
        });
        updateCurrentTask(
          tasksState.currentTaskDocumentID,
          nextTask || currentTask.id || ""
        );
      }
      new Audio("sounds/button.mp3").play();
    }
  }, [secondsRemaining, completedPomodoros]);
  const progressPercent =
    100 - (secondsRemaining * 100) / (timerState[mode] * 60);
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
