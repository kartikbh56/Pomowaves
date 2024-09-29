import { useContext, useState } from "react";
import { CountdownContext, IsOpenContext, TimerContext } from "../Contexts/Context";
import SettingsContainer from "./SettingsContainer";
import TimeSettings from "./TimeSettings";
import AutoStartOptions from "./AutoStartOptions";
import LongBreakInterval from "./LongBreakInterval";
import Footer from "./Footer";

/* eslint-disable react/prop-types */
export default function Settings() {
  const { timerState, dispatchTimerState } = useContext(TimerContext);
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const { countdownState, dispatchCountdown } = useContext(CountdownContext);

  const [userTimers, setUserTimers] = useState(timerState.timers);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(
    timerState.autoStartPomodoros
  );
  const [autoStartBreaks, setAutoStartBreaks] = useState(
    timerState.autoStartBreaks
  );

  function saveSettings() {
    const secondsRemaining =
      timerState.status === "started" || timerState.status === "paused"
        ? userTimers[timerState.mode] * 60 -
          (timerState.timers[timerState.mode] * 60 -
            countdownState.secondsRemaining)
        : userTimers[timerState.mode] * 60;

    dispatchIsOpen({ type: "toggleMenu", menu: "settings" });

    dispatchTimerState({
      type: "changeTimerSettings",
      timers: userTimers,
      autoStartBreaks: autoStartBreaks,
      autoStartPomodoros: autoStartPomodoros,
    });

    dispatchCountdown({
      type: "setCountdown",
      secondsRemaining: secondsRemaining,
    });
  }
  return (
    <SettingsContainer saveSettings={saveSettings}>
      <TimeSettings userTimers={userTimers} setUserTimers={setUserTimers} />
      <AutoStartOptions
        autoStartBreaks={autoStartBreaks}
        autoStartPomodoros={autoStartPomodoros}
        setAutoStartBreaks={setAutoStartBreaks}
        setAutoStartPomodoros={setAutoStartPomodoros}
      />
      <LongBreakInterval
        userTimers={userTimers}
        setUserTimers={setUserTimers}
      />
      <Footer saveSettings={saveSettings} />
    </SettingsContainer>
  );
}
