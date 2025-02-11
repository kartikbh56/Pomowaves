/* eslint-disable react/prop-types */
import { updateTimerSettings } from "../../api/db";
import { TimerContext,CountdownContext } from "../../contexts/context";
import { useEffect, useContext } from "react";
export default function TimerNavigation({
    firstClick,
  }) {
    const {timerState,dispatchTimerState} = useContext(TimerContext)
    const {$id:timerSettingsDocumentId} = timerState
    const {mode} = timerState
    const {dispatchCountdown} = useContext(CountdownContext)
    const selected = {
      fontWeight: "bold",
      backgroundColor: "rgba(0, 0, 0, 0.15)",
    };
    const buttons = ["pomodoro", "shortBreak", "longBreak"].map((btn) => (
      <button
        style={mode === btn ? selected : {}}
        key={btn}
        onClick={() => {
          dispatchTimerState({
            type: "changeMode",
            mode: btn,
            status: "initial",
          });
          //db
          updateTimerSettings(timerSettingsDocumentId,{mode:btn,status:"initial"})

          dispatchCountdown({
            type: "setCountdown",
            secondsRemaining: timerState[btn] * 60,
          });

        //   dispatchReports({
        //   type: "addReport",
        //   id: crypto.randomUUID(),
        //   taskId: tasksState.currentTask,
        //   task: currentTaskName,
        //   startedAt: startedAt,
        //   endedAt: Date.now(),
        // });

          firstClick.current = false;
        }}
      >
        {btn === "pomodoro" && "Pomodoro"}
        {btn === "shortBreak" && "Short Break"}
        {btn === "longBreak" && "Long Break"}
      </button>
    ));
    useEffect(() => {
      let backgroundColor;
      if (mode === "pomodoro") backgroundColor = "rgb(186, 74, 73)";
      if (mode === "shortBreak") backgroundColor = "#38868a";
      if (mode === "longBreak") backgroundColor = "#7e53a2";
      document.body.style.backgroundColor = backgroundColor;
    }, [mode]);
    return <div className="timernav">{buttons}</div>;
  }