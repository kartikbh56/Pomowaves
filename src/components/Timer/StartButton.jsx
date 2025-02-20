/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from "react";
import {
  CountdownContext,
  TasksContext,
  TimerContext,
  ReportsContext,
} from "../../contexts/context";
import {
  addTimeLine,
  updateReport,
  updateTask,
  updateTimerSettings,
} from "../../api/db";
import { getColor } from "../../utils/getColor";

export default function StartButton({ firstClick }) {
  const {
    timerState,
    timerState: {
      status,
      mode,
      autoStartBreaks,
      autoStartPomodoros,
      startedAt,
    },
    dispatchTimerState,
  } = useContext(TimerContext);
  const timerSettingsDocumentId = timerState.$id;
  const { tasksState, dispatchTasks } = useContext(TasksContext);

  const {
    reportsState: { $id },
    dispatchReports,
  } = useContext(ReportsContext);

  const {
    countdownState: { secondsRemaining },
  } = useContext(CountdownContext);

  const buttonRef = useRef(null);
  useEffect(() => {
    if (firstClick.current) {
      if (
        (mode === "pomodoro" && autoStartPomodoros && status === "initial") ||
        ((mode === "shortBreak" || mode === "longBreak") &&
          autoStartBreaks &&
          status === "initial")
      ) {
        const timer = setTimeout(() => {
          buttonRef.current.click();
        }, 1000);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [mode, autoStartBreaks, status, autoStartPomodoros, firstClick]);

  function handleClick() {
    new Audio("sounds/finger-snap.mp3").play();
    firstClick.current = true;

    if (status === "started") {
      // when paused
      const secsCompletedAtPause = timerState[mode] * 60 - secondsRemaining;
      dispatchTimerState({
        type: "paused",
        status: "paused",
        startedAt: null,
        secsCompletedAtPause: secsCompletedAtPause,
      });
      //db
      updateTimerSettings(timerSettingsDocumentId, {
        status: "paused",
        startedAt: null,
        secsCompletedAtPause: secsCompletedAtPause,
      });

      const currentTaskName = tasksState.tasks.find(
        (e) => e.id === tasksState.currentTask
      )?.task;

      if (Math.floor((Date.now() - startedAt) / (1000 * 60)) > 0) {
        // If you pause the timer, add a report only if the focus time is more than 0 minutes
        const report = {
          id: crypto.randomUUID(),
          task: currentTaskName || "No Task",
          startedAt: startedAt,
          endedAt: Date.now(),
        };
        const minutes = Math.round(
          (report.endedAt - report.startedAt) / (1000 * 60)
        );
        dispatchReports({
          type: "addReport",
          ...report,
          minutesFocused: minutes,
        });
        updateReport($id, { minutesFocused: minutes });
        addTimeLine({
          ...report,
          startedAt: new Date(report.startedAt),
          endedAt: new Date(report.endedAt),
        });
      }
    } else {
      dispatchTimerState({
        type: "started",
        status: "started",
        startedAt: Date.now(),
      });
      console.log("timerSettingsDocumentId", timerSettingsDocumentId);

      updateTimerSettings(timerSettingsDocumentId, {
        startedAt: new Date(),
        status: "started",
      });
    }

    if (status === "initial" && mode === "pomodoro" && tasksState.currentTask)
      dispatchTasks({ type: "sortTasks" });

    const currentTask = tasksState.currentTask
      ? tasksState.tasks.find((t) => t.id === tasksState.currentTask)
      : tasksState.tasks[0];

    if (
      currentTask?.completed >= currentTask?.estimated &&
      mode === "pomodoro"
    ) {
      const newTasks = tasksState.tasks.map((task) =>
        task.id === currentTask.id
          ? { ...task, estimated: task.estimated + 1 }
          : task
      );
      dispatchTasks({
        type: "setTasks",
        tasks: newTasks,
        currentTask: currentTask.id,
      });
      updateTask(currentTask.id, { estimated: currentTask.estimated + 1 });

      dispatchTasks({ type: "sortTasks" });
    }
  }
  const btnColor = getColor(mode);

  return (
    <button
      className="startbtn"
      style={{
        color: btnColor,
        boxShadow: status === "started" && "none",
        transform: status === "started" && "translateY(6px)",
      }}
      ref={buttonRef}
      onClick={handleClick}
    >
      {status === "started" ? "PAUSE" : "START"}
    </button>
  );
}
