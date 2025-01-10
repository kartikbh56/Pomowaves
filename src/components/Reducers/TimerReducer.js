export const initialTimerState = {
  // (minutes)
  timers: {
    pomodoro: 1,
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
  endsAt: null,
  secsCompletedAtPause: 0,
  timeFocused: { hours: 0, minutes: 0 },
};

export function timerReducer(timerState, action) {
  switch (action.type) {
    case "started":
      return {
        ...timerState,
        status: "started",
        startedAt: action.startedAt,
        endsAt: action.endsAt,
      };
    case "paused":
      return {
        ...timerState,
        status: "paused",
        startedAt: null,
        endsAt: null,
        secsCompletedAtPause: action.secsCompletedAtPause,
      };
    case "finishedPomodoro":
      return {
        ...timerState,
        completedPomodoros: action.completedPomodoros,
        mode: action.mode,
        timeFocused: action.timeFocused,
        status: action.status,
        startedAt: action.startedAt,
        endsAt: action.endsAt,
      };
    case "finishedBreak":
      return {
        ...timerState,
        mode: action.mode,
        status: action.status,
        startedAt: action.startedAt,
        endsAt: action.endsAt,
      };
    case "changeTimerSettings":
      return {
        ...timerState,
        timers: action.timers,
        autoStartBreaks: action.autoStartBreaks,
        autoStartPomodoros: action.autoStartPomodoros,
      };
    case "clearPause":
      return {
        ...timerState,
        secsCompletedAtPause: action.secsCompletedAtPause,
      };
    case "changeMode":
      return {
        ...timerState,
        mode: action.mode,
        status: action.status,
        startedAt: action.startedAt,
        endsAt: action.endsAt,
      };
  }
}
