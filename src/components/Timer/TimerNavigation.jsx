/* eslint-disable react/prop-types */
import { TimerContext,CountdownContext } from "../Contexts/Context";
import { useEffect, useContext } from "react";
export default function TimerNavigation({
    firstClick,
  }) {
    const {timerState:{timers,mode},dispatchTimerState} = useContext(TimerContext)
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
          dispatchCountdown({
            type: "setCountdown",
            secondsRemaining: timers[btn] * 60,
          });
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
      if (mode === "pomodoro") backgroundColor = "#ba4a49";
      if (mode === "shortBreak") backgroundColor = "#38868a";
      if (mode === "longBreak") backgroundColor = "#7e53a2";
      document.body.style.backgroundColor = backgroundColor;
    }, [mode]);
    return <div className="timernav">{buttons}</div>;
  }