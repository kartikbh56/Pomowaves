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
  secsCompletedAtPause: 0,
};

export function timerReducer(timerState, action) {
  switch (action.type) {
    case "started":
      return {
        ...timerState,
        status: "started",
        startedAt: action.startedAt,
      };
    case "paused":
      return {
        ...timerState,
        status: "paused",
        startedAt: null,
        secsCompletedAtPause: action.secsCompletedAtPause,
      };
    case "finishedPomodoro":
      return {
        ...timerState,
        completedPomodoros: action.completedPomodoros,
        mode: action.mode,
        status: action.status,
        startedAt: action.startedAt,
      };
    case "finishedBreak":
      return {
        ...timerState,
        mode: action.mode,
        status: action.status,
        startedAt: action.startedAt,
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
      };
  }
}
