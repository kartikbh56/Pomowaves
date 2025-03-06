export const initialReports = {
  minutesFocused: 0, // total hours
  daysAccessed: 1, // fetched from the DB
  dayStreak: 1, // fetched from the DB
  timeLine: [], //fetched from the DB and updated from client side as well as in the DB
  totalDocs: 0,
  leaderBoardUserDocumentId:null
};

export function reportsReducer(reportsState, action) {
  switch (action.type) {
    case "initialFetchSummary":
      return {
        ...reportsState,
        ...action.report
      }
    case "updateReport":
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
        minutesFocused:action.minutesFocused,
        timeLine: [
          {
            id: action.id,
            task: action.task,
            startedAt: action.startedAt,
            endedAt: action.endedAt,
          },
          ...reportsState.timeLine,
        ],
      };
    case "deleteEntry":
      return {
        ...reportsState,
        timeLine: action.timeLine,
        totalDocs:reportsState.totalDocs - 1
      };
    case "leadboardUserDocId":
      return {
        ...reportsState,
        leaderBoardUserDocumentId:action.leaderBoardUserDocumentId
      }
  }
}
