import { useEffect } from "react";
import { useTimerStore } from "../../store/useTimerStore";

/* eslint-disable react/prop-types */
export default function Time({ secondsRemaining }) {
  const mode = useTimerStore((state) => state.mode);
  const time =
    `${Math.floor(secondsRemaining / 60)}`.padStart(2, "0") +
    " : " +
    `${secondsRemaining % 60}`.padStart(2, "0");

  useEffect(() => {
    document.title =
      time.replaceAll(" ", "") +
      " - " +
      (mode === "pomodoro" ? "Time to focus" : "Time for a break");

    const favicon = document.querySelector("link[rel='icon']");
    favicon.href =
      mode === "pomodoro"
        ? "/pomodoro.ico"
        : mode === "shortBreak"
        ? "/shortBreak.ico"
        : "/longBreak.ico"; // Change this to your desired favicon
  }, [time, mode]);

  return <div className="time">{time}</div>;
}
