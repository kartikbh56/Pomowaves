export const initialReports = {
  hoursFocused: 0, // total hours
  daysAccessed: 1, // fetched from the DB
  dayStreak: 1, // fetched from the DB
  timeLine: [], //fetched from the DB and updated from client side
  // as well as in the DB
};

export function reportsReducer(reportsState, action) {
  switch (action.type) {
    case "init":
      return reportsState;
    case "pomodoroFinished":
      return {
        ...reportsState,
        timeLine: [
          ...reportsState.timeLine,
          {
            task: action.task,
            timeFocused: action.timeFocused,
            startedAt: action.startedAt,
            endsAt : action.endsAt
          },
        ],
      };
  }
}
