import { useContext, useState } from "react";
import {
  CountdownContext,
  IsOpenContext,
  TimerContext,
} from "../../contexts/context";
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
    let secondsRemaining =
      timerState.status === "paused"
        ? userTimers[timerState.mode] * 60 -
          (timerState.timers[timerState.mode] * 60 -
            countdownState.secondsRemaining)
        : userTimers[timerState.mode] * 60;

    if (timerState.secsCompletedAtPause && timerState.status === "started") {
      secondsRemaining -= timerState.secsCompletedAtPause;
      dispatchTimerState({ type: "clearPause", secsCompletedAtPause: 0 });
    }
    // console.log(secondsRemaining, "updated")

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
