export const initialTimerState = {
  // (minutes)
  timers: {
    pomodoro: 0.1,
    shortBreak: 0.1,
    longBreak: 0.1,
    longBreakInterval: 4,
  },
  autoStartPomodoros: false, // settings
  autoStartBreaks: false, // settings
  status: "initial", // initial, started, paused, finished
  mode: "pomodoro", // pomodoro, shortBreak, longBreak
  completedPomodoros: 0,
  startedAt: null,
  timeFocused: { hours: 0, minutes: 0 },
};

export function timerReducer(timerState, action) {
  switch (action.type) {
    case "started":
      return {
        ...timerState,
        status: "started",
      };
    case "paused":
      return { ...timerState, status: "paused" };
    case "finishedPomodoro":
      return {
        ...timerState,
        completedPomodoros: action.completedPomodoros,
        mode: action.mode,
        timeFocused: action.timeFocused,
        status: action.status,
      };
    case "finishedBreak":
      return {
        ...timerState,
        mode: action.mode,
        status: action.status,
      };
    case "changeTimerSettings":
      return {
        ...timerState,
        timers: action.timers,
        autoStartBreaks: action.autoStartBreaks,
        autoStartPomodoros: action.autoStartPomodoros,
      };
    case "changeMode":
      return {
        ...timerState,
        mode: action.mode,
        status: action.status,
      };
  }
}
