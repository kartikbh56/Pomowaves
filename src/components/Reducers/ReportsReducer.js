export const initialReports = {
  hoursFocused: 83, // total hours
  daysAccessed: 21, // fetched from the DB
  dayStreak: 18, // fetched from the DB
  timeLine: [
    {
      "id": "9f737bfb-083e-4a8c-b172-6cd796e5c57e",
      "task": "React.js",
      "startedAt": 1736751564394,
      "endedAt": 1736751624405
    },
    {
      "id": "65641c70-3fa9-4b22-a671-49d18904fed2",
      "task": "React.js",
      "startedAt": 1736751436540,
      "endedAt": 1736751486554
    },
    {
      "id": "64a492ea-3215-4d0a-bdd6-89ece9fc8759",
      "task": "React.js",
      "startedAt": 1736751346570,
      "endedAt": 1736751406582
    },
    {
      "id": "49ad78bc-644e-459b-b48f-8d2aa258139b",
      "task": "React.js",
      "startedAt": 1736751096606,
      "endedAt": 1736751239014
    }
  ], //fetched from the DB and updated from client side
  // as well as in the DB
};

export function reportsReducer(reportsState, action) {
  switch (action.type) {
    case "init":
      return reportsState;
    case "addReport":
    case "pomodoroFinished":
      return {
        ...reportsState,
        timeLine: [
          {
            id:action.id,
            taskId:action.taskId,
            task: action.task,
            startedAt: action.startedAt,
            endedAt : action.endedAt
          },
          ...reportsState.timeLine,
        ],
      };
      case "deleteEntry":
        return{
          ...reportsState,
          timeLine: action.timeLine
        }
  }
}
