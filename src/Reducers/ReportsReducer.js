export const initialReports = {
  hoursFocused: 83, // total hours
  daysAccessed: 21, // fetched from the DB
  dayStreak: 18, // fetched from the DB
  timeLine: [
    {
      id: "9f737bfb-083e-4a8c-b172-6cd796e5c57e",
      task: "React.js",
      startedAt: 1736751564394,
      endedAt: 1736751624405,
    },
    {
      id: "65641c70-3fa9-4b22-a671-49d18904fed2",
      task: "React.js",
      startedAt: 1736751436540,
      endedAt: 1736751486554,
    },
    {
      id: "64a492ea-3215-4d0a-bdd6-89ece9fc8759",
      task: "React.js",
      startedAt: 1736751346570,
      endedAt: 1736751406582,
    },
    {
      id: "49ad78bc-644e-459b-b48f-8d2aa258139b",
      task: "React.js",
      startedAt: 1736751096606,
      endedAt: 1736751239014,
    },
    {
      id: "b7c078b1-06dc-4722-b7e5-335e704ba0a0",
      task: "TypeScript",
      startedAt: 1738848884047,
      endedAt: 1738849325218,
    },
    {
      id: "a0d9f5e5-4f06-49a5-b7fa-451a150f1895",
      task: "React.js",
      startedAt: 1738875166307,
      endedAt: 1738875564213,
    },
    {
      id: "bddb01cf-1b9c-4a8d-b0f6-a192e6fa7c7a",
      task: "Next.js",
      startedAt: 1738880904762,
      endedAt: 1738881222074,
    },
    {
      id: "021cef2f-f69e-4254-92c9-003f0e569ae9",
      task: "Node.js",
      startedAt: 1738894953693,
      endedAt: 1738895099459,
    },
    {
      id: "03f7b6fd-c1fd-4c4a-8321-d3fc03777406",
      task: "JavaScript",
      startedAt: 1738848161932,
      endedAt: 1738848629800,
    },
    {
      id: "4918e4fd-1900-4d82-8839-a6214ee6332b",
      task: "Next.js",
      startedAt: 1738814849688,
      endedAt: 1738815254606,
    },
    {
      id: "e79a2309-09ee-43c7-940f-ee3a309b0865",
      task: "Express.js",
      startedAt: 1738857171606,
      endedAt: 1738857695381,
    },
    {
      id: "35ec9d43-826a-4033-8f27-596a736bba4c",
      task: "JavaScript",
      startedAt: 1738858092737,
      endedAt: 1738858282463,
    },
    {
      id: "e6cab53c-7515-4461-95b6-6280b62d0d74",
      task: "GraphQL",
      startedAt: 1738829563817,
      endedAt: 1738830064723,
    },
    {
      id: "ae2e3eb7-4c29-4dde-9437-ae62ac76db64",
      task: "MongoDB",
      startedAt: 1738862511603,
      endedAt: 1738863002305,
    },
    {
      id: "b1ccdaba-ad4f-488b-a2e3-fcca52476760",
      task: "Next.js",
      startedAt: 1738870232527,
      endedAt: 1738870678407,
    },
    {
      id: "0ad60813-9d04-4322-8f3e-aec53451efb0",
      task: "MongoDB",
      startedAt: 1738833605385,
      endedAt: 1738833702615,
    },
    {
      id: "150afaf7-6e2c-4f7a-a43b-1bc0d674dcfa",
      task: "Node.js",
      startedAt: 1738820431717,
      endedAt: 1738820990093,
    },
    {
      id: "3b04b679-10b9-4595-9fce-f6e32e5ecb60",
      task: "Next.js",
      startedAt: 1738844997278,
      endedAt: 1738845225560,
    },
    {
      id: "62923a93-d650-4f7b-81d5-3a9c4e4aa022",
      task: "Redux",
      startedAt: 1738821023887,
      endedAt: 1738821185637,
    },
    {
      id: "ff3391ae-cd80-4c07-800f-c9b036c204d8",
      task: "Node.js",
      startedAt: 1738876579062,
      endedAt: 1738876732600,
    },
    {
      id: "f72a7419-1e6b-4043-b8a0-bb249fe005ff",
      task: "Express.js",
      startedAt: 1738819753363,
      endedAt: 1738820088825,
    },
    {
      id: "66d712da-d93d-4515-9f1d-800bf349061d",
      task: "Next.js",
      startedAt: 1738882353537,
      endedAt: 1738882701943,
    },
    {
      id: "e8778227-97a6-48b4-9b35-8740804dfcd0",
      task: "JavaScript",
      startedAt: 1738839617144,
      endedAt: 1738840017375,
    },
    {
      id: "33803c25-194b-4ae9-9481-de1c9240e085",
      task: "Express.js",
      startedAt: 1738885923903,
      endedAt: 1738886169717,
    },
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
            id: action.id,
            taskId: action.taskId,
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
      };
  }
}
