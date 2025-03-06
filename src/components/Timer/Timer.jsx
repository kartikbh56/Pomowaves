/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from "react";
import Progress from "../Progress";
import // ReportsContext,
// TasksContext,
"../../contexts/context";

import { ReportsContext } from "../../contexts/ReportsContextProvider";

import { TasksContext } from "../../contexts/TasksContextProvider";

import { TimerContext } from "../../contexts/TimerContextProvider";
import { CountdownContext } from "../../contexts/CountdownContext";
import TimerNavigation from "./TimerNavigation";
import Time from "./Time";
import StartButton from "./StartButton";
import {
  addTimeLine,
  updateCurrentTask,
  updateTask,
  updateTimerSettings,
  updateReport,
  updateLeaderboardProgress,
  fetchTimerSettings,
  createTimerSettings,
} from "../../appwrite backend/db";
import { AddTimelineToast, UpdateTaskToast } from "../Toast";
import { formatMinutes, getMinutes } from "../../utils/formatDate";
import { sendNotification } from "../../utils/notification";

export default function Timer() {
  const { timerState, dispatchTimerState } = useContext(TimerContext);
  const { countdownState, dispatchCountdown } = useContext(CountdownContext);
  const { tasksState, dispatchTasks } = useContext(TasksContext);
  const {
    reportsState: { $id, minutesFocused, leaderBoardUserDocumentId },
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

  useEffect(() => {
    fetchTimerSettings().then((data) => {
      if (!data?.$id) {
        // if there's no document in the collection.
        // create one for the user and update the states
        createTimerSettings({
          ...timerState,
          lastAccessed: new Date().toISOString(),
        }).then((data) => {
          dispatchTimerState({
            type: "initializeTimerSettings",
            timerSettings: {
              ...data,
              startedAt: data.startedAt, // it's null because, it's being created for the first time.
              lastAccessed: new Date(data.lastAccessed),
            },
          });
        });
      } else {
        // if already exists
        dispatchTimerState({
          type: "initializeTimerSettings",
          timerSettings: {
            ...data,
            startedAt: new Date(data.startedAt).getTime() || null,
            lastAccessed: new Date(data.lastAccessed),
            // new Date(null).getTime() is 0, so, if `startedAt` fetched form db is null, then store it as it is in the state, converting it to Date() causes inaccurate time calculations.
          },
        });
        const secondsRemaining =
          data[data.mode] * 60 - data.secsCompletedAtPause;
        dispatchCountdown({
          type: "setCountdown",
          secondsRemaining: secondsRemaining,
        });

        // reset completedPomodoros every day
        if (
          new Date(data.lastAccessed).toDateString() !==
          new Date().toDateString()
        ) {
          console.log("resetting completedPomodoros");
          updateTimerSettings(data.$id, {
            completedPomodoros: 0,
          }).then(() =>
            dispatchTimerState({
              type: "resetCompletedPomodoros",
              completedPomodoros: 0,
            })
          );
        }
        updateTimerSettings(data.$id, {
          lastAccessed: new Date().toISOString(),
        });
      }
    });
  }, []);

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
        sendNotification(`Time to take a ${nextMode.split("B")[0]} break!`);
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
        const minutes =
          Math.round((report.endedAt - report.startedAt) / (1000 * 60)) +
          minutesFocused;
        console.log("%c", "background-color:white;", minutes);
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
          minutesFocused: minutes,
        });
        updateReport($id, { minutesFocused: minutes }).then((data) =>
          dispatchReports({
            type: "updateReport",
            report: { minutesFocused: data.minutesFocused },
          })
        );
        updateLeaderboardProgress(leaderBoardUserDocumentId, {
          minutesFocused: minutes,
        });

        report.startedAt &&
        addTimeLine({
          ...report,
          startedAt: new Date(report.startedAt),
          endedAt: new Date(report.endedAt),
        }).then(() =>
          AddTimelineToast(
            report.task,
            formatMinutes(getMinutes(report.startedAt, report.endedAt))
          )
        );

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
          }).then((data) => UpdateTaskToast(data.task));
      } else {
        sendNotification("Time to Focus!");
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
        if (nextTask !== tasksState.currentTask) {
          updateCurrentTask(
            tasksState.currentTaskDocumentID,
            nextTask || currentTask.id || ""
          );
        }
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
