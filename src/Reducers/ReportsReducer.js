export const initialReports = {
  minutesFocused: 0, // total hours
  daysAccessed: 0, // fetched from the DB
  dayStreak: 0, // fetched from the DB
  timeLine: [], //fetched from the DB and updated from client side as well as in the DB
  totalDocs: 0,
};

export function reportsReducer(reportsState, action) {
  switch (action.type) {
    case "initialFetchSummary":
      return {
        ...reportsState,
        ...action.report
      }
    case "updateReports":
      return {
        ...reportsState,
        ...action.report
      }
    case "fetchReports":
      return {
        ...reportsState,
        timeLine: action.reports,
        totalDocs: action.totalDocs,
      };
    case "fetchMoreEntries":
      return {
        ...reportsState,
        timeLine: [...reportsState.timeLine,...action.timeLine],
        totalDocs:action.totalDocs
      }
    case "addReport":
      return {
        ...reportsState,
        timeLine: [
          {
            id: action.id,
            task: action.task,
            startedAt: action.startedAt,
            endedAt: action.endedAt,
          },
          ...reportsState.timeLine,
        ],
        minutesFocused:action.minutesFocused
      };
    case "deleteEntry":
      return {
        ...reportsState,
        timeLine: action.timeLine,
        totalDocs:reportsState.totalDocs - 1
      };
  }
}
