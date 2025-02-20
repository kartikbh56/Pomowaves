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

  const [timerSettings, setTimerSettings] = useState({
    pomodoro: timerState.pomodoro,
    shortBreak: timerState.shortBreak,
    longBreak: timerState.longBreak,
    longBreakInterval: timerState.longBreakInterval,
    autoStartPomodoros: timerState.autoStartPomodoros,
    autoStartBreaks: timerState.autoStartBreaks,
  });

  const currentTimerSettings = {
    pomodoro: timerState.pomodoro,
    shortBreak: timerState.shortBreak,
    longBreak: timerState.longBreak,
    longBreakInterval: timerState.longBreakInterval,
    autoStartPomodoros: timerState.autoStartPomodoros,
    autoStartBreaks: timerState.autoStartBreaks,
  };

  const settingsChanged =
    Object.values(timerSettings).join("") !==
    Object.values(currentTimerSettings).join("");

  function saveSettings() {
    if (settingsChanged) {
      let secondsRemaining =
        timerState.status === "paused"
          ? timerSettings[timerState.mode] * 60 -
            (timerState[timerState.mode] * 60 - countdownState.secondsRemaining)
          : timerSettings[timerState.mode] * 60;

      if (timerState.secsCompletedAtPause && timerState.status === "started") {
        secondsRemaining -= timerState.secsCompletedAtPause;
        dispatchTimerState({ type: "clearPause", secsCompletedAtPause: 0 });
        updateTimerSettings(timerSettingsDocumentId, {
          secsCompletedAtPause: 0,
        });
      }

      dispatchTimerState({
        type: "changeTimerSettings",
        timerSettings: timerSettings,
      });

      updateTimerSettings(timerSettingsDocumentId, { ...timerSettings });

      dispatchCountdown({
        type: "setCountdown",
        secondsRemaining: secondsRemaining,
      });
    }
    dispatchIsOpen({ type: "toggleMenu", menu: "settings" });
  }
  return (
    <SettingsContainer saveSettings={saveSettings}>
      <TimeSettings
        timerSettings={timerSettings}
        setTimerSettings={setTimerSettings}
      />
      <AutoStartOptions
        timerSettings={timerSettings}
        setTimerSettings={setTimerSettings}
      />
      <LongBreakInterval
        timerSettings={timerSettings}
        setTimerSettings={setTimerSettings}
      />
      <Footer saveSettings={saveSettings} settingsChanged={settingsChanged} />
    </SettingsContainer>
  );
}
