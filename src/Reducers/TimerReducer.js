export const initialTimerState = {
  pomodoro: 25, // minutes
  shortBreak: 5, // minutes
  longBreak: 15, // minutes
  longBreakInterval: 4,
  autoStartPomodoros: false, // settings
  autoStartBreaks: false, // settings
  status: "initial", // initial, started, paused
  mode: "pomodoro", // pomodoro, shortBreak, longBreak
  completedPomodoros: 0,
  startedAt: null, // Date.now()
  secsCompletedAtPause: 0,
};

export function timerReducer(timerState, action) {
  switch (action.type) {
    case "initializeTimerSettings":
      return action.timerSettings;
    case "started":
      return {
        ...timerState,
        status: action.status,
        startedAt: action.startedAt,
      };
    case "paused":
      return {
        ...timerState,
        status: action.status,
        startedAt: action.startedAt,
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
        ...action.timerSettings,
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
        secsCompletedAtPause: action.secsCompletedAtPause,
      };
    case "resetCompletedPomodoros":
      return {
        ...timerState,
        completedPomodoros: 0,
      };
  }
}
