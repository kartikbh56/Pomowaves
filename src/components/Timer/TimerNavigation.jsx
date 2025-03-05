/* eslint-disable react/prop-types */
import {
  addTimeLine,
  updateTimerSettings,
  updateReport,
  updateLeaderboardProgress,
} from "../../appwrite backend/db";

import { ReportsContext } from "../../contexts/ReportsContextProvider";

import { TimerContext } from "../../contexts/TimerContextProvider";
import { TasksContext } from "../../contexts/TasksContextProvider";
import { CountdownContext } from "../../contexts/CountdownContext";
import { formatMinutes, getMinutes } from "../../utils/formatDate";
import { getColor } from "../../utils/getColor";
import { useEffect, useContext } from "react";
import { AddTimelineToast } from "../Toast";

export default function TimerNavigation({ firstClick }) {
  const { timerState, dispatchTimerState } = useContext(TimerContext);
  const { tasksState } = useContext(TasksContext);
  const {
    reportsState: { $id, minutesFocused, leaderBoardUserDocumentId },
    dispatchReports,
  } = useContext(ReportsContext);
  const { $id: timerSettingsDocumentId } = timerState;
  const { mode } = timerState;
  const { dispatchCountdown } = useContext(CountdownContext);
  const selected = {
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
  };
  function handleClick(btn) {
    dispatchTimerState({
      type: "changeMode",
      mode: btn,
      status: "initial",
      secsCompletedAtPause: 0,
      startedAt: null,
    });
    //db
    updateTimerSettings(timerSettingsDocumentId, {
      mode: btn,
      status: "initial",
      secsCompletedAtPause: 0,
      startedAt: null,
    });

    dispatchCountdown({
      type: "setCountdown",
      secondsRemaining: timerState[btn] * 60,
    });

    const currentTask = tasksState.tasks?.find(
      (t) => t.id === tasksState.currentTask
    );
    const currentTaskName = currentTask?.task;

    if (
      timerState.mode === "pomodoro" &&
      timerState.status != "initial" &&
      Math.floor((Date.now() - timerState.startedAt) / (1000 * 60)) > 0
    ) {
      // If you reset the timer (), add a report only if the focus time is more than 0
      const report = {
        id: crypto.randomUUID(),
        task: currentTaskName || "No task",
        startedAt: timerState.startedAt,
        endedAt: Date.now(),
      };
      const minutes =
        Math.round((report.endedAt - report.startedAt) / (1000 * 60)) +
        minutesFocused;
      dispatchReports({
        type: "addReport",
        ...report,
        minuteFocused: minutes,
      });
      updateReport($id, { minutesFocused: minutes });
      updateLeaderboardProgress(leaderBoardUserDocumentId, {
        minutesFocused: minutes,
      });

      addTimeLine({
        ...report,
        startedAt: new Date(report.startedAt).toISOString(),
        endedAt: new Date(report.endedAt).toISOString(),
      }).then(() =>
        AddTimelineToast(
          report.task,
          formatMinutes(getMinutes(report.startedAt, report.endedAt))
        )
      );
    }
    firstClick.current = false;
  }

  const buttons = ["pomodoro", "shortBreak", "longBreak"].map((btn) => (
    <button
      style={mode === btn ? selected : {}}
      key={btn}
      onClick={() => handleClick(btn)}
    >
      {btn === "pomodoro" && "Pomodoro"}
      {btn === "shortBreak" && "Short Break"}
      {btn === "longBreak" && "Long Break"}
    </button>
  ));
  useEffect(() => {
    document.body.style.backgroundColor = getColor(mode);
  }, [mode]);
  return <div className="timernav">{buttons}</div>;
}
