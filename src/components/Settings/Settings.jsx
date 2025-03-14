import { useState } from "react";

import SettingsContainer from "./SettingsContainer";
import TimeSettings from "./TimeSettings";
import AutoStartOptions from "./AutoStartOptions";
import LongBreakInterval from "./LongBreakInterval";
import Footer from "./Footer";
import { useTimerStore } from "../../store/useTimerStore";
import { useIsOpenStore } from "../../store/useIsOpenStore";

/* eslint-disable react/prop-types */
export default function Settings() {
  const pomodoro = useTimerStore((state) => state.pomodoro);
  const shortBreak = useTimerStore((state) => state.shortBreak);
  const longBreak = useTimerStore((state) => state.longBreak);
  const longBreakInterval = useTimerStore((state) => state.longBreakInterval);
  const autoStartBreaks = useTimerStore((state) => state.autoStartBreaks);
  const autoStartPomodoros = useTimerStore((state) => state.autoStartPomodoros);
  const saveSettings = useTimerStore((state) => state.saveSettings);
  const toggleMenu = useIsOpenStore((state) => state.toggleMenu);

  const closeSettings = () => toggleMenu("settings");

  const [timerSettings, setTimerSettings] = useState({
    pomodoro,
    shortBreak,
    longBreak,
    longBreakInterval,
    autoStartPomodoros,
    autoStartBreaks,
  });

  function saveTimerSettings() {
    const currentTimerSettings = {
      pomodoro,
      shortBreak,
      longBreak,
      longBreakInterval,
      autoStartPomodoros,
      autoStartBreaks,
    };
    const timerSettingsValues = Object.values(timerSettings);
    const currentTimerSettingsValues = Object.values(currentTimerSettings);

    // compare the values of timer settings in global state with the local state ones, saveSettings() only if they are different.
    const settingsChanged = timerSettingsValues.some(
      (value, index) => value !== currentTimerSettingsValues[index]
    );
    if (settingsChanged) {
      saveSettings(timerSettings);
    }
    closeSettings();
  }

  return (
    <SettingsContainer
      saveSettings={saveTimerSettings}
      discardChanges={closeSettings}
    >
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
      <Footer saveSettings={saveTimerSettings} />
    </SettingsContainer>
  );
}
