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
import { updateTimerSettings } from "../../api/db";

/* eslint-disable react/prop-types */
export default function Settings() {
  const { timerState, dispatchTimerState } = useContext(TimerContext);
  const { dispatchIsOpen } = useContext(IsOpenContext);
  const { countdownState, dispatchCountdown } = useContext(CountdownContext);
  const timerSettingsDocumentId = timerState.$id;

  const [userTimers, setUserTimers] = useState({
    pomodoro: timerState.pomodoro,
    shortBreak: timerState.shortBreak,
    longBreak: timerState.longBreak,
    longBreakInterval: timerState.longBreakInterval,
    autoStartPomodoros: timerState.autoStartPomodoros,
    autoStartBreaks: timerState.autoStartBreaks,
  });

  // const [autoStartPomodoros, setAutoStartPomodoros] = useState(
  //   timerState.autoStartPomodoros
  // );
  // const [autoStartBreaks, setAutoStartBreaks] = useState(
  //   timerState.autoStartBreaks
  // );

  function saveSettings() {
    let secondsRemaining =
      timerState.status === "paused"
        ? userTimers[timerState.mode] * 60 -
          (timerState[timerState.mode] * 60 - countdownState.secondsRemaining)
        : userTimers[timerState.mode] * 60;

    if (timerState.secsCompletedAtPause && timerState.status === "started") {
      secondsRemaining -= timerState.secsCompletedAtPause;
      dispatchTimerState({ type: "clearPause", secsCompletedAtPause: 0 });
      updateTimerSettings(timerSettingsDocumentId, { secsCompletedAtPause: 0 });
    }
    // console.log(secondsRemaining, "updated")

    dispatchIsOpen({ type: "toggleMenu", menu: "settings" });

    dispatchTimerState({
      type: "changeTimerSettings",
      timerSettings: userTimers,

      // autoStartBreaks: autoStartBreaks,
      // autoStartPomodoros: autoStartPomodoros,
    });

    updateTimerSettings(timerSettingsDocumentId, { ...userTimers });

    dispatchCountdown({
      type: "setCountdown",
      secondsRemaining: secondsRemaining,
    });
  }
  return (
    <SettingsContainer saveSettings={saveSettings}>
      <TimeSettings userTimers={userTimers} setUserTimers={setUserTimers} />
      <AutoStartOptions userTimers={userTimers} setUserTimers={setUserTimers} />
      <LongBreakInterval
        userTimers={userTimers}
        setUserTimers={setUserTimers}
      />
      <Footer saveSettings={saveSettings} />
    </SettingsContainer>
  );
}
